import 'dotenv/config';
import express from 'express';
import { AuthorizationCode } from 'simple-oauth2';

export function TokenCallback(
    app: express.Express,
    port: number,
    callback: (token: string) => void,
) {
    // Check for NIGHTBOT environment variables.
    if (
        !('NIGHTBOT_CLIENT_ID' in process.env)
        || !('NIGHTBOT_CLIENT_SECRET' in process.env)
    ) {
        console.log("Couldn't find Nightbot settings");
        console.log('   Add NIGHTBOT_CLIENT_ID and NIGHTBOT_CLIENT_SECRET');
        process.exit(1);
    }

    const client = new AuthorizationCode({
        client: {
            id: process.env.NIGHTBOT_CLIENT_ID || '',
            secret: process.env.NIGHTBOT_CLIENT_SECRET || '',
        },
        auth: {
            tokenHost: 'https://api.nightbot.tv',
            tokenPath: 'oauth2/token',
            authorizePath: 'oauth2/authorize',
        },
    });

    const authUri = client.authorizeURL({
        redirect_uri: `http://localhost:${port}/token`,
        scope: 'commands',
    });

    app.get('/auth', (req, res) => {
        console.log(authUri);
        res.redirect(authUri);
    });

    app.get('/', (req, res) => {
        res.send('<a href="/auth">Log In</a>');
    });

    app.get('/token', async (req, res) => {
        const { code } = req.query;
        if (typeof code !== 'string') {
            console.log('Unknown token type');
            return;
        }
        const options = {
            code,
            redirect_uri: `http://localhost:${port}/token`,
        };

        res.redirect('/');

        const accessToken = await client.getToken(options);
        callback(accessToken.token.access_token);
    });
}
