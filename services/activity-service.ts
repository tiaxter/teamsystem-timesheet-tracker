import dayjs, {Dayjs} from "dayjs";
import { type BunFile } from "bun";
import {JSON_TIMESHEET_DATE_FORMAT_FILENAME, JSON_TIMESHEET_DIRECTORY} from "../constants";
import type {Activity} from "../types";

export default class ActivityService {
    public async addActivity(activity: Activity) {
        const file = this.getTimesheetFileByPeriod(dayjs(activity.startDate));
        const json: Activity[] = await this.getJsonContent(file);

        // Add in the json the new activity
        json.push(activity)

        // Save the json
        await this.writeFile(file, json);
    }

    public async startActivity(activity: Activity) {
        const file = this.getTimesheetFileByPeriod();
        const json: Activity[] = await this.getJsonContent(file);

        // if there are other started activity without an end then throw an error
        const hasUnfinishedActivity = json.find((record) => !record.endDate);

        if (hasUnfinishedActivity) {
            console.log('Before start a new activity you should end the previous one');
            process.exit(1);
        }

        // Store an activity setting only the start_date
        json.push(activity);

        // Save the json
        await this.writeFile(file, json);
    }

    public async endActivity() {
        const file = this.getTimesheetFileByPeriod();
        const json: Activity[] = await this.getJsonContent(file);

        // if there are other started activity without an end then throw an error
        const unfinishedActivityIndex = json.findIndex((record) => !record.endDate);

        if (unfinishedActivityIndex === -1) {
            console.error('Cannot find a started activity to update');
            process.exit(1);
        }

        // Set the end_date of the last activity
        json[unfinishedActivityIndex].endDate = dayjs().format('YYYY-MM-DD HH:mm');

        // Save the json
        await this.writeFile(file, json);
    }

    public getTimesheetFileByPeriod(period: Dayjs = dayjs()): BunFile {
        const currentTimesheetFilename = `${period.format(JSON_TIMESHEET_DATE_FORMAT_FILENAME)}.json`.toLowerCase();
        const filePath = `${JSON_TIMESHEET_DIRECTORY}/${currentTimesheetFilename}`;
        return Bun.file(filePath);
    }

    public async getJsonContent(file: BunFile): Promise<Activity[]> {
        if (!await file.exists()) {
            return [];
        }

        return await file.json() as Activity[];
    }

    private async writeFile(file: BunFile, data: Activity[]) {
        await Bun.write(file, JSON.stringify(data, null, 2));
    }
}