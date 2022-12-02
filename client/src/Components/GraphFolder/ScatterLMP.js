import React from "react";
import Chart from "react-apexcharts"

function manageData(arr){//takes the data recieved from the server and makes it into a form usuable by graphs
    //First we have connect the data from base and scenario since scatter plot is comparing lmp between the base and scenario
    let startTime = Date.now();
    let dataMap = new Map();
    for(let i = 0; i < arr.length; i++){
        let currNode = arr[i];
        let scenarioID = currNode["SCENARIO_ID"];
        let periodID = currNode["PERIOD_ID"];
        if (dataMap.get(periodID) === undefined) {
            let arr = [currNode["LMP"]]
            dataMap.set(periodID, arr)
        } else {            
            dataMap.get(periodID).push(currNode["LMP"])
        }
    }
    let data = [];
    let dataIterator = dataMap.values();
    let dataEntry = dataIterator.next();
    while(!dataEntry.done) {
        if(dataEntry.value.length == 1){ //when the base case and scenario are the same, we need to duplicate the data so that x = y
            dataEntry.value.push(dataEntry.value[0]);
        }
        data.push(dataEntry.value)
        dataEntry = dataIterator.next();
    }
    console.log("TIME For Managing Data")
    console.log(Date.now() - startTime + "ms")
    console.log("Start: " + startTime + "EndTime: " + Date.now())

    console.log(data.length)
    return data;
}

class ScatterLMP extends React.Component{

    constructor(props) {
        super(props);
        //props.data, recieves a prop about the data recieved from the server
        this.state = {
            options: {//essentially default options for charts in Apex charts
                chart: {
                    type: 'scatter',
                    zoom: {
                        enabled: true,
                        type: 'xy'
                    },
                    animations: {
                        enabled: true,
                    }
                },
                markers:{
                    size:0,
                },
                xaxis: {
                    min: 0,
                    tickAmount: 10,
                    labels: {
                        formatter: function(val) {
                            return parseFloat(val).toFixed(2)
                        }
                    }
                },
                yaxis: {
                    min: 25,
                }
            },
            
        };
        this.generateSeries = this.generateSeries.bind(this);
        this.generateOptions = this.generateOptions.bind(this);
    }

    generateSeries(){ //generates the series with the data, the reason a function is that the series needs to be regenerated whenever updated because it recieves new data when updated
        let dataArr = manageData(this.props.data);
        return [{
            name: "Base Case vs Scatter",
            data: dataArr
        }];
    }


    generateOptions(){ //generates the series with the data, the reason a function is that the series needs to be regenerated whenever updated because it recieves new data when updated if we want to specificy a new min or max diffent from the default
        let dataArr = manageData(this.props.data);
        return {//essentially default options for charts in Apex charts
            chart: {
                type: 'scatter',
                zoom: {
                    enabled: true,
                    type: 'xy'
                },
                
                animations: {
                    enabled: false,
                }
                
            },
            xaxis: {
                min: 25,
                tickAmount: 10,
                labels: {
                    formatter: function(val) {
                        return parseFloat(val).toFixed(2)
                    }
                }
            },
            yaxis: {
                min: 25
            }
        };
    }

    render(){
        return (
            <div>
                <Chart options={this.generateOptions()} series={this.generateSeries()} type="scatter" height = "600" width = "600"/>
            </div>
        )
    }
}
export default ScatterLMP