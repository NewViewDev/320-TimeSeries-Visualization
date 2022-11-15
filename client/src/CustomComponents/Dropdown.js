import React from "react";
import './Dropdown.css'
import './Input.css'

class Dropdown extends React.Component {
    static id = 0;
    constructor(props) {
        super(props);
        this.state = {value: false, open: false, id: "dropdown-" + Dropdown.id}
        this.drop = this.drop.bind(this);
        this.select = this.select.bind(this);
        this.close = this.close.bind(this);
        Dropdown.id++;
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
    close(event) {
        if(event.target.id !== this.state.id) {
            this.setState({open: false, search: ''});
        }
    }
    componentDidMount() {
        window.addEventListener('click', this.close)
    }
    componentWillUnmount() {
        window.removeEventListener('click', this.close)
    }
    render() {
        return (
            <>
                <input readOnly value={this.state.value ? this.state.value : ""} className="selection"/>
                <div id={this.state.id} className={"dropdown" + (this.state.open ? " open" : "") + " " + this.props.className} onClick={this.drop}>
                    {/* <div style={{position: "absolute", color: "#fff5"}}>{this.state.value ? this.state.value : this.props.children}</div> */}
                    {this.state.value ? this.state.value : this.props.children}
                    <div className={"options " + (this.state.open ? "open" : "")}>
                        {this.props.list.map((option, i) => {
                            return <div key={i} onClick={() => {
                                this.select(option);
                            }}>{option}</div>;
                        })}
                    </div>
                </div>
            </>
        );
    }
}

export default Dropdown;