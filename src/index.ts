import express from 'express';
import { TokenCallback } from './oauth';
import * as Nightbot from './nightbot';

const app = express();
const port = 4000; // default port to listen

// start the Express server
app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
});

TokenCallback(app, port, async (token: string) => {
    const currentCommands = await Nightbot.commands(token);
    console.log('Current Commands', currentCommands);

    const commands: { [key: string]: Nightbot.Command } = {
        '!awesome': new Nightbot.Command(
            '!awesome',
            '$(user) is pretty awesome.',
        ),
    };

    currentCommands.forEach(async (c) => {
        console.log(`Command: ${c.name}`);

        if (c.name in commands) {
            if (commands[c.name].isEqual(c)) {
                console.log('Found.');
                delete commands[c.name];
            } else {
                console.log('Updating');
                commands[c.name].copyId(c);
                await Nightbot.updateCommand(token, commands[c.name]);
                delete commands[c.name];
            }
        } else {
            console.log('Deleting');
            await Nightbot.deleteCommand(token, c);
        }
    });

    Object.keys(commands).forEach(async (key) => {
        console.log(`Adding new command: ${key}`);
        await Nightbot.addCommand(token, commands[key]);
    });
});
