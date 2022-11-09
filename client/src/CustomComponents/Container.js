import React from "react";
import './Container.css'
import './Navbar.js'
import Navbar from "./Navbar.js";

class Container extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="mycontainer" style={{height: this.props.fullPage ? '100vh' : '', width: this.props.fullPage ? '100vw' : ''}}>
                {/* {this.props.children} */}
                <Navbar ></Navbar>
            </div>
        );
    }
}

export default Container;