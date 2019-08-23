import React from 'react';
import { Hub } from 'aws-amplify';
import Lambda from '../../../aws/Lambda';
import { Icon, Message, Placeholder } from 'semantic-ui-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine } from 'recharts';
import moment from 'moment';

class TankLevelChart extends React.Component {

    state = {
        data: [],
        loading: false
    }

    updateMetrics(data, maxSize=900) {
        var metrics = this.state.data.slice();
        data.forEach( function (e) {
            metrics.push({
                recordedAt: moment(e.recorded_at).format('YYY-MM-DDTHH:mm:ssZ'),
                tankLevel: e.tankLevel
            });
        });
        while(metrics.length > maxSize) {
            metrics.shift();
        }
        this.setState( { data: metrics} );
    }

    onTelemetryData(data) {
        var telemetry = data.payload.data;
        this.updateMetrics(telemetry);
    }

    componentWillMount() {
        Hub.listen(this.props.tankId, (data) => {
            if (data.payload.event === 'telemetry') {
                this.onTelemetryData(data);  
            } 
        })


        this.setState({loading: true});
        var _this = this;
        Lambda.getMetricData(this.props.tankId, function(err, data) {
            if(err) console.log(err, err.stack);
            else {
                _this.setState({
                    loading: false,
                    data: data
                });
            }
        });
    }

    componentWillUnmount() {
        Hub.remove(this.props.tankId);
    }

    renderContent() {
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
            if(this.state.data.length === 0) {
                return(
                    <Message icon>
                        <Icon name='spinner' loading />
                        <Message.Content>
                            <Message.Header>No data found</Message.Header>
                            <p/>
                            <p>There is no tankLevel historical data for {this.props.tankId} the past 15 minutes.</p>
                            <p>As soon as it start sending telemetry data, this chart will be rendered.</p>
                        </Message.Content>
                    </Message>
                );
            } else {
                return (
                    <div>
                        <LineChart
                            width={800}
                            height={300}
                            data={this.state.data}
                            margin={{
                            top: 5, right: 30, left: 20, bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="recordedAt" hide={true}/>
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <ReferenceLine y={85} label="Max" stroke="red" strokeWidth={3} />
                            <ReferenceLine y={15} label="Min" stroke="red" strokeWidth={3} />
                            <Line type="monotone" dataKey="tankLevel" strokeWidth={3} stroke="#8884d8" dot={false} activeDot={{ r: 8 }} />
                        </LineChart>
                    </div>
                );
            }
        }
    }

    render() {
        return (
            this.renderContent()
        );
    }
}

export default TankLevelChart;