import { PromptService, ActivityService, type JiraService } from "../services";
import {DATE_FORMAT} from "../constants";
import {selectActivityTypology} from "../helpers";
import dayjs from 'dayjs';

export default async function startActivity(jiraService: JiraService) {
    const activityType = await selectActivityTypology();
    const taskCode = PromptService.prompt('Enter the task code:', {required: true})!;

    // Retrieve the task data
    const {epic, task} = await jiraService.retrieveParentAndEpicData(taskCode);

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