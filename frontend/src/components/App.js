import React from 'react';
import Amplify from 'aws-amplify';
import {withAuthenticator, Greetings, SignIn, RequireNewPassword, ConfirmSignIn, VerifyContact, ForgotPassword} from 'aws-amplify-react';
import Config from '../config';
import TankList from './dashboard/TankList';

class App extends React.Component {

    state = { 
        tanks: [
            'Tank 1',
            'Tank 2',
            'Tank 3',
            'Tank 4',
            'Tank 5',
            'Tank 6'
        ],
    };

    render() {
        return (
            <div className="ui segment basic">
                <div className="ui container">
                    <TankList tanks={this.state.tanks} />
                </div>
            </div>
        );
    }
}

Amplify.configure({
    Auth: {
        identityPoolId: Config.cognito.IdentityPoolId,
        region: Config.region,
        userPoolId: Config.cognito.UserPoolId,
        userPoolWebClientId: Config.cognito.userPoolWebClientId,
        mandatorySignIn: true,
    }
});

export default withAuthenticator(App, true, [
    <Greetings />,
    <SignIn />,
    <RequireNewPassword/>,
    <ConfirmSignIn />,
    <VerifyContact />,
    <ForgotPassword />
]);
