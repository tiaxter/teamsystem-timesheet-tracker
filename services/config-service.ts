import {CONFIG_DIRECTORY} from "../constants";
import type {Config} from "../types/config.ts";

export default class ConfigService {
    private readonly path: string;

    public constructor() {
        this.path = `${CONFIG_DIRECTORY}/config.toml`;
    }

    public doesConfigExist(): Promise<boolean> {
        return Bun.file(this.path).exists();
    }

    public write(data: Record<string, Record<string, string>>): Promise<number> {
        const toml = Object.entries(data)
            .map(([key, value]) => {
                const childValues = Object.entries(value)
                    .map(([key, value]) => `${key} = "${value}"`)
                    .join('\n');

                return `[${key}]\n${childValues}`;
            })
            .join('\n');

        return Bun.write(this.path, toml);
    }

    public get(): Promise<Config> {
        return import(this.path).then(module => module.default);
    }
}