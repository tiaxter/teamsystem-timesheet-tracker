import type {ActivityTypology} from "../types";
import {TYPOLOGIES_FILE} from "../constants";
import PromptService from "../services/prompt-service.ts";

export async function selectActivityTypology() {
    const typologies: ActivityTypology[] = (await import(TYPOLOGIES_FILE).then((module) => module.default)).typologies;

    return PromptService.select<ActivityTypology>(typologies, {
        required: true,
        selectText: 'Enter the activity type:',
        textCallback: (typology) => `${typology.interventionDescription} (${typology.projectDescription})`,
    })!;
}