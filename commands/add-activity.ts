import { PromptService, ActivityService, JiraService } from "../services";
import { selectActivityTypology, validate as dateValidator } from "../helpers";
import dayjs from 'dayjs';

export default async function addActivity(jiraService: JiraService) {
    const exampleDate = dayjs().format('YYYY-MM-DD HH:mm');

    const activityType = await selectActivityTypology();
    // TODO: check that difference between begin and end date must be less or equal to 8 hours
    const beginDate = PromptService.prompt(`Enter the begin date: (eg ${exampleDate})`, {
        required: true,
        validate: dateValidator
    })!;
    const endDate = PromptService.prompt(`Enter the end date: (eg ${exampleDate})`, {
        required: true,
        validate: dateValidator
    })!;

    let taskCode, epic, task;
    if (activityType.projectDescription !== 'N.A.') {
        // Ask for the task code
        taskCode = PromptService.prompt('Enter the task code:', {required: true})!;

        // Retrieve the task data
        const parentAndEpicData = await jiraService.retrieveParentAndEpicData(taskCode);
        epic = parentAndEpicData.epic;
        task = parentAndEpicData.task
    }


    // Add the activity
    const activityService = new ActivityService();
    await activityService.addActivity({
        startDate: beginDate,
        endDate: endDate,
        typology: activityType,
        epic,
        task,
    })
}