import React from "react";
import './Dropdown.css'
import './Input.css'

class Dropdown extends React.Component {
    constructor(props) {
        super(props);
        this.state = {value: false, open: false}
        this.drop = this.drop.bind(this);
        this.select = this.select.bind(this);
    }
    drop() {
        this.setState({open: !this.state.open, search: ''});
    }
    select(value) {
        this.setState({value: value, open: false, search: ''});
        if(this.props.onSelect) {
            this.props.onSelect(value);
        }
    }
    render() {
        return (
            <>
                <input readOnly value={this.state.value ? this.state.value : ""} className="selection"/>
                <div className={"dropdown " + (this.state.open ? "open" : "")} onClick={this.drop}>
                    {/* <div style={{position: "absolute", color: "#fff5"}}>{this.state.value ? this.state.value : this.props.children}</div> */}
                    {this.state.value ? this.state.value : this.props.children}
                    <div className={"options " + (this.state.open ? "open" : "")}>
                        {this.props.list.map((option, i) => {
                            return <div key={i} onClick={() => {
                                if(!option[1]) this.select(option[0]);
                                else option[1]();
                            }}>{option[0]}</div>;
                        })}
                    </div>
                </div>
            </>
        );
    }
}

export default Dropdown;