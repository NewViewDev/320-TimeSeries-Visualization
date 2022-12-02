
import React from "react";


import ScatterLMP from "./GraphFolder/ScatterLMP";
import HistogramTest from "./GraphFolder/HistogramTest";
import HeatmapMonthly from "./GraphFolder/HeatmapMonthly";

class GraphManager extends React.Component {
    
    constructor(props) {
        super(props) //this.props.currGraph, this.props.data, this.props.grouping type
        this.getPage = this.getPage.bind(this);
    }

    groupData(){

    }

    getPage(){ //Gets the actual component that represents the currPage index
        let key = this.props.currGraph
        switch (key) {
            case 1:
                console.log(this.props.data)
                return <ScatterLMP data = {this.props.data}/>   //The initial page, in Home.js
            case 2:
                return <HistogramTest data = {this.props.data} baseCase = {this.props.baseCase} scenario = {this.props.scenario}/>   //The Sanity Check page, in SanityCheck.js
            case 3:
                return <HeatmapMonthly data = {this.props.data} baseCase = {this.props.baseCase} scenario = {this.props.scenario}/>  //The Anaylsis page, in Anaylsis.js
            default:
                console.log(this.props.data)
                return <ScatterLMP data = {this.props.data}/>
        }
    }

    render() {
        return (
            <div>
                {/* Switches the component to the correct page */}
                {this.getPage()} 
            </div>
        );
    }
}
export default GraphManager