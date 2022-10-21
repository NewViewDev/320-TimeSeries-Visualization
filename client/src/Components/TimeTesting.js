import BasicButton from "./BasicButton";
import React from "react";

class TimeTesting extends React.Component {//just messing with some time components, you enter in Local time and it fills in a bar in GMT
    constructor(props){
        super(props)
        let tempDate = new Date(props.calenderDate + "T" + props.time);
        this.state = {
            from: props.calenderDate,//"2022-12-03",
            fromUTC: this.convertDateToCalendarDate(tempDate, true),
            time: props.time,// "00:00",
            timeUTC: this.convertDateToTime(tempDate, true)
        }
        // console.log(props.calenderDate + "T" + props.time)
        this.submitFrom = this.submitFrom.bind(this);
        this.changeFrom = this.changeFrom.bind(this);
        this.onClick = this.onClick.bind(this);
        this.convertDateToTime = this.convertDateToTime.bind(this);
    }

    convertDateToTime(date, utc) {
        if(date.toString() == "Invalid Date") {
            console.log(date.toString() + "!");
            return "";
        }
        if(utc){
            return date.toISOString().slice(11,16)
        } else {
            return (date.getHours() + ":").padStart(3, "0") + (date.getMinutes() + "").padStart(2, "0");
        }
    }

    convertDateToCalendarDate(date, utc) {
        if(date.toString() == "Invalid Date") {
            console.log(date.toString() + "!");
            return "";
        }
        if(utc){
            // console.log(date.toISOString().slice(11,16));
            return date.toISOString().slice(0,10);
        } else {
            return (date.year() + "-").padStart(5, "0") + (date.getMonth() + "-").padStart(3, "0") + (date.getDate() + "").padStart(2, "0");
        }
    }


    submitFrom(event) {
        // console.log(event);
        event.preventDefault();
        console.log(this.state);
    }

    changeFrom(event){//may need to put all of this into the set state to deal with stale states(not sure though)
        // console.log(event.target.value);
        if(event.target.name == "date" && event.target.value.substring(0,5).endsWith('-')){
            let newDate = new Date(event.target.value+ "T" + this.state.time);
            this.setState({
                from: event.target.value,
                fromUTC: this.convertDateToCalendarDate(newDate, true),
                timeUTC: this.convertDateToTime(newDate, true)
            })
        } else if(event.target.name == "time") {
            let newDate = new Date(this.state.from + "T" + event.target.value);
            this.setState({
                time: event.target.value,
                fromUTC: this.convertDateToCalendarDate(newDate, true),//newDate.toISOString().slice(0,10),
                timeUTC: this.convertDateToTime(newDate, true)
            })
        }
    }

    onClick(){
        let tempDateFrom = new Date(this.state.from+"T"+this.state.time);
        console.log(tempDateFrom.getHours());
        console.log(tempDateFrom + "\n" + tempDateFrom.toUTCString());
    }
    render() {
        return (
            <div>
                <form onSubmit = {this.submitFrom}>
                    <label> Local Time:
                        <input type = "date" name = "date" onChange = {this.changeFrom} value = {this.state.from}/>
                        <input type = "time" name = "time" onChange = {this.changeFrom} value = {this.state.time}/>
                    </label>
                    <input type = "submit" value = "click"/>
                </form>

                <form>
                    <label> UTC:
                        <input type = "date" value = {this.state.fromUTC} readOnly/>
                        <input type = "time" value = {this.state.timeUTC} readOnly/>
                    </label>
                </form>
                <BasicButton name = "Print Date To Console" clickMethod = {this.onClick}/>
            </div>
            
        );
    }
}
export default TimeTesting;