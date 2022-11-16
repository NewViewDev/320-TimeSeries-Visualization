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
        this.setState({open: !this.state.open});
    }
    select(value) {
        this.setState({value: value, open: false});
        if(this.props.onSelect) {
            this.props.onSelect(value);
        }
    }
    render() {
        return (
            <>
                <input readOnly value={this.state.value ? this.state.value : ""} className="selection"/>
                <div className={"dropdown " + (this.state.open ? "open" : "")} onClick={this.drop}>
                    {this.state.value ? this.state.value : this.props.children}
                    
                    <div className={"options " + (this.state.open ? "open" : "")}>
                        {this.props.list.map((option, i) => {
                            return <div key={i} onClick={() => {this.select(option)}}>{option}</div>;
                        })}
                    </div>
                </div>
            </>
        );
    }
}

export default Dropdown;