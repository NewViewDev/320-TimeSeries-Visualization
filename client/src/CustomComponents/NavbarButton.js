import React from "react";
import './NavbarButton.css'

class Button extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className={"navbar-button" + (this.props.active ? " active" : '')} >
                {this.props.children}
            </div>
        );
    }
}

export default Button;