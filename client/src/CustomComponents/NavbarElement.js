import React from "react";
import './NavbarElement.css'

class NavElement extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div style={{marginLeft: this.props.float === "right" ? "auto" : ''}} className={"navbar-element" + " " + this.props.className} >
                {this.props.children}
            </div>
        );
    }
}

export default NavElement;