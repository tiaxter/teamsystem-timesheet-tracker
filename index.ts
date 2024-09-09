#!/usr/bin/env bun

import { addActivity, logActivities, startActivity, endActivity, exportTimesheet, help } from "./commands";
import { ConfigService, PromptService, JiraService } from "./services";
import type {Config} from "./types/config.ts";
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {TEMPLATE_XLSX_FILE, TIMESHEET_DIRECTORY, TYPOLOGIES_FILE} from "./constants";
import { mkdir } from "node:fs/promises";

dayjs.extend(customParseFormat);

const configService = new ConfigService();
const doesConfigExist = await configService.doesConfigExist();

if (!doesConfigExist) {
    // ask the user info
    const userData: Config = {
        jira: {
            domain: PromptService.prompt('Enter your Jira domain:', { required: true })!,
            email: PromptService.prompt('Enter your Jira email:', { required: true })!,
            token:  PromptService.prompt('Enter your Jira token:', { required: true })!,
        },
        user: {
            name: PromptService.prompt('Enter your name:', { required: true })!,
            surname: PromptService.prompt('Enter your surname:', { required: true })!,
            nickname: PromptService.prompt('Enter your nickname:', { required: true })!,
        },
        timesheet: {
            app: PromptService.prompt('Enter the name of the app:', { required: true })!,
            directionCode: PromptService.prompt('Enter the direction code:', { required: true })!,
            direction: PromptService.prompt('Enter the direction:', { required: true })!,
            team: PromptService.prompt('Enter the team:', { required: true })!,
        },
    };

    // write the config file
    await configService.write(userData);

    // copy typologies.json to config directory
    await Bun.write(TYPOLOGIES_FILE, await Bun.file('typologies.toml').text());

    // copy template.xslx to config directory
    await Bun.write(TEMPLATE_XLSX_FILE, await Bun.file('timesheet-template.xlsx').text());

    // create folder for xlsx timesheets
    await mkdir(TIMESHEET_DIRECTORY, { recursive: true });
}

const config = await configService.get();
const jiraService = new JiraService(config.jira.domain, config.jira.token, config.jira.email);

// Handle command arguments
const command = Bun.argv[2]

switch (command) {
    case 'add':
        await addActivity(jiraService);
        break;
    case 'start':
        await startActivity(jiraService)
        break;
    case 'end':
        await endActivity()
        break;
    case 'log':
        await logActivities(); // TODO: implement
        break;
    case 'export':
        await exportTimesheet(config);
        break;
    default:
        help();
        break;
}