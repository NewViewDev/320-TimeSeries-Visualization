import React from "react";
import './Button.css'
import './Input.css'

class Button extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="button">
                {this.props.children}
            </div>
        );
    }
}

export default Button;