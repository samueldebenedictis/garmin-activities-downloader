import { Client } from "./client";
import { getListToDownload, setupCredentials, setupDir, setupDownloadedActivities } from "./tools";

async function main() {
  const format = process.argv[2] === 'gpx' ? 'gpx' : 'tcx'
  console.log(`Selected format: ${format}`)
  console.log("Setup credentials");
  const { username, password } = await setupCredentials();
  console.log("Setup directories");
  await setupDir();
  console.log("Setup client");
  const client = new Client(username, password);
  console.log("Login started");
  await client.login();
  console.log("Login completed");
  console.log("Download activities list started");
  await client.getList();
  console.log("Download activities list completed");
  await setupDownloadedActivities();
  const list = await getListToDownload();
  await client.downloadList(list, format);
}

main();
