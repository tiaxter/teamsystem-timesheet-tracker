import ActivityService from "../services/activity-service.ts";

export default async function endActivity() {
    const activityService = new ActivityService();
    await activityService.endActivity()
}