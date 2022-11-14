import React from "react";
import './Container.css'

class Container extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="container" style={{height: this.props.fullPage ? '100vh' : '', width: this.props.fullPage ? '100vw' : ''}}>
                {this.props.children}
            </div>
        );
    }
}

export default Container;