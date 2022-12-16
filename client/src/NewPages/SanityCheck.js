import React from "react"; 
import DatabaseDropdown from "../Components/DatabaseDropdown";
import Container from "../CustomComponents/Container";
import Button from "../CustomComponents/Button";
import Navbar from "../CustomComponents/Navbar";
import NavButton from "../CustomComponents/NavbarButton";
import NavElement from "../CustomComponents/NavbarElement"

import NodeDropdown from "../Components/NodeDropdown";
import GraphManager from "../Components/GraphManager";

import DateRangeSelector from "../CustomComponents/DateRangeSelector";

class SanityCheckPage extends React.Component {
  constructor(props) {
    super(props);
    let endDate = new Date();
    endDate.setHours(0, 0, 0, 0)
    this.state = { page: 1};
    this.state.ranges = {startDate: new Date(0), endDate: endDate, key: 'selection'};
    this.setPage = this.setPage.bind(this);
    this.onScenarioClick = this.onScenarioClick.bind(this);
    this.onBaseClick = this.onBaseClick.bind(this);
    this.onNodeClick = this.onNodeClick.bind(this);
    this.onSubmitClick = this.onSubmitClick.bind(this);
    console.log(this.onSubmitClick);
  }

  setPage(page) {
    this.setState({page: page});
  }

  onScenarioClick(value) {
    console.log(this.state)
    this.setState({scenario: value})
  }

  onBaseClick(value) {
    console.log(this.state)
    this.setState({base: value})
  }

  onNodeClick(value) {
    console.log(this.state)
    this.setState({node: value})
  }

  onSubmitClick() {
    console.log('CLICKED2')
    if(this.state.scenario != undefined && this.state.base != undefined && this.state.node != undefined){
      let startDate = new Date(this.state.ranges.startDate.getTime());//We need to set the start and end so that it starts at 1 and ends at 24 aka 00:00 of the next day
      let endDate = new Date(this.state.ranges.endDate.getTime());
      startDate.setTime(startDate.getTime() + (1 * 60 * 60 * 1000)) //done this way so daylight saving dosen't potentially mess up the time
      endDate.setDate(endDate.getDate() + 1)
      console.log(startDate)
      console.log(endDate)
      let toFetch = "http://localhost:4000/api/v1/data/nodes";
      toFetch += "?PNODE_NAME="+this.state.node+"&SCENARIO_ID_1="+this.state.scenario+"&SCENARIO_ID_2="+this.state.base+"&FIELD=LMP"+"&START_DATE="+startDate.toISOString().split(".")[0]+"&END_DATE="+endDate.toISOString().split(".")[0]
      console.log(toFetch);
      let selectedScenario = this.state.scenario;
      let selectedBase = this.state.base;
      fetch(toFetch)
        .then(res => res.json()) //converts to json
        .then(res => {
          console.log(res["data"]["nodes"]);
          this.setState({ 
              apiRes: [res["data"]["nodes"], selectedScenario, selectedBase]  
          })
      });
        
    }
  }

  render() {
    return(
      <>
        <DateRangeSelector setRange={val => {this.setState({ranges: val})}} ranges={[this.state.selection]}></DateRangeSelector>
        <DatabaseDropdown fetch="http://localhost:4000/api/v1/data/scenarios" buttonName = "Scenario" onSelect = {this.onScenarioClick}>Select Scenario</DatabaseDropdown>
        <DatabaseDropdown fetch="http://localhost:4000/api/v1/data/scenarios" buttonName = "BaseCase" onSelect = {this.onBaseClick}>Select BaseCase</DatabaseDropdown>
        <Button className="action" onClick = {this.onSubmitClick}>Check</Button>
        <br/><br/>
        <Container className="light">
          <Navbar height="50px">
            <NavButton onClick={() => {this.setPage(1)}} active={this.state.page === 1}>Scatter</NavButton>
            <NavButton onClick={() => {this.setPage(2)}} active={this.state.page === 2}>Histogram</NavButton>
            <NavButton onClick={() => {this.setPage(3)}} active={this.state.page === 3}>Heat Map</NavButton>
            <NavElement float="right">
              {/* <Dropdown className="dark" list={[]}>Select PNode</Dropdown> */}
              <NodeDropdown fetch="http://localhost:4000/api/v1/data/nodes/name" buttonName = "PNodes" onSelect = {this.onNodeClick}></NodeDropdown>
            </NavElement>
          </Navbar>
          {/* <Scatterplot data={{}}>Select PNode</Scatterplot> */}
          {this.state.apiRes != undefined &&
            <GraphManager data = {this.state.apiRes[0]} currGraph = {this.state.page} scenario = {this.state.apiRes[1]} baseCase = {this.state.apiRes[2]}/>
          }
          {/* <GraphManager data = {this.state.apiRes} currGraph = {this.state.page}/> */}
          {this.state.scenario}
          {this.state.base}
          {this.state.node}

        </Container>
      </>
    );
  }
  
}

export default SanityCheckPage;
