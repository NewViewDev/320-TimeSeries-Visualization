import React from "react"; 
import DatabaseDropdown from "../Components/DatabaseDropdown";
import Container from "../CustomComponents/Container";
import Button from "../CustomComponents/Button";
import Navbar from "../CustomComponents/Navbar";
import NavButton from "../CustomComponents/NavbarButton";
import NavElement from "../CustomComponents/NavbarElement"

import NodeDropdown from "../Components/NodeDropdown";
import GraphManager from "../Components/GraphManager";

class SanityCheckPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { page: 1};
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
      let toFetch = "http://localhost:4000/api/v1/data/nodes";
      toFetch += "?PNODE_NAME="+this.state.node+"&SCENARIO_ID_1="+this.state.scenario+"&SCENARIO_ID_2="+this.state.base+"&FIELD=LMP"
      console.log(toFetch);
      let selectedScenario = this.state.scenario;
      let selectedBase = this.state.base;
      fetch(toFetch)
        .then(res => res.json()) //converts to json
        .then(res => {
          // console.log(res)
          // manageData(res["data"]["nodes"])
          console.log(res["data"]["nodes"]);
          this.setState({ 
              // apiResponse: res["data"]["nodes"]
              apiRes: [res["data"]["nodes"], selectedScenario, selectedBase]
                  // <div>
                  //     <GraphManager data = {res["data"]["nodes"]} baseCase = {selectedBase} scenario = {selectedScenario}/> 
                  // </div>   
                  
          })
      });
        
    }
  }

  render() {
    return(
      <>
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
