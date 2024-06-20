import fs from "fs";
import { GarminConnect } from "garmin-connect";
import { dirData, dirList, mergeIds } from "./tools";

export class Client {
  private istance: GarminConnect;
  baseUrl = "https://connectapi.garmin.com";

  constructor(username: string, password: string) {
    const GCClient = new GarminConnect({
      username,
      password,
    });
    this.istance = GCClient;
  }

  async login() {
    await this.istance.login();
  }

  async getList() {
    const limit = 100;
    let start = 0;
    while (true) {
      const partialList = await this.istance.get(
        `${this.baseUrl}/activitylist-service/activities/search/activities?limit=${limit}&start=${start}`
      );
      await fs.writeFileSync(
        `${dirList}/list-${start}-${start + limit}.json`,
        JSON.stringify(partialList, undefined, 2)
      );
      if ((partialList as any[]).length !== limit) {
        break;
      }
      start += limit;
    }
    await mergeIds()
  }

  async download(id: number | string, format: "tcx" | "gpx") {
    const url = `${this.baseUrl}/download-service/export/${format}/activity/${id}`;
    const data = await this.istance.get(url);
    await fs.writeFileSync(`${dirData}/${format}/${id}.${format}`, data as string);
  }

  async downloadList(ids: number[] | string[], format: "tcx" | "gpx") {
    const len = ids.length
    for (const [index, id] of ids.entries()) {
      console.log(`Downloaded ${index+1}/${len}`)
      await this.download(id, format)
    }
  }
}
