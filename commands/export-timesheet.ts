import * as XSLX from 'xlsx';
import * as fs from 'fs';
import {DATE_FORMAT, TEMPLATE_XLSX_FILE, TIMESHEET_DIRECTORY} from "../constants";
import ActivityService from "../services/activity-service.ts";
import dayjs from "dayjs";
import type {Config} from "../types/config.ts";
import * as path from "node:path";
XSLX.set_fs(fs);

export default async function exportTimesheet(config: Config) {

    const activityService = new ActivityService();
    const file = activityService.getTimesheetFileByPeriod();
    const data = await activityService.getJsonContent(file);

    // Read the template file
    const workbook = XSLX.readFile(TEMPLATE_XLSX_FILE);
    // Get the sheet
    const sheet = workbook.Sheets['INCOLLA QUI'];
    // Prepare the data
    const aoa = data.map((record) => {
        return [
            dayjs(record.startDate, DATE_FORMAT).format('DD/MM/YYYY'), // Date
            config.timesheet.directionCode, // Direction Code
            config.timesheet.direction, // Direction
            config.timesheet.team, // Team
            `${config.user.surname} ${config.user.name}`.toUpperCase(), // Name
            record.typology.interventionCode, // Intervention Code
            record.typology.interventionDescription, // Intervention Description
            record.typology.taskCode, // Task Code
            record.typology.taskDescription, // Task Description
            record.typology.productCode, // Product Code
            record.typology.projectDescription, // Project Description
            record.typology.projectCode, // Project Code
            record.typology.projectDescription, // Project Description
            record.typology.customerCode, // Customer Code
            config.timesheet.app, // Customer description
            dayjs(record.endDate, DATE_FORMAT).diff(dayjs(record.startDate, DATE_FORMAT), 'hour'), // Hours
            '', // Matricola
            config.user.surname.toUpperCase(), // Surname
            config.user.name.toUpperCase(), // Name
            config.user.nickname.toLowerCase(), // Nickname
            record?.epic?.code ?? '', // Epic Code
            record?.epic?.description ?? '', // Epic Description
            (!record.epic?.code || !record.task?.code) ? '' : `${record.epic.code}|${record.task.code}`, // Issue code
            record?.task?.description ?? '', // Issue Description
        ];
    });

    const filename = path.basename(file.name!).split('.')[0];

    // Add the data to the sheet
    XSLX.utils.sheet_add_aoa(sheet, aoa, {origin: 'B2'});
    // Write the file
    XSLX.writeFile(workbook, `${TIMESHEET_DIRECTORY}/${filename}.xlsx`);

    console.log(`Timesheet exported to ${TIMESHEET_DIRECTORY}/${filename}.xlsx`);
}