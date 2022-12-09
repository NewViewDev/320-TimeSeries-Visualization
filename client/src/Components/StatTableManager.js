import React from "react"; 

function genFetch2(ScenarioID, Interval, minuteOffset, StartDate, EndDate){
    let offset = minuteOffset/60
    let startID = extractPeriod(StartDate)
    let endID = extractPeriod(EndDate)
    let toFetch = 'http://localhost:4000/api/v1/data/nodes/group'
    toFetch += '?SCENARIO_ID=' + ScenarioID; //1
    // toFetch += '&START_DATE=2020-07-01T01:00:00'
    toFetch += '&START_DATE='+ startID
    // toFetch += '&END_DATE=2020-12-03T01:00:00'
    toFetch += '&END_DATE='+endID
    toFetch += '&FIELD=LMP&INTERVAL=daily'
    toFetch += '&OFFSET=' + offset;
    return toFetch;
}
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

//a day starts at 1:00, not 0:00
function startTime(date) {

}

//24:00 is considered part of the day
function endTime3(date){

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

function extractPeriod(date){
    let period_ID = '';
    period_ID += date.getFullYear() + '-'
    period_ID += String(date.getMonth() + 1).padStart(2, '0') + '-'
    period_ID += String(date.getDate()).padStart(2, '0') + 'T'
    period_ID += String(date.getHours()).padStart(2, '0') + ':00:00'
    return period_ID;
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

    async handleDaily(){ //needs to check to make sure it actually handles daylight saving properly
        // /api/v1/data/nodes/group?SCENARIO_ID=1&START_DATE=2020-07-01T01:00:00&END_DATE=2020-12-03T01:00:00&FIELD=LMP&INTERVAL=daily&OFFSET=0
        let startDate = new Date(2020, 1, 1, 1);
        let endDate = new Date(2020, 10, 5, 0);

        let startInterval = new Date(startDate.getTime())
        
        let currEndInterval = new Date(startDate.getTime())
        let nextInterval = new Date(startDate.getTime())
        nextInterval.setDate(nextInterval.getDate() + 1)
        let offset = startDate.getTimezoneOffset();

        let currArray = [];
        while(currEndInterval < endDate){//I think < not <= so that endDate is exclusive
            //if the time between the currEndInteveral and nextInterval is daylight savings
            if(nextInterval.getTimezoneOffset() != offset){
                console.log(startInterval.toUTCString() + ' ' + currEndInterval.toUTCString())
                //make an iff to make sure that start and curr interval are not the same currently
                if(startInterval.getTime() != currEndInterval.getTime()){
                    console.log(genFetch2(1, 'daily', offset, startInterval, currEndInterval));
                    let toFetch = genFetch2(1, 'daily', offset, startInterval, currEndInterval);
                    let response =  await fetch(toFetch).then(res => res.json()) 
                    currArray = currArray.concat(response['data'])
                }
                offset = nextInterval.getTimezoneOffset();

                startInterval = new Date(nextInterval.getTime());
            }
            currEndInterval.setDate(currEndInterval.getDate() + 1)
            nextInterval.setDate(nextInterval.getDate() + 1)
        }
            console.log(startInterval + ' ' + currEndInterval)
            console.log(genFetch2(1, 'daily', offset, startInterval, currEndInterval));
        if(nextInterval.getTimezoneOffset() != offset){
            console.log(currEndInterval + ' ' + nextInterval)
            offset = nextInterval.getTimezoneOffset();
        }
        let toFetch = genFetch2(1, 'daily', offset, startInterval, currEndInterval);
        let response =  await fetch(toFetch).then(res => res.json()) 
        currArray = currArray.concat(response['data'])
        console.log(currArray)
    }

    genTable(){
        // this.handleDaily();
        if(this.props.data != undefined){
            console.log(this.props.data)
            let tableData = []
            for(let i = 0; i < this.props.data.length; i++){
                let data = this.props.data[i]
                let stats = data['groups']['all']['stats'];
                tableData.push(genRow(data['interval'], stats['mean'], stats['std'], stats['median'], i))
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
                    {this.genTable()}
                </table>
            </div>
            
        );
    }
}
export default StatTableManager