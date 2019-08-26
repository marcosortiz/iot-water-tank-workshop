import React from 'react';
import {  Button, Message, Icon, Placeholder } from 'semantic-ui-react';
import Lambda from '../../../aws/Lambda';
import moment from 'moment';

class TankLevelEvents extends React.Component {

    state = {
        events: [],
        loading: false,
        errors: []
    }

    queryTankLevelEvents() {
        this.setState({loading: true});
        var _this = this;
        Lambda.queryTankLevelEvents(this.props.tankId, function(err, data) {
            if(err) {
                console.log(err, err.stack);
                _this.setState({
                    loading: false,
                    errors: [err]
                });
            } 
            else {
                _this.setState({
                    loading: false,
                    errors: [],
                    events: data
                });
            }
        });
    }

    componentWillMount() {
        this.queryTankLevelEvents();
    }

    componentWillUnmount() {
    }

    eventLabelColor(status) {
        if(status === 'dangerous') {
            return 'red';
        } else {
            return 'green';
        }
    }

    onRefreshSubmit = () => {
        this.queryTankLevelEvents();
    }

    renderContent() {
        if(this.state.errors.length !== 0) {
            return(
                <Message>
                    <Button icon floated='right' onClick={this.onRefreshSubmit}>
                        <Icon name='refresh' />
                    </Button>
                    <Message.Header>Error trying to query tank level events</Message.Header>
                    <p>
                    {this.state.errors[0]}
                    </p>
                </Message>
            );
        } else {
            if(this.state.loading === true) {
                return (
                    <div>
                        <Placeholder>
                            <Placeholder.Header image>
                                <Placeholder.Line />
                                <Placeholder.Line />
                            </Placeholder.Header>
                            <Placeholder.Paragraph>
                                <Placeholder.Line />
                                <Placeholder.Line />
                                <Placeholder.Line />
                                <Placeholder.Line />
                            </Placeholder.Paragraph>
                        </Placeholder>
                    </div>
                );
            } else {
                if(this.state.events.length === 0) {
                    return(
                        <div>
                            <div>
                                <Message>
                                    <Button icon floated='right' onClick={this.onRefreshSubmit}>
                                        <Icon name='refresh' />
                                    </Button>
                                    <Message.Header>No data found.</Message.Header>
                                    <p>
                                    Please click refresh later.
                                    </p>
                                </Message>
                            </div>
                        </div>
                    );
                } else {
                    return (
                        <div>
                            <div>
                                <Button icon floated='right' onClick={this.onRefreshSubmit}>
                                    <Icon name='refresh' />
                                </Button>
                            </div>                   
                            <div>
                                <table className="ui celled table">
                                    <thead>
                                        <tr>
                                            <th>Recorded At</th>
                                            <th>Event Type</th>
                                            <th>Tank Level (%)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.events.map((e, i) => {
                                            return (
                                                <tr key={i} >
                                                    <td>
                                                        <div className="ui horizontal label small blue">
                                                        {moment.unix(parseInt(e.recordedAt.S)/1000).format('YYYY-MM-DDTHH:mm:ss Z')}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className={`ui horizontal label small ${this.eventLabelColor(e.event.S)}`}>
                                                            {e.event.S}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className={`ui horizontal label small `}>
                                                            {e.tankLevel.S}
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    );
                }
            }
        }
    }

    render() {
        return (
            this.renderContent()
        );
    }
}

export default TankLevelEvents;