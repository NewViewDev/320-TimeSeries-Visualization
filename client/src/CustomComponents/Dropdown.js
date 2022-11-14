import React from "react";
import './Dropdown.css'
import './Input.css'

class Dropdown extends React.Component {
    constructor(props) {
        super(props);
        this.state = {value: false, open: false, search: ''}
        this.drop = this.drop.bind(this);
        this.select = this.select.bind(this);
        this.search = this.search.bind(this);
    }
    drop() {
        this.setState({open: !this.state.open, search: ''});
    }
    search(event) {
        if(this.state.open) {
            if(/^[A-Za-z0-9 ]$/.test(event.key)) {
                this.setState({search: this.state.search + event.key})
            } else if(event.key === "Backspace") {
                this.setState({search: this.state.search.slice(0, -1)})
            }
        }
    }
    select(value) {
        this.setState({value: value, open: false, search: ''});
        if(this.props.onSelect) {
            this.props.onSelect(value);
        }
    }
    componentDidMount() {
        window.addEventListener('keydown', this.search)
    }
    componentWillUnmount() {
        window.removeEventListener('keydown', this.search)
    }
    render() {
        return (
            <>
                <input readOnly value={this.state.value ? this.state.value : ""} className="selection"/>
                <div className={"dropdown " + (this.state.open ? "open" : "")} onClick={this.drop}>
                    <div style={{position: "absolute", color: "#fff5"}}>{this.state.value && this.state.search === '' ? this.state.value : ''}</div>
                    {this.state.open ? this.state.search : (this.state.value ? this.state.value : this.props.children)}
                    
                    <div className={"options " + (this.state.open ? "open" : "")}>
                        {this.props.list.filter((option) => {
                            return option.indexOf(this.state.search) === 0;
                        }).map((option, i) => {
                            return <div key={i} onClick={() => {this.select(option)}}>{option}</div>;
                        })}
                    </div>
                </div>
            </>
        );
    }
}

export default Dropdown;