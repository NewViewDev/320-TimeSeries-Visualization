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

class StatTableManager extends React.Component {
    
    constructor(props) {
        super(props) //scenario, metric, timeperiod, node
        this.state = {
        }
        this.genTable = this.genTable.bind(this);
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
                    <thead>
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