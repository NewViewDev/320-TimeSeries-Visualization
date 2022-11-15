import React from "react";
import './Dropdown.css'
import './Input.css'

class DropdownSearch extends React.Component {
    static id = 0;
    constructor(props) {
        super(props);
        this.state = {value: false, open: false, search: '', id: "dropdown-search-" + DropdownSearch.id}
        this.drop = this.drop.bind(this);
        this.select = this.select.bind(this);
        this.search = this.search.bind(this);
        this.close = this.close.bind(this);
        DropdownSearch.id++;
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
    close(event) {
        if(event.target.id !== this.state.id) {
            this.setState({open: false, search: ''});
        }
    }
    componentDidMount() {
        window.addEventListener('keydown', this.search)
        window.addEventListener('click', this.close)
    }
    componentWillUnmount() {
        window.removeEventListener('keydown', this.search)
        window.removeEventListener('click', this.close)
    }
    render() {
        return (
            <>
                <input readOnly value={this.state.value ? this.state.value : ""} className="selection"/>
                <div id={this.state.id} className={"dropdown dropdown-search" + (this.state.open ? " open" : "") + " " + this.props.className} onClick={this.drop}>
                    <div style={{position: "absolute", color: "#fff5"}}>{this.state.value && this.state.search === '' ? this.state.value : ''}</div>
                    {this.state.open ? this.state.search : (this.state.value ? this.state.value : this.props.children)}
                    
                    <div className={"options " + (this.state.open ? "open" : "")}>
                        {this.props.list.filter((option) => {
                            return option[0].indexOf(this.state.search) === 0;
                        }).map((option, i) => {
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

export default DropdownSearch;
