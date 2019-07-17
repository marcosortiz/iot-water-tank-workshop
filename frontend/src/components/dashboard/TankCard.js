import React from 'react';
import { Card, Header, Icon, Label, List, Popup, Segment } from 'semantic-ui-react';
import TankLevelGauge from './TankLevelGauge';
import { Hub } from 'aws-amplify';

class TankCard extends React.Component {

    state = { 
        shadow: {
            telemetryRate: '?',
            minThreshold: '?',
            maxThreshold: '?',
        },
        tankLevel: 50,
        color: '#0000FF',
        telemetry: [],
        minColor: 'blue',
        maxColor: 'blue',
    };

    updateTelemetry(data, maxSize=900) {
        var telemetry = this.state.telemetry;
        var arr = telemetry.concat(data);
        while(arr.length > maxSize) {
            arr.shift();
        }
        var latestTankLevel =  parseInt(arr[arr.length - 1].tankLevel);
        this.setState({
            telemetry: arr, 
            tankLevel: latestTankLevel,
            color: this.getColor(latestTankLevel),
            minColor: this.getMinThresholdColor(latestTankLevel),
            maxColor: this.getMaxThresholdColor(latestTankLevel)
        });
    }

    onTelemetrtData(data) {
        var telemetry = data.payload.data;
        this.updateTelemetry(telemetry);
    }

    onShadowUpdate(data) {
        var shadow = {
            telemetryRate: data.payload.data.telemetryPerMinRate,
            minThreshold: data.payload.data.minTankLevelThreshold,
            maxThreshold: data.payload.data.maxTankLevelTjreshold,
        }
        this.setState({
            shadow: shadow,
        });
    }

    componentWillMount() {
        Hub.listen(this.props.tankName, (data) => {
            if (data.payload.event === 'telemetry') {
                this.onTelemetrtData(data);           
            } else if(data.payload.event === 'shadowUpdate') {
                this.onShadowUpdate(data);   
            }
        })
        Hub.remove(this.props.tankName);
    }

    componentWillUnmount() {
        Hub.remove(this.props.tankName);
    }

    getColor(value) {
        var min = this.state.shadow.minThreshold
        var max = this.state.shadow.maxThreshold;

        return (value > max || value < min) ? '#FF0000' : '#0000FF';
    }

    getMinThresholdColor(value) {
        var min = this.state.shadow.minThreshold;

        return (value < min) ? 'red' : 'blue';
    }

    getMaxThresholdColor(value) {

        var max = this.state.shadow.maxThreshold;

        return (value > max) ? 'red' : 'blue';
    }

    getWidget() {
        if(this.state.telemetry.length > 0) {
            return (
                <TankLevelGauge 
                    tankName={this.props.tankName}
                    value={this.state.tankLevel}
                    min={this.state.shadow.minThreshold}
                    max={this.state.shadow.maxThreshold} 
                    color={this.state.color} 
                />
            )    
        } else {
            return (
                <Segment placeholder>
                    <Header icon>
                        <Icon loading name='spinner' />
                    </Header>
                    <Segment.Inline>
                        <Label> No data available yet. </Label>
                    </Segment.Inline>
                </Segment>
            )
        }
    }

    renderContent() {
        return (
            <div>
                <Card key={this.props.tankName}>
                    <Card.Content>
                        <Card.Header textAlign="center">
                            {this.props.tankName}
                        </Card.Header>
                        <Card.Meta textAlign="center" >
                            <Popup
                                trigger={<Icon circular name='rss' inverted color='grey' />}
                                content={`MQTT telemetry topic for ${this.props.tankName}.`}
                                size='mini'
                            /> tanks/{this.props.tankName}/telemetry 


                        </Card.Meta>
                    </Card.Content>
                    <Card.Content textAlign='center'>
                        {this.getWidget()}
                    </Card.Content>
                    <Card.Content textAlign="center" extra>
                        <Card.Header textAlign="center">Shadow Values</Card.Header>
                        <List horizontal>
                            <List.Item>
                                <List.Content>
                                    <Popup
                                        trigger={<Icon circular name='wifi' inverted color='blue' />}
                                        content='Telemetry per minute pushing rate.'
                                        size='mini'
                                    /> {this.state.shadow.telemetryRate} tpm
                                </List.Content>
                            </List.Item>
                            <List.Item>
                                <List.Content>
                                    <Popup
                                        trigger={<Icon circular name='thermometer full' inverted color={this.state.maxColor} />}
                                        content='Max tank level threshold (%).'
                                        size='mini'
                                    /> {this.state.shadow.maxThreshold}%
                                </List.Content>
                            </List.Item>
                            <List.Item>
                                <List.Content>

                                    <Popup
                                        trigger={<Icon circular name='thermometer empty' inverted color={this.state.minColor}  />}
                                        content='Min tank level threshold (%).'
                                        size='mini'
                                    /> {this.state.shadow.minThreshold}%
                                </List.Content>
                            </List.Item>
                        </List>
                    </Card.Content>
                </Card>
            </div>
        );
    }

    render() {
        return (
            this.renderContent()
        );
    }

}

export default TankCard;