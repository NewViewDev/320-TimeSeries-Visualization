import React from "react"; 

import Dropdown from "../CustomComponents/DropdownSearch";
import Container from "../CustomComponents/Container";
import Button from "../CustomComponents/Button";

import DatabaseDropdown from "../Components/DatabaseDropdown";
import NodeDropdown from "../Components/NodeDropdown";
import StatTableManager from "../Components/StatTableManager";
import DateRangeSelector from "../CustomComponents/DateRangeSelector";

//generates the fetch command to the server
function genFetch(ScenarioID, Metric, Node, startDate, endDate){
  let toFetch = "http://localhost:4000/api/v1/data/nodes";
  toFetch += "?PNODE_NAME=" + Node; 
  toFetch += "&SCENARIO_ID_1=" + ScenarioID + "&SCENARIO_ID_2=" + ScenarioID;
  toFetch += "&FIELD=" + Metric;
  toFetch += "&START_DATE=" + startDate;
  toFetch += "&END_DATE=" + endDate;
  return toFetch;
}

class AnaylsisPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
    this.state.ranges = {startDate: '', endDate: '', key: 'selection'};
    this.onScenarioClick = this.onScenarioClick.bind(this);
    this.onMetricClick = this.onMetricClick.bind(this);
    this.onTimePeriodClick = this.onTimePeriodClick.bind(this);
    this.onNodeClick = this.onNodeClick.bind(this);
    this.onGenerateSubmit = this.onGenerateSubmit.bind(this);
    this.onDateClick = this.onDateClick.bind(this);
  }

  //When the user selects a scenario, the state is updated to contain the user's selection
  onScenarioClick(value){
    this.setState({scenario: value})
  }

  onDateClick(ranges) {
    this.setState({selection: ranges.selection});
  }

  //When the user selects a metric, the state is updated to contain the user's selection
  onMetricClick(value){
    this.setState({metric: value})
  }

  //When the user selects a timePeriodGrouping, the state is updated to contain the user's selection
  onTimePeriodClick(value){
    this.setState({timePeriod: value})
  }

  //When the user selects a Node, the state is updated to contain the user's selection
  onNodeClick(value){
    this.setState({node: value})
  }

  //When the user presses submit, the client fetches the releavant info from the server
  onGenerateSubmit(){
    //Fetches the the data for the selected options
    if(this.state.scenario != undefined && this.state.metric != undefined && this.state.timePeriod != undefined && this.state.node != undefined){
      let toFetch = genFetch(this.state.scenario, this.state.metric, this.state.node, this.state.ranges.startDate, this.state.ranges.endDate);
      let currMetric = this.state.metric //These options are stored rather than direct passing something like this.state.metric so that nothing changes unless the user presses submit
      let currTimePeriod = this.state.timePeriod
      fetch(toFetch)
        .then(res => res.json()) //converts to json
        .then(res => {
          console.log(res["data"]["nodes"]);
          this.setState({ 
              apiRes: res["data"]["nodes"],
              selectedMetric: currMetric,
              selectedTimePeriod: currTimePeriod
          })
      });

    }
  }

  render() {
    return(
      <Container>
          <div>

            <Container className="sub">

              <DateRangeSelector onChange= {this.onDateClick} ranges={[this.state.selection]}></DateRangeSelector>

                {/* The options the user can select from */}
                <div>
                  {/* <DatabaseDropdown fetch="http://localhost:4000/api/v1/data/scenarios" buttonName = "Scenario" onSelect = {this.onScenarioClick}>Select Scenario</DatabaseDropdown> */}
                  <DatabaseDropdown fetch="http://localhost:4000/api/v1/data/scenarios" buttonName = "Scenario" onSelect={this.onScenarioClick}>Select Scenario</DatabaseDropdown>
                  <br/>
                  <Dropdown list ={["LMP"]} onSelect={this.onMetricClick}>Select Metric</Dropdown>
                  <br/>
                  <Dropdown list ={["ALL", "Yearly","Quarterly","Monthly","Weekly","Daily", "Hourly"]} onSelect={this.onTimePeriodClick}>Select Time Period</Dropdown>
                  <br/>
                  <Dropdown list ={["Type", "Load Zone","Dispatch Zone","Reserve Zone","Fuel Type"]}>Select Grouping</Dropdown>
                  <br/>
                  {/* <Dropdown list ={["Node 1","Node 2","Node 2341","Node 2351","Node 23511", "Node 11111"]}>Select PNode Grouping</Dropdown> */}
                  {/* <NodeDropdown fetch="http://localhost:4000/api/v1/data/nodes/name" buttonName = "PNodes" onSelect = {this.onNodeClick}></NodeDropdown> */}
                  <NodeDropdown fetch="http://localhost:4000/api/v1/data/nodes/name" buttonName = "PNodes" onSelect = {this.onNodeClick}></NodeDropdown>
                </div>

              <Button className="action" onClick = {this.onGenerateSubmit}>Generate</Button>

            </Container>

            <Container className="grey sub">
              <h4 className="darkfont">Please generate a report</h4>
              {/* Just prints out what the user currently has selected */}
              {this.state.scenario}
              {this.state.metric}
              {this.state.timePeriod}
              {this.state.node}
              {this.state.selection}
              {/* Manages how */}
              <StatTableManager data = {this.state.apiRes} metric = {this.state.selectedMetric} timePeriod = {this.state.selectedTimePeriod}/>

              
            </Container>

          </div>
        



      </Container>

    );
  }
  
}

export default AnaylsisPage;