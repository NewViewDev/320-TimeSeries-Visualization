import React from "react";
import Dropdown from '../CustomComponents/DropdownSearch'

class NodeDropdown extends React.Component {
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
            let dataArray = res['data']['nodes'];
            this.setState({list: dataArray});
        })
    }
    render() {
        return (
            // <Dropdown noSelect={this.props.noSelect} onSelect={this.props.onSelect} list={this.state.list}>{this.props.children}</Dropdown>
            <Dropdown noSelect={this.props.noSelect} onSelect={this.props.onSelect} list={this.state.list}>{this.props.buttonName}</Dropdown>
        );
    }
}

export default NodeDropdown;