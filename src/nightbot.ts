import axios from 'axios';

const URL = 'https://api.nightbot.tv';

export enum UserLevel {
    Admin = 'admin',
    Owner = 'owner',
    Moderator = 'moderator',
    TwitchVIP = 'twitch_vip',
    Regular = 'regular',
    Subscriber = 'subscriber',
    Everyone = 'everyone',
}

export class Command {
    _id?: string; /* eslint-disable no-underscore-dangle */

    coolDown: number;

    message: string;

    name: string;

    userLevel: UserLevel;

    constructor(
        name: string,
        message: string,
        userLevel: UserLevel = UserLevel.Everyone,
        coolDown = 5,
    ) {
        this.name = name;
        this.message = message;
        this.userLevel = userLevel;
        this.coolDown = coolDown;
    }

    isEqual(c: Command): boolean {
        return (
            this.name === c.name
            && this.message === c.message
            && this.userLevel === c.userLevel
            && this.coolDown === c.coolDown
        );
    }

    copyId(c: Command): void {
        this._id = c._id;
    }
}

export async function commands(token: string): Promise<Array<Command>> {
    const request = await axios.get(`${URL}/1/commands`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    return request.data.commands;
}

export async function addCommand(token: string, cmd: Command): Promise<void> {
    try {
        await axios.post(`${URL}/1/commands`, cmd, {
            headers: { Authorization: `Bearer ${token}` },
        });
    } catch (error) {
        console.log('Failed add with ', error);
    }
}

export async function updateCommand(
    token: string,
    cmd: Command,
): Promise<void> {
    try {
        await axios.put(`${URL}/1/commands/${cmd._id}`, cmd, {
            headers: { Authorization: `Bearer ${token}` },
        });
    } catch (error) {
        console.log('Failed update with ', error);
    }
}

export async function deleteCommand(
    token: string,
    cmd: Command,
): Promise<void> {
    try {
        await axios.delete(`${URL}/1/commands/${cmd._id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
    } catch (error) {
        console.log('Failed delete with ', error);
    }
}
