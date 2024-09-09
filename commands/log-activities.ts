import { ActivityService } from "../services";
import dayjs from 'dayjs';
import type {Activity} from "../types";
import {DATE_FORMAT} from "../constants";
import chalk from 'chalk';

export default async function logActivities() {
    // Retrieve the current timesheet file
    const activityService = new ActivityService();
    const currentFile = activityService.getTimesheetFileByPeriod();
    const activities = await activityService.getJsonContent(currentFile);

    if (!activities.length) {
        console.log('No activities found');
        return;
    }

    const table = activities.map((activity: Activity) => {
        const begin = dayjs(activity.startDate, DATE_FORMAT);
        const end = dayjs(activity.endDate, DATE_FORMAT);

        return {
            [chalk.green('Date')]: chalk.gray(begin.format('YYYY-MM-DD')),
            [chalk.green('Begin')]: chalk.gray(begin.format('HH:mm')),
            [chalk.green('End')]: chalk.gray(end.isValid() ? end.format('HH:mm') : ''),
            [chalk.green('Task typology')]: chalk.gray(`${activity.typology.interventionDescription} (${activity.typology.projectDescription})`),
            [chalk.green('Task')]: chalk.gray(activity?.task?.code ?? ''),
            [chalk.green('Epic')]: chalk.gray(activity?.epic?.code ?? ''),
        };
    });

    // Map activities fields
    console.table(table);
}