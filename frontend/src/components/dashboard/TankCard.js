import React from 'react'
import { Card, Icon, List, Popup } from 'semantic-ui-react'
import TankLevelGauge from './TankLevelGauge';

class TankCard extends React.Component {

    state = { 
        shadow: {
            telemetryRate: 6,
            minThreshold: 5,
            maxThreshold: 85,
        },
        tankLevel: 50,
        color: '#0000FF',
    };


    refresh =() => {
        var value = parseInt((Math.random() * 100).toFixed(2))
        this.setState({
            tankLevel: value,
            color: this.getColor(value),
        });
    }

    componentDidMount() {
        this.interval = setInterval(() => this.refresh(), 5000);
    }
    
    componentWillUnmount() {
        clearInterval(this.interval);
    }


    getColor(value) {
        var min = this.state.shadow.minThreshold
        var max = this.state.shadow.maxThreshold;

        return (value > max || value < min) ? '#FF0000' : '#0000FF';
    }

    renderContent() {
        return (
            <div>
                <Card key={this.props.tankName}>
                    <Card.Content>
                        <Card.Header textAlign="center">{this.props.tankName}</Card.Header>
                        <Card.Meta textAlign="center" ></Card.Meta>
                    </Card.Content>
                    <Card.Content>
                        <TankLevelGauge value={this.state.tankLevel} min={this.state.shadow.minThreshold} max={this.state.shadow.maxThreshold} color={this.state.color} />
                    </Card.Content>
                    <Card.Content textAlign="center" extra>
                        <Card.Header textAlign="center">Shadow Values</Card.Header>
                        <List horizontal>
                            <List.Item>
                                <List.Content>
                                    <Popup
                                        trigger={<Icon circular name='wifi' />}
                                        content='Telemetry per minute pushing rate.'
                                        size='mini'
                                    /> {this.state.shadow.telemetryRate} tpm
                                </List.Content>
                            </List.Item>
                            <List.Item>
                                <List.Content>
                                    <Popup
                                        trigger={<Icon circular name='thermometer full' />}
                                        content='Max tank level threshold (%).'
                                        size='mini'
                                    /> {this.state.shadow.maxThreshold}%
                                </List.Content>
                            </List.Item>
                            <List.Item>
                                <List.Content>

                                    <Popup
                                        trigger={<Icon circular name='thermometer empty' />}
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