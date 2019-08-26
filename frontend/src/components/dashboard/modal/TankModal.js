import React from 'react';
import {  Button, Divider, Header, Modal } from 'semantic-ui-react';
import Lambda from '../../../aws/Lambda';
import TankLevelEvents from './TankLevelEvents.js';
import TankLevelChart from './TankLevelChart';

class TankModal extends React.Component {

    componentWillUnmount() {
        console.log('TankModal.componentWillUnmount');
        if (this.props.tankName === 'Tank1') {
            Lambda.queryTankLevelEvents(this.props.tankName, function(err, data) {
                if(err) console.log(err, err.stack);
                else {
                    console.log(data);
                }
            });
        }
    }

    renderContent() {
        return (
            <div>
                <Modal trigger={<Button basic color='blue' content='View historical data'/>}>
                    <Header content={`${this.props.tankId} Historical Data`} />
                    <Modal.Content>
                        <Header>Tank Level (%) Over Time (last 15 mins)</Header>
                        <TankLevelChart tankId={this.props.tankId} />
                        <Divider />
                        <Header>Tank Level Events (last 10)</Header>
                        <TankLevelEvents tankId={this.props.tankId}/>
                    </Modal.Content>
                </Modal>
            </div>
        );
    }

    render() {
        return (
            this.renderContent()
        );
    }
}

export default TankModal;