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
              text: "LMP Histogram " + "(" + id + ")"
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
                text: "LMP of " + id,
                offsetY: 100
              }
            },
              yaxis: {
                title: {
                    text: "Percentage"
                },
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
                <Chart options={this.generateOptions('Base Case')} series = {this.generateSeries(0)} type = "bar" height = "380" width="600"/>
                <Chart options={this.generateOptions('Scenario')} series = {this.generateSeries(1)} type = "bar" height = "380" width="600"/>
            </div>
        )
    }
}
export default HistogramTest