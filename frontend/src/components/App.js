import React from 'react';
import Amplify from 'aws-amplify';
import {withAuthenticator, Greetings, SignIn, RequireNewPassword, ConfirmSignIn, VerifyContact, ForgotPassword} from 'aws-amplify-react';
import Config from '../config';
import TankList from './dashboard/TankList';

class App extends React.Component {

    constructor(props) {
        super(props);
        // console.log(this.props.authData.attributes.email);
        // console.log(this.props.authData.signInUserSession.accessToken.payload['cognito:groups']);
        this.state = { 
            // email: this.props.authData.attributes.email,
            // groups: this.props.authData.signInUserSession.accessToken.payload['cognito:groups']
        };            
    }


    render() {
        return (
            <div className="ui segment basic">
                <div className="ui container">
                    <TankList groups={this.state.groups}/>
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
