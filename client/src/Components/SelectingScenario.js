import React from "react";
import BasicButton from "./BasicButton";
import DropDownTest2 from "./DropDownTest2";
import Chart1 from "../Components/Chart1";

class SelectingScenario extends React.Component {//the number of items following is variable
    constructor(props){
        super(props);
        this.state = {
            scenarioList: this.props.list,
            selectedScenario: this.props.selected,
            apiResponse: "",
            loading: true,
            clicked: false,
            prev: <></>
        }
        this.select = this.select.bind(this);
        this.callAPI = this.callAPI.bind(this);
        this.getScenario = this.getScenario.bind(this);
        this.apiResponse = this.apiResponse.bind(this);
        this.chartData = this.chartData.bind(this);
        console.log(this.select)
    }
    
    componentDidMount() {
        this.getScenario();
        console.log(this.state.scenarioList);
    }

    select(index) {
        this.setState(prevState => ({
            selectedScenario: index
        }));
    }

    getScenario() {
        let toFetch = "http://localhost:9000/scenario/";
        fetch(toFetch)
            .then(res => res.json())
            .then(res => this.setState({ 
                scenarioList: res,
                selectedScenario: "Select Scenario",
                loading: false                    
            }));
    }

    callAPI() {
        console.log(this.state.selectedScenario);
        let toFetch = "http://localhost:9000/scenario/" + this.state.selectedScenario
        fetch(toFetch)
            .then(res => res.text())
            .then(res => {
                this.setState((prevState) => 
                { return {
                    prev: <Chart1 label = {prevState.selectedScenario} data = {this.chartData()}/>,
                    apiResponse: res,
                    // clicked: true
                }})
                console.log(res);
            });
        
    }

    

    apiResponse() {
        // if(this.state.clicked == true) {
        //     this.setState((prevState) => { return {
        //         prev: <Chart1 label = {prevState.selectedScenario} data = {this.chartData()}/>,
        //         clicked: false
        //     }})
        // }
        return (
            <>
                {this.state.apiResponse}
                {this.state.prev}
            </>
        );
    
    }

    chartData(){
        if(this.state.selectedScenario == '1'){
            return [{x:1, y:1}, {x:2, y:2}]
        } else if (this.state.selectedScenario == '2'){
            return [{x:1, y:1}, {x:4, y:4}]
        } else{
            return [{x:1, y:1}, {x:2, y:2}, {x:3, y:1}, {x:4, y:4}]
        }
    }
  

    render() {
        return (
            <div>
                {this.state.loading &&
                    <h1>Loading</h1>
                }
                {!this.state.loading &&
                    <div className ='row g-0'>
                        <div>Scenario:</div>

                        <div className = 'col-md-auto '>
                            
                            <DropDownTest2 name = {this.state.selectedScenario} list = {this.state.scenarioList} func = {this.select}/>
                        </div>
                        <div className = 'col-md-auto'>
                            <BasicButton name = {"Check"} clickMethod = {() => {
                                this.callAPI()
                            }}/>
                        <this.apiResponse/>
                        </div>
                    </div>
                }

            </div>
        );
    }
}
export default SelectingScenario;