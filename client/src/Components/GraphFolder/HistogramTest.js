import React from "react";
import Chart from "react-apexcharts"

//takes in an array that represents the data and outputs a series for percentages for each bin the data falls into
function bin(min, max, numberOfBins, arr){ //this current implementation has max exclusive
    let total = 0;
    let binsize = (1.0 * (max-min))/numberOfBins;
    let resultCountArray = new Array(numberOfBins);
    resultCountArray.fill(0);

    for(let i = 0; i < arr.length; i++){
        let whichBinNumber = whichBin(min, max, numberOfBins, arr[i])
        resultCountArray[whichBinNumber]++;
    }

    for(let i = 0; i < resultCountArray.length; i++){
        total += (resultCountArray[i]/arr.length * 100)
        resultCountArray[i] = {x: min + (.5 * binsize) + (binsize * i), y: resultCountArray[i]/arr.length * 100};
        
    }
    console.log(total)
    return resultCountArray;
}
  
function whichBin(min, max, numberOfBins, number){//decides which bin
      let binsize = (1.0 * (max-min))/numberOfBins
      return Math.floor((number-min)/binsize)
}

//takes in the result from the endpoints and converts it into something usuable because currently the basecase and scenario node info are not split up, it also returns the min and max values used for the histogram
function manageData(arr){
    let min = Number.POSITIVE_INFINITY;
    let max = Number.NEGATIVE_INFINITY;
    let dataMap = new Map();//stores a map that maps scenarioID -> List of LMPs
    for(let i = 0; i < arr.length; i++){//goes through the arr passed by the endpoint and splits the data in half
        let currNode = arr[i];
        let scenarioID = currNode["SCENARIO_ID"];
        let value = currNode["LMP"];
        if (dataMap.get(scenarioID) === undefined) {
            let arr = [value]
            dataMap.set(scenarioID, arr)
        } else {            
            dataMap.get(scenarioID).push(value)
            
        }
        if(value <= min){
            min = value;
        }
        if(value >= max){
            max = value;
        }
    }
    
    //We iterate through the list of LMPs and put the results in an array called data, so data[0] has the list of LMPs for one and data[1] has the list of LMPs for the other
    let data = [];
    let dataIterator = dataMap.values();
    let dataEntry = dataIterator.next();
    while(!dataEntry.done) {
        if(dataEntry.value.length == 1){ //comparing to same case
            dataEntry.value.push(dataEntry.value[0]);
        }
        data.push(dataEntry.value)
        dataEntry = dataIterator.next();
    }
    //since the current implmentation of bin has max exclusive, the max is increased by a bit, both max and min are ceiled and floored respectively so that they are whole numbers(this isn't needed, but makes the graph look nicer typically)
    max = Math.ceil(max + .0001)
    min = Math.floor(min);
    return [data, min, max];
}

class HistogramTest extends React.Component{

    constructor(props) {
        super(props);
        this.generateSeries = this.generateSeries.bind(this);
        this.generateOptions = this.generateOptions.bind(this);
        //props.data
        this.state = {
            options: this.generateOptions(),
            series: this.generateSeries(0)
        };
    }

    //Generates the series for the histogram
    generateSeries(whichPlot){//a function since the series updates whenever we get new data
        let dataArr = manageData(this.props.data);
        let data = dataArr[0];
        let min = dataArr[1];
        let max = dataArr[2];

        return [{
            name: "LMP",
            data: bin(min, max, 10, data[whichPlot])
        }]

    }

    //Generates the options list(sets the min and max of the histogram)
    generateOptions(){//a function since the options updates whenever we get new data
        let dataArr = manageData(this.props.data);
        let data = dataArr[0];
        let min = dataArr[1];
        let max = dataArr[2];
        
        return {
            plotOptions:{
                bar:{
                    columnWidth: '100%'
                }
            },
            chart: {
              type: 'bar',
              zoom: {
                enabled: false
              }
            },
            title: {
              text: "LMP Histogram Scenario 1(Base Case)"
            },
            dataLabels: {
              enabled: true,
              rotate: -45,
              formatter: function(val) {
                return parseFloat(val).toFixed(1) + "%";
              }
              
            },
            xaxis: {
              min: min,
              max: max,
              type: 'numeric',
              tickPlacement: 'on',
              tickAmount: 20,
              labels: {
                rotate: -45,
                rotateAlways: true,
                formatter: function(val) {
                  return parseFloat(val).toFixed(1);
                }
              },
              title: {
                text: "LMP (Base Case/Scenario 1)"
              }
            },
              yaxis: {
                min: 0,
                max: 100,
                tickAmount: 5,
                labels: {
                  formatter: function(val) {
                    return parseFloat(val).toFixed(1);
                  }
                },
            }
        };

    }

    render(){

        return (
            <div>
                <Chart options={this.generateOptions()} series = {this.generateSeries(0)} type = "bar" height = "380" width="600"/>
                <Chart options={this.generateOptions()} series = {this.generateSeries(1)} type = "bar" height = "380" width="600"/>
            </div>
        )
    }
}
export default HistogramTest