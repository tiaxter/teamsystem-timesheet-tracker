export default function help() {
    const lines = [
        'Usage: ts-tracker <command> [options]',
        '\nCommands:',
        '  add       Add a new activity',
        '  start     Start an activity',
        '  end       End an activity',
        '  log       Log activities',
        '  export    Export activities',
        '  help     Show this help message',
        '',
        // '\nOptions:', // TODO: aggiungere delle options al comando start
    ];

    console.log(lines.join('\n'));
}