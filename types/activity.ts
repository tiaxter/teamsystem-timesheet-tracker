export type ActivityTypology = {
    interventionCode : string,
    interventionDescription : string,
    taskCode : string,
    taskDescription : string,
    productCode : string,
    productDescription? : string | null | undefined
    projectCode : string
    projectDescription : string,
    customerCode : string,
};

export type Activity = {
    startDate: string;
    endDate: string | null | undefined;
    typology: ActivityTypology,
    epic?: {
        code?: string,
        description?: string,
    },
    task?: {
        code?: string,
        description?: string,
    },
};