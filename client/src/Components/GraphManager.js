
import React from "react";


import ScatterLMP from "./GraphFolder/ScatterLMP";
import HistogramTest from "./GraphFolder/HistogramTest";
import HeatmapMonthly from "./GraphFolder/HeatmapMonthly";
import Button from "../CustomComponents/Button";

//extracts the data from the Period_ID in the same format 
function extractDate(Period_ID){
    let date = new Date(0);
    date.setUTCFullYear(Period_ID.substring(0,4));
    date.setUTCMonth(Period_ID.substring(5,7) - 1);
    date.setUTCDate(Period_ID.substring(8,10));
    date.setUTCHours(Period_ID.substring(11,13));
    return date;
}

//Finds the mean for an array 
function mean(arr){
    let sum = 0;
    for(let i = 0; i < arr.length; i++){
        sum += arr[i];
    }
    return (sum/arr.length)
}

function whichQuarter(date){
  let month = date.getMonth();
    if(month <= 2){ //0-2
        return '1'
    } else if(month <=5){//3-5
        return '2'
    } else if(month <= 8){//6-8
        return '3'
    } else if(month <= 11){//9-11
        return '4'
    }
}

function PeriodFinder(periodID, aggregateType){
    let periodDate = extractDate(periodID);
    if(periodDate.getHours() == 0){//since we provided data starts day at 1:00 and ends at 24:00, if the date returns a 0, then that is equvalient, the period of of the previous day
        periodDate.setDate(periodDate.getDate() - 1);
    }
    if(aggregateType == 'Monthly') {
        periodDate.setDate(1);
        periodDate.setHours(0);
    }
    if(aggregateType == 'Quarterly'){
        whichQuarter(periodDate)
        switch (whichQuarter(periodDate)) {
            case '1':
                periodDate.setMonth(0)
                break;
            case '2':
                periodDate.setMonth(3)
                break;
            case '3':
                periodDate.setMonth(6)
                break;
            case '4':
                periodDate.setMonth(9)
                break;
            default:
                break;
        }
        periodDate.setDate(1);
        periodDate.setHours(0);
    }
    if(aggregateType == 'Yearly') {
        periodDate.setMonth(0);
        periodDate.setDate(1);
        periodDate.setHours(0);
    }
    if(aggregateType == 'Daily') {
        periodDate.setHours(0);
    }
    return periodDate.toString();
}

function manageData(arr, scenario, baseCase, aggregate){
    let dataMap = new Map();
    for(let i = 0; i < arr.length; i++){
        let currNode = arr[i];
        let scenarioID = currNode["SCENARIO_ID"];
        let periodID = currNode["PERIOD_ID"];
        let value = currNode["LMP"];
        let aggregatedPeriod = PeriodFinder(periodID, aggregate);
        if (dataMap.get(aggregatedPeriod) === undefined) {
            let arr = [[],[]]
            dataMap.set(aggregatedPeriod, arr)
        }
        let entry = dataMap.get(aggregatedPeriod)
        if(scenarioID == scenario){
            entry[0].push(value) //entry[0] stores the scenario
        }
        if(scenarioID == baseCase){
            entry[1].push(value) //entry[1] stores the basecase
        }
    }
    return dataMap;
}


class GraphManager extends React.Component {
    
    constructor(props) {
        super(props) //this.props.currGraph, this.props.data, this.props.grouping type
        this.state = ({
            aggregate: 'Daily'
        })
        this.getPage = this.getPage.bind(this);
        this.onAggregateButtonClick = this.onAggregateButtonClick.bind(this);
    }

    onAggregateButtonClick(aggregateType){
        this.setState({
            aggregate: aggregateType
        })
    }

    aggregateButtonsList(){
        return <div>
            <Button onClick = {() => this.onAggregateButtonClick('Yearly')}>Yearly</Button>
            <Button onClick = {() => this.onAggregateButtonClick('Quarterly')}>Quarterly</Button>
            <Button onClick = {() => this.onAggregateButtonClick('Monthly')}>Monthly</Button>
            <Button onClick = {() => this.onAggregateButtonClick('Daily')}>Daily</Button>
            <Button onClick = {() => this.onAggregateButtonClick('Hourly')}>Hourly</Button>
        </div>
    }
    getPage(){ //Gets the actual component that represents the currPage index
        let key = this.props.currGraph
        switch (key) {
            case 1:
                return <>{this.aggregateButtonsList()}<ScatterLMP data = {manageData(this.props.data, this.props.baseCase, this.props.scenario, this.state.aggregate)} baseCase = {this.props.baseCase} scenario = {this.props.scenario}/></>   //The initial page, in Home.js
            case 2:
                return <>{this.aggregateButtonsList()}<HistogramTest data = {manageData(this.props.data, this.props.baseCase, this.props.scenario, this.state.aggregate)} baseCase = {this.props.baseCase} scenario = {this.props.scenario}/></>   //The Sanity Check page, in SanityCheck.js
            case 3:
                return <HeatmapMonthly data = {this.props.data} baseCase = {this.props.baseCase} scenario = {this.props.scenario}/>  //The Anaylsis page, in Anaylsis.js
            default:
                return <ScatterLMP data = {this.props.data}/>
        }
    }

    render() {
        return (
            <div>
                {/* Switches the component to the correct page */}
                {this.getPage()} 
            </div>
        );
    }
}
export default GraphManager
