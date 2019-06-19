import React from 'react'
import { Card } from 'semantic-ui-react'
import TankCard from './TankCard';


class TankList extends React.Component {

    renderContent() {
        return (
            <div>
                <Card.Group>
                {this.props.tanks.map((tank, index) => {
                    return (
                        <TankCard key={tank} tankName={tank} />
                    )
                })}
                </Card.Group>
            </div>
        );
    }

    render() {
        return (
            this.renderContent()
        );
    }

}

export default TankList