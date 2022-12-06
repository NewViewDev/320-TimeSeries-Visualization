import React from "react";
import Chart from "react-apexcharts"

//extracts the data from the Period_ID in the same format 

//Finds the mean for an array 
function mean(arr){
    let sum = 0;
    for(let i = 0; i < arr.length; i++){
        sum += arr[i];
    }
    return (sum/arr.length)
}


function manageData2(arr, scenario, baseCase){//takes the data recieved from the server and makes it into a form usuable by graphs

    let data = [];
    let dataIterator = arr.values();
    // let dataIterator = dataMap.values();
    let dataEntry = dataIterator.next();
    while(!dataEntry.done) {
        if(dataEntry.value[0].length != 0 && dataEntry.value[1].length != 0){
            let scenarioLMP = mean(dataEntry.value[0]);
            let baseLMP = mean(dataEntry.value[1]);
            data.push([scenarioLMP, baseLMP]);
        }
        dataEntry = dataIterator.next();
    }
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
        // let dataArr = manageData(this.props.data);
        // console.log(this.props.scenario);
        console.log(this.props);
        let dataArr = manageData2(this.props.data, this.props.scenario, this.props.baseCase);
        return [{
            name: "Base Case vs Scatter",
            data: dataArr
        }];
    }


    generateOptions(){ //generates the series with the data, the reason a function is that the series needs to be regenerated whenever updated because it recieves new data when updated if we want to specificy a new min or max diffent from the default
        // let dataArr = manageData(this.props.data);
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
                min: 25,
                tickAmount: 10,
                labels: {
                    formatter: function(val) {
                        return parseFloat(val).toFixed(2)
                    }
                }
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