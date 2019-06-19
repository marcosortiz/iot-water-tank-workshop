import Config from './config.json';

export default {
    region: Config.region,
    cognito: {
        IdentityPoolId: Config.IdentityPoolId,
        UserPoolId: Config.UserPoolId,
        userPoolWebClientId: Config.userPoolWebClientId
    }
};