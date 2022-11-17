import React from "react";
import Chart from "react-apexcharts"
import ApexCharts from "apexcharts";

import ToggleButton from 'react-bootstrap/ToggleButton';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import Nav from 'react-bootstrap/Nav'

let maxTime = -Infinity;
let minTime = Infinity;

function manageData(arr){//takes the data recieved from the server and makes it into a form usuable by graphs
    //First we have connect the data from base and scenario since scatter plot is comparing lmp between the base and scenario
    let dataMap = new Map();
    for(let i = 0; i < arr.length; i++){
        let currNode = arr[i];
        let periodID = currNode["PERIOD_ID"];
        let date = new Date(periodID);
        // console.log(date);
        if (dataMap.get(date.getTime()) === undefined) {
            dataMap.set(date.getTime(), currNode["LMP"])
        } 
    }
    let keyArr = [];
    let keyIterator = dataMap.keys();
    let keyEntry = keyIterator.next();
    while(!keyEntry.done) {
        keyArr.push(keyEntry.value)
        keyEntry = keyIterator.next();
    }
    keyArr.sort()
    let data = [];
    for(let i = 0; i < keyArr.length; i++){
        let key = keyArr[i]
        if(key > maxTime) {
            maxTime = key
        }
        if(key < minTime) {
            minTime = key
        }
        let value = dataMap.get(key);
        data.push([key, value])
    }

    return data;
}

class TimeSeriesLinePlot extends React.Component{

    constructor(props) {
        super(props);
        //props.data, recieves a prop about the data recieved from the server
        this.state = {
            data: [
                [new Date(2022, 10, 6, 0).getTime(),1], 
                [new Date(2022, 10, 6, 1).getTime(),2], 
                [new Date(2022, 10, 6, 2).getTime(),3], 
                [new Date(2022, 10, 6, 3).getTime(),4],
                [new Date(2022, 10, 6, 4).getTime(),5],
                [new Date(2022, 10, 6, 5).getTime(),4],
                [new Date(2022, 10, 6, 6).getTime(),3],
                [new Date(2022, 10, 6, 7).getTime(),2],
                [new Date(2022, 10, 6, 8).getTime(),1],
                [new Date(2022, 10, 6, 9).getTime(),2], 
                [new Date(2022, 10, 7).getTime(),1]
            ]
        };
        this.generateSeries = this.generateSeries.bind(this);
        this.generateOptions = this.generateOptions.bind(this);
        this.updateGraph = this.updateGraph.bind(this);
        this.handleDate = this.handleDate.bind(this);
    }

    generateSeries(){ //generates the series with the data, the reason a function is that the series needs to be regenerated whenever updated because it recieves new data when updated
        let dataArr = manageData(this.props.data);
        console.log(this.state.data);
        return [{
            name: "LMP",
            data: dataArr
            // data: this.state.data
        }];
    }


    generateOptions(){ //generates the series with the data, the reason a function is that the series needs to be regenerated whenever updated because it recieves new data when updated if we want to specificy a new min or max diffent from the default
        let dataArr = manageData(this.props.data);
        // console.log(dataArr);
        return {//essentially default options for charts in Apex charts
            chart: { 
                id: 'visualizationTest',
                type: 'line',
                stacked: false,
                height: 350,
                zoom: {
                    enabled: true,
                    type: 'x',
                    autoScaleYaxis: true,
                },
                
                
            },
            xaxis: {
                type: 'datetime',
                // min: new Date('01 Mar 2012').getTime(),
                tickAmount: 6,
                labels: {
                    datetimeUTC: false,
                    // format: 'dd/MM'
                    datetimeFormatter: {
                        year: 'yyyy',
                        month: 'MMM \'yy',
                        day: 'dd MMM',
                        hour: 'HH:mm'
                    }
                }
            },
            tooltip: {
                x: {
                    // datetimeUTC: true,
                    format: 'HH:mm dd MMM yyyy'
                }
            },
            yaxis: {

            }
        };
    }

    handleDate(startDate, endDate, newZoom){
        //new Date(year, monthIndex, day, hours)
        let year = endDate.getFullYear()
        let month = endDate.getMonth()
        let day = endDate.getDate();
        let hours= endDate.getHours();
 
        console.log(new Date("2020-07-01T04:00:00.000Z"));
        console.log(new Date(year, month, day - 1, hours));
        switch(newZoom){
            case 'home':
                return [new Date(minTime), new Date(maxTime)]
            case 'day':
                return [new Date(year, month, day, 0), new Date(year, month, day, 24)]
            case '24Hours':
                return [new Date(year, month, day - 1, hours), new Date(maxTime)]
            case 'month':
                return [new Date(year, month, 1, 0), new Date(year, month, 31, 24)]
                
            case 'quarterly':
                console.log([new Date(year, 9, 1, 0), new Date(year, 11, 31, 24)])
                if(month >= 0 && month <= 2){
                    return [new Date(year, 0, 1, 0), new Date(year, 2, 31, 24)]
                } else if(month >= 3 && month <= 5){
                    return [new Date(year, 3, 1, 0), new Date(year, 5, 30, 24)]
                } else if(month >= 6 && month <= 8){
                    return [new Date(year, 6, 1, 0), new Date(year, 8, 30, 24)]
                } else {
                    return [new Date(year, 9, 1, 0), new Date(year, 11, 31, 24)]
                }
            break
            case 'year':
            break
        }
        return new Date(year, month, day - 1, hours)
    }

    updateGraph(newZoom){
        let zoomInfo = this.handleDate(new Date(maxTime), new Date(maxTime), newZoom);
        ApexCharts.exec(
            'visualizationTest', 
            'zoomX',
            zoomInfo[0].getTime(),
            zoomInfo[1].getTime()
        )
    }

    render(){
        return (
            <div>
                <Nav variant = "pills">
                    <ToggleButtonGroup type = "radio" name = "Zoom Changer" defaultValue={'All'}>
                        <ToggleButton variant = "outline-dark" id = {"All"} value ={'All'} onChange = {(val) => this.updateGraph("home")}>
                            {/* This button toggles to the sanity check page */}
                            All
                        </ToggleButton>
                        <ToggleButton variant = "outline-dark" id = {"Day"} value ={'day'} onChange = {(val) => this.updateGraph("day")}>
                            {/* This button toggles to the Analysis Page */}
                            Day
                        </ToggleButton>
                        <ToggleButton variant = "outline-dark" id = {"24Hours"} value ={'24hours'} onChange = {(val) => this.updateGraph("24Hours")}>
                            {/* This button toggles to the Analysis Page */}
                            24Hours
                        </ToggleButton>
                        <ToggleButton variant = "outline-dark" id = {"Month"} value ={'month'} onChange = {(val) => this.updateGraph("month")}>
                            {/* This button toggles to the Analysis Page */}
                            Month
                        </ToggleButton>
                        <ToggleButton variant = "outline-dark" id = {"Quarterly"} value ={'quarterly'} onChange = {(val) => this.updateGraph("quarterly")}>
                            {/* This button toggles to the Analysis Page */}
                            Quarterly
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Nav>
                <Chart options={this.generateOptions()} series={this.generateSeries()} type="line" height = "600" width = "600"/>
            </div>
        )
    }
}
export default TimeSeriesLinePlot