import React from "react";
import Chart from "react-apexcharts"


//Finds the mean for an array 
function mean(arr){
    let sum = 0;
    for(let i = 0; i < arr.length; i++){
        sum += arr[i];
    }
    return (sum/arr.length)
}

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

    console.log(resultCountArray);
    for(let i = 0; i < resultCountArray.length; i++){
        total += (resultCountArray[i]/arr.length * 100)
        resultCountArray[i] = {x: min + (.5 * binsize) + (binsize * i), y: resultCountArray[i]/arr.length * 100};
        
    }
    console.log(total)
    return resultCountArray;
}
  
function whichBin(min, max, numberOfBins, number){//decides which bin
      let binsize = (1.0 * (max-min))/numberOfBins
      // console.log(binsize)
      return Math.floor((number-min)/binsize)
}

function manageData(arr, scenario, baseCase){
    let min = Number.POSITIVE_INFINITY;
    let max = Number.NEGATIVE_INFINITY;
    // let dataMap = new Map();
    // for(let i = 0; i < arr.length; i++){
    //     let currNode = arr[i];
    //     let scenarioID = currNode["SCENARIO_ID"];
    //     let periodID = currNode["PERIOD_ID"];
    //     let value = currNode["LMP"];
    //     let aggregatedPeriod = PeriodFinder(periodID, 'month');
    //     if (dataMap.get(aggregatedPeriod) === undefined) {
    //         let arr = [[],[]]
    //         dataMap.set(aggregatedPeriod, arr)
    //     }
    //     let entry = dataMap.get(aggregatedPeriod)
    //     if(scenarioID == scenario){
    //         entry[0].push(value) //entry[0] stores the scenario
    //     }
    //     if(scenarioID == baseCase){
    //         entry[1].push(value) //entry[1] stores the basecase
    //     }
    // }
    let data = [[], []];
    let dataIterator = arr.values();
    let dataEntry = dataIterator.next();
    while(!dataEntry.done) {
        if(dataEntry.value[0].length != 0){
            let scenarioLMP = mean(dataEntry.value[0]);
            data[0].push(scenarioLMP);
            if(scenarioLMP <= min){
              min = scenarioLMP;
            }
            if(scenarioLMP >= max){
                max = scenarioLMP;
            }
        }
        if(dataEntry.value[1].length != 0){
            let baseLMP = mean(dataEntry.value[1]);
            data[1].push(baseLMP)
            if(baseLMP <= min){
              min = baseLMP;
            }
            if(baseLMP >= max){
                max = baseLMP;
            }
        }
        dataEntry = dataIterator.next();
    }
    max = Math.ceil(max + .0001)
    min = Math.floor(min);
    return [data, min, max];
}

//takes in the result from the endpoints and converts it into something usuable because currently the basecase and scenario node info are not split up, it also returns the min and max values used for the histogram
function manageData2(arr){
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
        let dataArr = manageData(this.props.data, this.props.scenario, this.props.baseCase);
        let data = dataArr[0];
        let min = dataArr[1];
        let max = dataArr[2];
        if(this.props.baseCase == this.props.scenario){
          whichPlot = 0;
        }
        return [{
            name: "LMP",
            data: bin(min, max, 10, data[whichPlot])
        }]

    }

    //Generates the options list(sets the min and max of the histogram)
    generateOptions(id){//a function since the options updates whenever we get new data
        let dataArr = manageData(this.props.data, this.props.scenario, this.props.baseCase);
        let data = dataArr[0];
        let min = dataArr[1];
        let max = dataArr[2];
        
        return {
            plotOptions:{
                bar:{
                    columnWidth: '100%',
                }
            },
            chart: {
                type: 'bar',
                // id: id,
                // group: 'histographs',
                zoom: {
                    enabled: false
                }
            },
            tooltip: {
                shared: true,
                intersect: false
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
              tickPlacement: true,
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
                <Chart options={this.generateOptions('base')} series = {this.generateSeries(0)} type = "bar" height = "380" width="600"/>
                <Chart options={this.generateOptions('scatter')} series = {this.generateSeries(1)} type = "bar" height = "380" width="600"/>
            </div>
        )
    }
}
export default HistogramTest