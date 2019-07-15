import React from 'react';
import { Card, Header, Image, Segment } from 'semantic-ui-react';
import Amplify, { Auth, Hub, PubSub } from 'aws-amplify';
import { AWSIoTProvider } from '@aws-amplify/pubsub/lib/Providers';
import IoT from 'aws-sdk/clients/iot';
import TankCard from './TankCard';
import Config from '../../config';
import Lambda from '../../aws/Lambda';
import uuidv4 from 'uuid/v4';

var mqttSubscription = null;

Amplify.addPluggable(
    new AWSIoTProvider({
        aws_pubsub_region: Config.region,
        aws_pubsub_endpoint: `wss://${Config.iotEndpointAddress}/mqtt`,
    })
);

class TankList extends React.Component {

    constructor(props) {
        super(props);
        // // if (this.props.groups.includes('TestAdminRole')) {
        this.state = { 
            tanks: [],
            loading: false,
            telemetry: {}
        };
    }

    listTanks() {
        this.setState( {loading: true} );
        var _this = this;
        Lambda.listTanks(function(err, data) {
            if(err){
                console.log(err);
                _this.setState( {error: err, loading: false} );
            } else {
                _this.setState({
                    loading: false,
                    tanks: data
                });
            }
        });
    }

    attachIotPolicy() {
        Auth.currentCredentials().then((credentials) => {
            const iot = new IoT({
                apiVersion: '2015-05-28',
                credentials: Auth.essentialCredentials(credentials),
                region: Config.region,
            });
            var params = { 
                policyName: Config.IotPolicyName,
                principal: credentials._identityId
            };
            iot.attachPrincipalPolicy(params, function(err, data) {
                if (err) console.log(err, err.stack);
            });
        });
    }

    handleTelemetry(data) {
        var telemetry = data.value.telemetry;
        var topicKey = Object.getOwnPropertySymbols(data.value)[0];
        var topicName = data.value[topicKey];
        var tankName = topicName.split('/')[1];

        Hub.dispatch( tankName, 
            { 
                event: 'telemetry', 
                data: telemetry, 
                message:'' 
        });
    }

    subscribe() {
        var topic = 'tanks/+/telemetry';
        const cliendId = uuidv4();
        var opts = {clientId: cliendId};
        mqttSubscription = PubSub.subscribe([topic], opts).subscribe({
            next: data => this.handleTelemetry(data),
            error: err => console.error(err),
            close: () => console.log('Done'),
        });
    }

    componentWillMount() {
        this.listTanks();
        this.attachIotPolicy();
        this.subscribe();
    }

    componentWillUnmount() {
        if (mqttSubscription !== null) {
            mqttSubscription.unsubscribe();
        }
    }

    renderContent() {
        if(this.state.tanks.length <= 0) {
            return (
                <div>

                    <Segment placeholder>
                        <Header as='h1' textAlign='center'>
                            {/* <Icon name='microchip' /> */}
                            <Image circular src='/images/water_tank.jpg' size='massive'  verticalAlign='middle' />
                            No tanks provisioned yet.
                        </Header>
                    </Segment>
                </div>
            )
        } else {
            return (
                <div>
                    <Card.Group>
                    {this.state.tanks.map((tank, index) => {
                        var tankName = tank.thingName.S;
                        return (
                            <TankCard 
                                key={tankName}
                                tankName={tankName} 
                                telemetry={this.state.telemetry.tankName || []}
                            />
                        )
                    })}
                    </Card.Group>
                </div>
            );    
        } 
    }

    render() {
        
        return (
            this.renderContent()
        );
    }

}

export default TankList