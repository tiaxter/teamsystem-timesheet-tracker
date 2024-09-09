import type {PromptMethodConfigParam, SelectMethodConfigParam} from "../types";

export default class PromptService {
    public static prompt(
        message: string,
        config: PromptMethodConfigParam,
    ): string | null | undefined {
        let answer;

        if (config?.required ?? false) {
            do {
                answer = prompt(message);
            } while (!answer || (config?.validate && !config?.validate(answer)));

            return answer;
        }

        return prompt(message);
    }

    public static select<T>(choices: T[], config: SelectMethodConfigParam<T>): T | null | undefined {
        const selectText = `${config.selectText ?? 'Select an option:'}`;
        let answer;

        console.log(
            choices.map(config.textCallback)
                .map((text, index) => `${index}. ${text}`)
                .join('\n') + '\n'
        );

        if (config?.required ?? false) {
            do {
                answer = parseInt(prompt(selectText)!);
            } while (answer < 0 || answer >= choices.length || isNaN(answer));

            return choices[answer];
        }

        answer = parseInt(prompt(selectText, '-1')!);

        return choices[answer];
    }
}