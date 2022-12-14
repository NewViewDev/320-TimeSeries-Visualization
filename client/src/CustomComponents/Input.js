import React from "react";
import './Input.css'

class Input extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <input className={"input" + " " + this.props.className} placeholder={this.props.children}/>
        );
    }
}

export default Input;