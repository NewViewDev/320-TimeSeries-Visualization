import React from "react"; 
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRangePicker } from 'react-date-range';

import './Dropdown.css'

class DateRangeSelector extends React.Component {
    static id=0;
    constructor(props) {
        super(props);
        this.state = {value: false, open: false, id: "dropdown-" + DateRangeSelector.id, selection: {startDate: '', endDate: '', key: 'selection'}}
        this.handleSelect = this.handleSelect.bind(this);
        this.drop = this.drop.bind(this);
        DateRangeSelector.id++;
    }
    drop(event) {
        if(event.target.id === this.state.id) {
            this.setState({open: !this.state.open, search: ''});
        }
    }
    handleSelect(ranges){
        console.log(ranges.selection);
        this.setState({selection: ranges.selection});
    }
    render(){
        return (
            <div id={this.state.id} className={"dropdown" + (this.state.open ? " open" : "") + " " + this.props.className} onClick={this.drop}>
                Select Date Range
                <div className={"date-range " + (this.state.open ? "open" : "")}>
                    <DateRangePicker
                        ranges={[this.state.selection]}
                        onChange={this.handleSelect}
                    />
                </div>
            </div>

        )
    }
}

export default DateRangeSelector