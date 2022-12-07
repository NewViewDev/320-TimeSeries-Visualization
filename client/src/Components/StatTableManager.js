import React from "react"; 

//Generates 1 row
function genRow(date, mean, std, median, keyValue){
    return (
        <tbody key = {keyValue}>
            <tr>
                <td className="darkfont">{date}</td>
                <td className="darkfont">{mean}</td>
                <td className="darkfont">{std}</td>
                <td className="darkfont">{median}</td>
            </tr>
        </tbody>
    )
}

//Extracts the date from the Period_ID format into a JS date object
function extractDate(Period_ID){
    let date = new Date(0);
    // 2020-01-01T00:00:00.000Z format
    // console.log(Period_ID)
    // console.log(Period_ID.substring(0,4));
    // console.log(Period_ID.substring(5,7));
    // console.log(Period_ID.substring(8,10));
    // console.log(Period_ID.substring(11,13));
    date.setUTCFullYear(Period_ID.substring(0,4));
    date.setUTCMonth(Period_ID.substring(5,7) - 1);
    date.setUTCDate(Period_ID.substring(8,10));
    date.setUTCHours(Period_ID.substring(11,13));
    // console.log(date);
    return date;
}

//Finds the mean for an array 
function mean(arr, field){
    let sum = 0;
    for(let i = 0; i < arr.length; i++){
        sum += arr[i][field];
    }
    return (sum/arr.length).toFixed(2)
}

class StatTableManager extends React.Component {
    
    constructor(props) {
        super(props) //scenario, metric, timeperiod, node
        this.state = {
        }
        this.genTable = this.genTable.bind(this);
        this.handleAll = this.handleAll.bind(this);
        this.handleDaily = this.handleDaily.bind(this);
    }

    componentDidMount(){
        // this.allTesting();
        if(this.props.data != undefined){
            this.handleAll();
        }
    }

    //Handles the ALL case
    handleAll(){
        if(this.props.data != undefined && this.props.data.length > 0){
            let arr = [];
            let totalMean = mean(this.props.data, this.props.metric)
            arr.push(
                {dateName: 'All', mean: totalMean, std: totalMean, median: totalMean}
            )
            return arr;
        }
        return undefined;
    }

    //Handles the Daily Case
    handleDaily(){
        if(this.props.data != undefined && this.props.data.length > 0){
            let arr = [];
            let startDate = extractDate(this.props.data[0]['PERIOD_ID']);
            let currDate = extractDate(this.props.data[0]['PERIOD_ID']);
            let nextDate = extractDate(this.props.data[0]['PERIOD_ID']);
            startDate.setHours(0);

            nextDate.setDate(nextDate.getDate() + 1)
            let endDate = extractDate(this.props.data[this.props.data.length-1]['PERIOD_ID']);

            let i = 0;
            let total = 0;
            while(currDate <= endDate){
                let meanArr = [];
                if(i >= this.props.data.length){
                    break;
                } else { //gets the points in the node that are inside the timeframe and since the data is sent in order we will get all of the points in the timeframe with this method
                    let dataPoint = this.props.data[i];
                    let dataDate = extractDate(dataPoint['PERIOD_ID']);     
                    while(dataDate.getTime() >= currDate.getTime() && dataDate.getTime() < nextDate.getTime()){
                        meanArr.push(dataPoint)
                        i++;
                        if(i >= this.props.data.length){
                            break;
                        }
                        dataPoint = this.props.data[i];
                        dataDate = extractDate(dataPoint['PERIOD_ID']);  
                    }
                }
                let partialMean = mean(meanArr, this.props.metric)//We find the mean of everything inside the timeframe
                total += meanArr.length;
                arr.push(
                    {dateName: currDate.toLocaleDateString(), mean: partialMean, std: partialMean, median: partialMean}
                )
                //The timeframe moves up 1 day
                currDate.setDate(currDate.getDate() + 1)
                nextDate.setDate(nextDate.getDate() + 1)
            }
            // console.log(total);
            // console.log(this.props.data.length)
            return arr;
        }
        return undefined;
        
    }

    genTable(){
        let arr;
            console.log(this.props.timePeriod);
            if(this.props.data != undefined){
            switch (this.props.timePeriod) {
                case 'ALL':
                    console.log('HI');
                    arr = this.handleAll();
                    break;
            
                default:
                    console.log('HI2');
                    arr = this.handleDaily();
                    break;
            }
        }
        if(arr != undefined){
            console.log('hi')
            let tableData = []
            for(let i = 0; i < arr.length; i++){
                let data = arr[i]
                tableData.push(genRow(data['dateName'], data['mean'], data['std'], data['median'], i))
            }    
            return tableData;
        }
    }

    render() {
        return (
            <div>
                <table striped bordered hover>
                    <thead onClick={this.handleAll}>
                        <tr>
                            <th className="darkfont">Date</th>
                            <th className="darkfont">Mean</th>
                            <th className="darkfont">STD</th>
                            <th className="darkfont">Median</th>
                        </tr>
                    </thead>
                    
                </table>   
                {this.genTable()}
            </div>
            
        );
    }
}
export default StatTableManager