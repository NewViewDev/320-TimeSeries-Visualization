import React from "react"; 
import AnalyticsTable from "../Components/AnalyticsTable";

export const rows = [];

let clearArray = () => { rows.length = 0; }

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