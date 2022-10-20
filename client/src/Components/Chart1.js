import React from "react"; 

import {Scatter} from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

class Chart1 extends React.Component {
    constructor(props) {
        super(props);
        this.demoChartData = {
            labels: ["Red"],
            datasets: [{
                label: props.label,
                data: props.data,
                backgroundColor: 'rgb(255,0,255)'
            }],
        }
        this.state = {
            button: props.name,
            data: props.data,
            label: props.name,
            demoChart: this.demoChartData
        }
        this.demoChartOptions = {
            layout: {
                padding: 0
            },
            scales: {
                y: {
                    suggestedMin: 0,
                    suggestedMax: 10
                },
                x: {
                    suggestedMin: 0,
                    suggestedMax: 10
                }
            }

        }
        // this.componentDidUpdate = this.componentDidMount.bind(this)
        this.generateData = this.generateData.bind(this)
    }

    componentDidUpdate(){
        console.log(this.props.data);
    }

    generateData() {
        return {
            labels: ["Red"],
            datasets: [{
                label: this.props.label,
                data: this.props.data,
                backgroundColor: 'rgb(255,0,255)'
            }],
        }
    }

    render() {
        return (
            <div style={{width: "500px", height: "300px"}}>
                {console.log(this.demoChartOptions)}
                <Scatter data = {this.generateData()} options = {this.demoChartOptions}/>
            </div>
        );
    }
}

export default Chart1;