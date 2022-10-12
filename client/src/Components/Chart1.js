import React from "react"; 

import {Scatter} from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

class Chart1 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            button: props.name,
        }
        this.demoChartData = {
            labels: ["Red"],
            datasets: [{
                label: "Test",
                data: [{x:1, y:1}, {x:2, y:2}],
                backgroundColor: 'rgb(255,0,255)'
            }],
        }
        
        this.demoChartOptions = {
            options: {
                layout: {
                    padding: 0
                },
                scales: {
                    y: {
                        suggestedMin: 0,
                        suggestedMax: 5
                    },
                    x: {
                        suggestedMin: 0,
                        suggestedMax: 5
                    }
                }
            }
        }
    }
    render() {
        return (
            <div style={{width: "500px", height: "300px"}}>
                <Scatter data = {this.demoChartData} options = {this.demoChartOptions}/>
            </div>
        );
    }
}

export default Chart1;