import React from "react";
import Dropdown from '../CustomComponents/DropdownSearch'

class ScenarioDropdown extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list: []
        }
    }
    componentDidMount() {
        fetch(this.props.fetch)
        .then(res => res.json())
        .then(res => {
            res['data']['scenarios'].map(x => x["SCENARIO_NAME"])
            this.setState({ 
                list: res
            });
        });
    }
    render() {
        return (
            <Dropdown noSelect={this.props.noSelect} onSelect={this.props.onSelect} list={this.state.list}>{this.props.children}</Dropdown>
        );
    }
}

export default ScenarioDropdown;