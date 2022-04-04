import 'dotenv/config';

if (
    !('NIGHTBOT_CLIENT_ID' in process.env)
    || !('NIGHTBOT_CLIENT_SECRET' in process.env)
) {
    console.log("Couldn't find Nightbot settings");
    console.log('   Add NIGHTBOT_CLIENT_ID and NIGHTBOT_CLIENT_SECRET');
    process.exit(1);
}
