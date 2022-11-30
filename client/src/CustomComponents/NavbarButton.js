import React from "react";
import './NavbarElement.css'

class NavButton extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div onClick={this.props.onClick} className={"navbar-button navbar-element" + (this.props.active ? " active" : '') + " " + this.props.className} >
                {this.props.children}
            </div>
        );
    }
}

export default NavButton;