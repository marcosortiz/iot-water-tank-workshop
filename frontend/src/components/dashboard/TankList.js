import React from 'react';
import { Card, Header, Image, Segment } from 'semantic-ui-react';
import Amplify, { Auth, Hub, PubSub } from 'aws-amplify';
import { AWSIoTProvider } from '@aws-amplify/pubsub/lib/Providers';
import IoT from 'aws-sdk/clients/iot';
import TankCard from './TankCard';
import Config from '../../config';
import Lambda from '../../aws/Lambda';
import uuidv4 from 'uuid/v4';


const TELEMETRY_EVENT = 'telemetry';
const SHADOW_EVENT    = 'shadowUpdate';

const TELEMETRY_TOPIC              = 'tanks/+/telemetry';
const SHADOW_UPDATE_ACCEPTED_TOPIC = '$aws/things/+/shadow/update/accepted';
const SHADOW_GET_ACCEPTED_TOPIC    = '$aws/things/+/shadow/get/accepted';

// var mqttTelemetrySubscription = null;
// var mqttShadowUpdateAcceptedSubscription = null;
var subscriptions = []

Amplify.addPluggable(
    new AWSIoTProvider({
        aws_pubsub_region: Config.region,
        aws_pubsub_endpoint: `wss://${Config.iotEndpointAddress}/mqtt`,
    })
);

class TankList extends React.Component {

    constructor(props) {
        super(props);
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
                data.forEach(function(obj) {
                    var topicName = `$aws/things/${obj.thingName.S}/shadow/get`;
                    PubSub.publish(topicName, {});
                });
                
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
                event: TELEMETRY_EVENT, 
                data: telemetry, 
                message:'' 
        });
    }

    handleShadowUpdateAccepted(data) {
        var reportedValue = data.value.state.reported;
        var topicKey = Object.getOwnPropertySymbols(data.value)[0];
        var topicName = data.value[topicKey];
        var tankName = topicName.split('/')[2];
        Hub.dispatch( tankName, 
            { 
                event: SHADOW_EVENT, 
                data: reportedValue, 
                message:'' 
        });
    }

    subscribe() {
        const cliendId = uuidv4();
        var opts = {clientId: cliendId};
        var mqttTelemetrySubscription = PubSub.subscribe([TELEMETRY_TOPIC], opts).subscribe({
            next: data => this.handleTelemetry(data),
            error: err => console.error(err),
            close: () => console.log('Done'),
        });
        subscriptions.push(mqttTelemetrySubscription);

        var topics = [SHADOW_UPDATE_ACCEPTED_TOPIC, SHADOW_GET_ACCEPTED_TOPIC];
        var mqttShadowUpdateAcceptedSubscription = PubSub.subscribe(topics, opts).subscribe({
            next: data => this.handleShadowUpdateAccepted(data),
            error: err => console.error(err),
            close: () => console.log('Done'),
        }); 
        subscriptions.push(mqttShadowUpdateAcceptedSubscription);
    }

    componentWillMount() {
        this.listTanks();
        this.attachIotPolicy();
        this.subscribe();
    }

    componentWillUnmount() {
        subscriptions.forEach(function(sub) {
            if (sub !== null) {
                sub.unsubscribe();
            }
        });
    }

    renderContent() {
        if(this.state.tanks.length <= 0) {
            return (
                <div>

                    <Segment placeholder>
                        <Header as='h1' textAlign='center'>
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