import React from "react";
import './Navbar.css';
import NavbarButton from './NavbarButton.js';

class Navbar extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <>
                <div className="navbar" style={{height: this.props.height ? this.props.height : '80px'}}>
                    {this.props.children}
                </div>
                <div style={{height: this.props.height ? this.props.height : '80px'}}></div>
            </>
        );
    }
}

export default Navbar;