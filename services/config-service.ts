export default class ConfigService {
    private readonly path: string;

    public constructor() {
        this.path = `${Bun.env.HOME}/.timesheet-tracker/config.toml`
    }

    public doesConfigExist(): Promise<boolean> {
        return Bun.file(this.path).exists();
    }

    public write(data: Record<string, Record<string, string>>): Promise<number> {
        const toml = Object.entries(data)
            .map(([key, value]) => {
                const childValues = Object.entries(value)
                    .map(([key, value]) => `${key} = ${value}`)
                    .join('\n');

                return `[${key}]\n${childValues}`;
            })
            .join('\n');

        return Bun.write(this.path, toml);
    }

    public get(): Promise<Record<string, any>> {
        return import(this.path).then(module => module.default);
    }
}