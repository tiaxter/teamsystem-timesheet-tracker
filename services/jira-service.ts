import type {ParentAndEpicData} from "../types";

export default class JiraService {
    private readonly apiBaseUrl: string;
    private readonly authenticationToken: string;

    public constructor(domain: string, token: string, email: string) {
        this.apiBaseUrl = `https://${domain}/rest/api/3`;
        this.authenticationToken = Buffer.from(`${email}:${token}`).toString('base64');
    }

    public async retrieveTaskData(code: string): Promise<unknown> {
        const res = await fetch(`${this.apiBaseUrl}/issue/${code}`, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Basic ${this.authenticationToken}`,
            },
        });

        return await res.json();
    }

    public async retrieveParentAndEpicData(code: string): Promise<ParentAndEpicData> {
        let issue: any;
        do {
            const parentKey = issue?.fields?.parent?.key;
            issue = await this.retrieveTaskData(parentKey ?? code)
        } while (issue?.fields?.parent?.fields?.issuetype?.name !== 'Epic');

        const epic = issue!.fields!.parent!;

        return {
            epic: {
                code: epic.key!,
                description: epic.fields!.summary!,
            },
            task: {
                code: issue.key!,
                description: issue.fields!.summary!,
            },
        };
    }
}