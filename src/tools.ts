import fs from "fs";
import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

export const dirData = "data";
export const dirList = `${dirData}/list`;
export const dirGpx = `${dirData}/gpx`;
export const dirTcx = `${dirData}/tcx`;

export async function setupDir() {
  for (const dir of [dirData, dirList, dirGpx, dirTcx]) {
    if (!fs.existsSync(dir)) {
      await fs.mkdirSync(dir);
    }
  }
}

export async function mergeIds() {
  const files = await fs.readdirSync(dirList);
  const activities: string[] = [];
  for (const file of files.filter((f) => f.includes("list-"))) {
    const buffer = await fs.readFileSync(`${dirList}/${file}`, "utf-8");
    const data = JSON.parse(buffer);
    const ids = data.map((el: { activityId: number }) => {
      return `${el.activityId}`;
    });
    activities.push(...ids);
  }
  console.log(`Found ${activities.length} activities`);
  await fs.writeFileSync(
    `${dirList}/all-ids.json`,
    JSON.stringify(activities, undefined, 2)
  );
}

export async function setupDownloadedActivities() {
  console.log("Read downloaded gpx");
  const gpxFiles = await fs.readdirSync(dirGpx);
  const gpxList = gpxFiles.map((fileName) => fileName.replace(".gpx", ""));

  console.log("Read downloaded tcx");
  const tcxFiles = await fs.readdirSync(dirTcx);
  const tcxList = tcxFiles.map((fileName) => fileName.replace(".tcx", ""));

  const allDownloaded = [...tcxList, ...gpxList];

  await fs.writeFileSync(
    `${dirList}/downloaded-ids.json`,
    JSON.stringify(allDownloaded, undefined, 2)
  );
}

export async function setupCredentials() {
  const credentialsFile = "credentials.json";
  if (!fs.existsSync(credentialsFile)) {
    const rl = readline.createInterface({ input, output });
    const username = await rl.question("Username: ");
    const password = await rl.question("Password: ");
    await fs.writeFileSync(
      credentialsFile,
      JSON.stringify({ username, password }, undefined, 2)
    );
  }

  const buffer = await fs.readFileSync(credentialsFile, "utf-8");
  const { username, password } = JSON.parse(buffer) as {
    username: string;
    password: string;
  };

  return { username, password };
}

export async function getListToDownload() {
  const downloadedBuffer = await fs.readFileSync(
    `${dirList}/downloaded-ids.json`,
    "utf-8"
  );
  const allBuffer = await fs.readFileSync(`${dirList}/all-ids.json`, "utf-8");
  const downloaded = JSON.parse(downloadedBuffer) as string[];
  const all = JSON.parse(allBuffer) as string[];
  const filtered = all.filter((el) => !downloaded.includes(el));

  console.log(`${all.length} activities in total`);
  console.log(`${downloaded.length} activities downloaded`);
  console.log(`${filtered.length} activities to download`);

  return filtered;
}
