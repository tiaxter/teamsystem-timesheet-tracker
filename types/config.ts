export type Config = {
    jira: {
        domain: string,
        token: string,
        email: string,
    },
    user: {
        name: string,
        surname: string,
        nickname: string,
    },
    timesheet: {
        app: string,
        directionCode: string, // HR
        direction: string, // CTO - HRS
        team: string, // Team DIC
    }
};