import React from "react";
import './Button.css'
import './Input.css'

class Button extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div onClick={this.props.onClick} className={"button" + " " + this.props.className}>
                {this.props.children}
            </div>
        );
    }
}

export default Button;