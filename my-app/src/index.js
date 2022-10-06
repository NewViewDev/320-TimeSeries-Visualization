import React, { Fragment } from "react";
import ReactDOM from "react-dom/client"; 

import {Scatter} from 'react-chartjs-2';
// import {Chart, LinearScale, PointElement, Legend, Tooltip} from 'chart.js';

import { Chart, registerables } from 'chart.js';
import './index.css'
// Chart.register(LinearScale, PointElement, Legend, Tooltip);
Chart.register(...registerables);

let test1 = [1,2,3,4,5,6,7,8];
let test2 = [1,2,3,4,5,6,9,6];

class BasicButton extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            button: props.name,
            clickMethod: props.clickMethod,
            returnedData: <></>
        }
        this.click = this.click.bind(this);//why???
    }

    click(){
        // console.log(typeof(this.props.clickMethod));
        if(typeof(this.props.clickMethod) !== "function"){
            console.log("Clicked");
        } else {
            let returned = this.props.clickMethod();
            this.setState(
                {
                    returnedData: returned
                }
            )
        }
    }

    render() {
        return (
            <React.Fragment>
                {this.state.returnedData}
                <button onClick={this.click}>
                    {this.state.button}
                </button>
            </React.Fragment>
        );
    }
}

// class DropDowns extends React.Component {//this require bootstrap
//     render() {
//         return (
//              <DropdownButton title = "test">
//                 <Dropdown.Item as = "button">Action</Dropdown.Item>
//              </DropdownButton>
//         );
//     }
// }

class ButtonLists extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            name: props.name,
            count: 0,
            list: []
        };
        this.comList = null;
        this.manageList = this.manageList.bind(this);//why???
        this.plus = this.plus.bind(this);//why???
        this.minus = this.minus.bind(this);
        this.reset = this.reset.bind(this);
    }

    manageList() {
        this.comList = this.state.list.map((number) =>
            <li key = {number}>{
                    <BasicButton name = {"Filter #" + (number + 1)} clickMethod = {() => console.log("Clicked on Button " + (number + 1))}/>
            }
            </li>
        );
        return (
            <ul>{this.comList}</ul>
        );
    }

    reset() {
        this.setState(
            {list: []}
        )
    }

    plus(){
        // console.log("what");
        this.setState((prevState) => {
            let copyList = prevState.list.slice(0);
            // let copyList = [0,1];
            copyList.push(copyList.length);
            // console.log(copyList);
            return { 
                count: prevState.count + 1,
                list: copyList
            }
        })
    }

    minus(){
        // console.log("what");
        this.setState((prevState) => {
            let copyList = prevState.list.slice(0);
            // let copyList = [0,1];
            copyList.pop();
            return { 
                count: prevState.count - 1,
                list: copyList
            }
        })
    }

    render(){
        return (
            <div className="SmallButton">
                <BasicButton name = {"+"} clickMethod = {this.plus}/>
                <BasicButton name = {"-"} clickMethod = {this.minus}/>
                <BasicButton name = {"reset"} clickMethod = {this.reset}/>
                <this.manageList/>
            </div>
        );
    }
}


class MainButton extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            startButton: props.startButton,
            backButton: props.backButton,
            pressed: false,
            unPressedComponent: props.unPressedComponent,
            pressedComponent: props.pressedComponent
        }
        this.click = this.click.bind(this);//why???
    }

    click(){
        this.setState((prevState) => {
            return { pressed: !prevState.pressed}
        })
    }

    render() {
        return (
            <div className="Mainbutton">
                <span>Button: </span>
                {!this.state.pressed &&
                <React.Fragment>
                    <button className = "square" onClick={this.click}>
                        {this.state.startButton}
                    </button>
                    <this.state.unPressedComponent />
                </React.Fragment>
                }
                {this.state.pressed &&
                <React.Fragment>
                    <button onClick={this.click}>
                        {this.state.backButton}
                    </button>
                    <this.state.pressedComponent />
                </React.Fragment>
                }
            </div>
        );
    }
}

const demoChartData = {
    labels: ["Red"],
    datasets: [{
        label: "Test",
        data: [{x:1, y:1}, {x:2, y:2}],
        backgroundColor: 'rgb(255,0,255)'
    }],
}

const demoChartOptions = {
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
class DemoChart2 extends React.Component {
    render() {
        return (
            <div style={{width: "500px", height: "300px"}}>
                <Scatter data = {demoChartData} options = {demoChartOptions}/>
            </div>
        );
    }
}


function testingData(){
    let avg1 = 0;
    let avg2 = 0;
    avg1 =  test1.forEach((prev, curr) => 
        prev + curr    
    , avg1);
    avg2 =  test2.forEach((prev, curr) => 
        prev + curr    
    , avg2);
    if(avg1 === avg2) {
        return <h3> Suceeded SanityCheck</h3>
    }
    return <h3> failed SanityCheck </h3>
}

const root = ReactDOM.createRoot(document.getElementById("root"));

const element = 
<div>
    <h1>Very Early UI Prototype</h1>
    <div>
        <MainButton 
            startButton = {"GoToAnaylisis"} 
            backButton = {"GoBackToSanityCheck"} 
            unPressedComponent = {() => <div><BasicButton name = "SanityCheck" clickMethod = {testingData}/></div>} 
            pressedComponent = {() =>  
                <div>
                    <ButtonLists name = "hi2"/>
                    <BasicButton name = "testFiltered" clickMethod = {() => <DemoChart2/>}/>
                </div>}
        />
        {/* <ButtonLists buttonList name = "hi"/> */}
        <BasicButton name = "closeProgram" clickMethod = {() => console.log("Under Construction")}/>
    </div>
</div>;

root.render(element); 
