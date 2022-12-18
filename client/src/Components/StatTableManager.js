import React from "react"; 


import AnalyticsTable from "../Components/AnalyticsTable";

export const rows = [];

let clearArray = () => { rows.length = 0; }

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
function genRow(timeperiod, mean, std, median, keyValue){
    return (
       {timeperiod, mean, median, std}
    )
}

class StatTableManager extends React.Component {
    
    constructor(props) {
        super(props) //scenario, metric, timeperiod, node
        this.state = {
        }
        this.genTable = this.genTable.bind(this);
    }

    genTable(){

        clearArray();

        // this.handleDaily();
        if(this.props.data != undefined){
            console.log(this.props.data)
            let tableData = []
            for(let i = 0; i < this.props.data.length; i++){
                let data = this.props.data[i]
                let stats = data['groups']['all']['stats'];
                tableData.push(genRow(data['interval'], stats['mean'], stats['std'], stats['median'], i))
                rows.push(genRow(data['interval'], stats['mean'], stats['std'], stats['median'], i));
            }

            //return tableData;
        }
    }

    render() {
        return (
            <div>
                {this.genTable()}
                <AnalyticsTable></AnalyticsTable>
            </div>
        );
    }
}
export default StatTableManager