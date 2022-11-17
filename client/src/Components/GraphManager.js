
import React from "react";
import ToggleButton from 'react-bootstrap/ToggleButton';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import Nav from 'react-bootstrap/Nav'


import ScatterLMP from "./GraphFolder/ScatterLMP";
import HistogramTest from "./GraphFolder/HistogramTest";
import HeatmapMonthly from "./GraphFolder/HeatmapMonthly";
import TimeSeriesLinePlot from "./GraphFolder/TimeSeriesLinePlot";

class GraphManager extends React.Component {
    
    constructor(props) {
        super(props)
        this.state = {
            currPage: 0 //stores an index which specifies which page we are on
        }
        this.getPage = this.getPage.bind(this);
    }

    setPageIndex(i){ //Switches the index for the current page
        this.setState({
            currPage: i
        })
    }

    getPage(){ //Gets the actual component that represents the currPage index
        let key = this.state.currPage
        switch (key) {
            case 0:
                // let startTime = Date.now();
                let ScatterTest = <ScatterLMP data = {this.props.data}/>;
                // console.log("HI");
                // console.log("Time Elapsed for Whole:" + (Date.now() - startTime));
                return ScatterTest  //The initial page, in Home.js
                // return <TimeSeriesLinePlot data = {this.props.data}/>
            case 1:
                return <HistogramTest data = {this.props.data}/>   //The Sanity Check page, in SanityCheck.js
            case 2:
                return <HeatmapMonthly data = {this.props.data} baseCase = {this.props.baseCase} scenario = {this.props.scenario}/>  //The Anaylsis page, in Anaylsis.js
            default:
                break;
        }
    }

    render() {
        return (
            <div>
                <Nav variant = "pills">
                    <ToggleButtonGroup type = "radio" name = "Graph Changer" defaultValue={0}>
                        <ToggleButton variant = "outline-dark" id = {"Scatter"} value ={0} onChange = {(val) => this.setPageIndex(0)}>
                            {/* This button toggles to the sanity check page */}
                            Scatter
                        </ToggleButton>
                        <ToggleButton variant = "outline-dark" id = {"Histogram"} value ={1} onChange = {(val) => this.setPageIndex(1)}>
                            {/* This button toggles to the Analysis Page */}
                            Histogram
                        </ToggleButton>
                        <ToggleButton variant = "outline-dark" id = {"Heatmap"} value ={2} onChange = {(val) => this.setPageIndex(2)}>
                            {/* This button toggles to the Analysis Page */}
                            Heatmap
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Nav>
                {/* Switches the component to the correct page */}
                {this.getPage()} 
            </div>
        );
    }
}
export default GraphManager