import React from "react";
import Chart from "react-apexcharts"

function extractDate(Period_ID){
    let date = new Date(0);
    date.setUTCFullYear(Period_ID.substring(0,4));
    date.setUTCMonth(Period_ID.substring(5,7) - 1);
    date.setUTCDate(Period_ID.substring(8,10));
    date.setUTCHours(Period_ID.substring(11,13));
    return date;
}

//First 2 functions are used to construct the initial heat map data, the data is a 24 series representing the 24 hours in the day and each series has 12 entries representing the 12 months
function filledArray(size){//creates a array representing the 12 months 
    let arr = new Array(size);
    for(let i = 0; i < size; i++){
        arr[i] = [0,0]//sized 2 array, since will accumulate Percent Error before being divided by the the number of Percent Errors to get MAPE or mean, arr[0] will the accumulated Percent Error and arr[1] will be the count
    }
    return arr;
}

function constructSeries(i) {//construct a series representing the ith hour
    return {
        name: i + 1,
        data: filledArray(12)
    }
}

function manageData(arr, baseCase, scenario){//takes the data recieved from the server and makes it into a form usuable by graphs
    //First we have connect the data from base and scenario since scatter plot is comparing lmp between the base and scenario

    let mapeArr = new Array(24);
    for(let i = 0; i < mapeArr.length; i++){ //construct the 24 series with 12 months each
        mapeArr[i] = (constructSeries(i));
    }

    let dataMap = new Map();//reads the data recieved from the server and pairs up the Periods from the scenario and base case
    for(let i = 0; i < arr.length; i++){
        let currNode = arr[i];
        let scenarioID = currNode["SCENARIO_ID"]; //the scenario id
        let periodID = currNode["PERIOD_ID"]; //the period id

        //creates a map that maps Period ID to the pair of LMPs associated with scenario and base case
        if (dataMap.get(periodID) === undefined) {
            let arr = [];
            if(scenarioID == baseCase){
                arr = [Infinity, currNode["LMP"]];
            } else {//if(scenarioID == scenario){
                arr = [currNode["LMP"], Infinity];
            }
            dataMap.set(periodID, arr)
        } else {          
            if(scenarioID == baseCase){
                dataMap.get(periodID)[1] = currNode["LMP"];
            } else if(scenarioID == scenario){
                dataMap.get(periodID)[0] = currNode["LMP"];
            }  
        }
    }

    
    let keyIterator = dataMap.keys();
    let key = keyIterator.next();
    //iterates through the map, using the period information to mapeArr to accumulate Percent error and increment the count
    while(!key.done) {
        let value = key.value
        let data = dataMap.get(value);
        let dataBase = data[1];
        let dataScen = data[0];
        let MAPE = Math.abs((dataBase - dataScen)/dataScen);
        let currDate = extractDate(value)
        
        let hour = currDate.getHours();//we get the hour value
        let month = currDate.getMonth();//we get the month value
        if(hour == 0) {//changes those values slightly since we start on 1:00 and end on 24:00 for a day
            if(currDate.getDate() == 1){
                month -= 1;
                if(month == -1){
                    month = 11;
                }
            }
            hour = 24;
        }
        if(dataBase == Infinity || dataScen == Infinity){
            //if either value are infinity (when we selected the same basecase and scenario, we do nothing)
        } else {//otherwise accumulate the numerator of Percent error and increment the count(the denominator of Percent error)
            mapeArr[hour - 1].data[month][1]++;
            mapeArr[hour - 1].data[month][0] = mapeArr[hour - 1].data[month][0] + MAPE;
        }

        key = keyIterator.next();

    }
    //goes through the mapeArr to turn the acculated Percent error and the number of accumulations (dividing the two) to get the MAPE
    for(let i = 0; i < mapeArr.length; i++){
        for(let j = 0; j <mapeArr[0].data.length; j++){
            if(mapeArr[i].data[j][1] != 0){
                mapeArr[i].data[j] = mapeArr[i].data[j][0]/mapeArr[i].data[j][1] * 100
            } else {
                mapeArr[i].data[j] = 0;
            }
        }
    }
    return mapeArr;
}

class HeatmapMonthly extends React.Component{

    constructor(props) {
        super(props);
        //props.data, recieves a prop about the data recieved from the server
        //props.baseCase, recieves a prop stating which is the base case
        //props.scenario, recieves a prop stating which is the scenario, which is important because MAPE uses |actual-predicted|/actual
        this.state = {
            options: {//almost default options for a heatmap
                chart: {
                  height: 100,
                  type: 'heatmap',
                },
                plotOptions:{
                    heatmap:{
                        reverseNegativeShade: false,
                        shadeIntensity: .7,
                        colorScale:{
                            ranges:[{
                                from: 0,
                                to: 15, 
                                name: '<= 15% Error',
                                color: "#008EEB"
                            }, {
                                from: 15,
                                to: 50,
                                name: '>15% Error',
                                color: "#FF0008"
                            }
                            ],
                            inverse: true
                            
                        }
                    
                    }
                },
                dataLabels: {
                    enabled: true,
                    formatter: function(val) {
                      return parseFloat(val).toFixed(2) + "%";
                    },
                    style: {
                      colors: ["#000000"]
                    }
                },
                title: {
                  text: 'MAPE HeatMap'
                },
                xaxis: {
                    type: 'category',
                    categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], 
                    tickAmount: 12,
                    title: {
                        text: 'Month',
                        offsetY: 80
                    }

                },
                yaxis: {
                    title: {
                        text: 'Hours'
                    }

                },
            },
            
        };

        this.generateSeries = this.generateSeries.bind(this);
    }

    generateSeries(){ //generates the series with the data, the reason a function is that the series needs to be regenerated whenever updated because it recieves new data when updated
        let dataArr = manageData(this.props.data, this.props.baseCase, this.props.scenario);
        return dataArr;
    }

    render(){
        return (
            <div>
                <Chart options={this.state.options} series={this.generateSeries()} type="heatmap" height = "600" width = "600"/>
            </div>
        )
    }
}
export default HeatmapMonthly