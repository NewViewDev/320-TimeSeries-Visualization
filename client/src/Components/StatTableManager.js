import React from "react"; 
import AnalyticsTable from "../Components/AnalyticsTable";

export const rows = [];

let clearArray = () => { rows.length = 0; }

//Generates 1 row
function genRow(timeperiod, group, mean, std, median, keyValue){
    return (
       {timeperiod, group, mean, median, std}
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
            if(this.props.pnodeGroup != undefined){
                for(let i = 0; i < this.props.data.length; i++){
                    let data = this.props.data[i]
                    let stats = data['groups']['all']['stats'];
                    console.log(genRow(data['interval'], this.props.pnodeGroup, stats['mean'], stats['std'], stats['median'], i))
                    rows.push(genRow(data['interval'], this.props.pnodeGroup, stats['mean'], stats['std'], stats['median'], i));
                }
            } else {
                for(let i = 0; i < this.props.data.length; i++){
                    let data = this.props.data[i]
                    let stats = data['groups']
                    for(let key in stats){
                        console.log(stats[key]);
                        console.log(genRow(data['interval'], key, stats[key]['stats']['mean'], stats[key]['stats']['std'], stats[key]['stats']['median'], i))
                        rows.push(genRow(data['interval'], key, stats[key]['stats']['mean'], stats[key]['stats']['std'], stats[key]['stats']['median'], i));
                        
                    }
                    console.log(data);

                    // tableData.push(genRow(data['interval'], stats['mean'], stats['std'], stats['median'], i))
                    // console.log(genRow(data['interval'], this.props.pnodeGroup, stats['mean'], stats['std'], stats['median'], i))
                    // rows.push(genRow(data['interval'], this.props.pnodeGroup, stats['mean'], stats['std'], stats['median'], i));
                }
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