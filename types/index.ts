export type IssueBasicData = {
    code: string,
    description: string,
};

export type ParentAndEpicData = {
    epic: IssueBasicData,
    task: IssueBasicData,
}

export type PromptMethodConfigParam = {
    required?: boolean,
    validate?: null | ((data: string | null | undefined) => boolean)
} | undefined | null;

export type SelectMethodConfigParam<T> = {
    required?: boolean,
    textCallback: (data: T) => string,
    selectText?: string,
};

export * from './activity.ts';