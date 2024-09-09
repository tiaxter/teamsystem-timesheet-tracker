import { PromptService, ActivityService, type JiraService } from "../services";
import {DATE_FORMAT} from "../constants";
import {selectActivityTypology} from "../helpers";
import dayjs from 'dayjs';

export default async function startActivity(jiraService: JiraService) {
    const activityType = await selectActivityTypology();

    let taskCode, epic, task;
    if (activityType.projectDescription !== 'N.A.') {
        // Ask for the task code
        taskCode = PromptService.prompt('Enter the task code:', {required: true})!;

        // Retrieve the task data
        const parentAndEpicData = await jiraService.retrieveParentAndEpicData(taskCode);
        epic = parentAndEpicData.epic;
        task = parentAndEpicData.task
    }

    // Start the activity
    const activityService = new ActivityService();
    await activityService.startActivity({
        typology: activityType,
        startDate: dayjs().format(DATE_FORMAT),
        endDate: null,
        epic,
        task,
    });
}