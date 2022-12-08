import React from "react"; 

import Dropdown from "../CustomComponents/DropdownSearch";
import Container from "../CustomComponents/Container";
import Button from "../CustomComponents/Button";

import DatabaseDropdown from "../Components/DatabaseDropdown";
import NodeDropdown from "../Components/NodeDropdown";
import StatTableManager from "../Components/StatTableManager";

//generates the fetch command to the server
function genFetch2(ScenarioID, Interval, minuteOffset, StartDate, EndDate, Metric){
  let offset = minuteOffset/60
  let startID = extractPeriod(StartDate)
  let endID = extractPeriod(EndDate)
  let toFetch = 'http://localhost:4000/api/v1/data/nodes/group'
  toFetch += '?SCENARIO_ID=' + ScenarioID; //1
  // toFetch += '&START_DATE=2020-07-01T01:00:00'
  toFetch += '&START_DATE='+ startID
  // toFetch += '&END_DATE=2020-12-03T01:00:00'
  toFetch += '&END_DATE='+endID
  toFetch += '&FIELD=' + Metric
  toFetch += '&INTERVAL=' + Interval
  toFetch += '&OFFSET=' + offset;
  return toFetch;
}

function extractPeriod(date){
  let period_ID = '';
  period_ID += date.getFullYear() + '-'
  period_ID += String(date.getMonth() + 1).padStart(2, '0') + '-'
  period_ID += String(date.getDate()).padStart(2, '0') + 'T'
  period_ID += String(date.getHours()).padStart(2, '0') + ':00:00'
  return period_ID;
}


class AnaylsisPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
    this.onScenarioClick = this.onScenarioClick.bind(this);
    this.onMetricClick = this.onMetricClick.bind(this);
    this.onTimePeriodClick = this.onTimePeriodClick.bind(this);
    this.onNodeClick = this.onNodeClick.bind(this);
    this.onGenerateSubmit = this.onGenerateSubmit.bind(this);
    this.handleDaily = this.handleDaily.bind(this);
    this.handleMonthly = this.handleMonthly.bind(this);
  }

  //When the user selects a scenario, the state is updated to contain the user's selection
  onScenarioClick(value){
    this.setState({scenario: value})
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

  async handleDaily(scenario, metric){ //needs to check to make sure it actually handles daylight saving properly
    // /api/v1/data/nodes/group?SCENARIO_ID=1&START_DATE=2020-07-01T01:00:00&END_DATE=2020-12-03T01:00:00&FIELD=LMP&INTERVAL=daily&OFFSET=0
    let startDate = new Date(2020, 1, 1, 1);
    let endDate = new Date(2020, 10, 5, 0);

    let startInterval = new Date(startDate.getTime())
    
    let currEndInterval = new Date(startDate.getTime())
    let nextInterval = new Date(startDate.getTime())
    nextInterval.setDate(nextInterval.getDate() + 1)
    let offset = startDate.getTimezoneOffset();

    let currArray = [];
    while(currEndInterval < endDate){//I think < not <= so that endDate is exclusive
        //if the time between the currEndInteveral and nextInterval is daylight savings
        if(nextInterval.getTimezoneOffset() != offset){
            console.log(startInterval.toUTCString() + ' ' + currEndInterval.toUTCString())
            //make an iff to make sure that start and curr interval are not the same currently
            if(startInterval.getTime() != currEndInterval.getTime()){
                console.log(genFetch2(scenario, 'daily', offset, startInterval, currEndInterval, metric));
                let toFetch = genFetch2(scenario, 'daily', offset, startInterval, currEndInterval, metric);
                let response =  await fetch(toFetch).then(res => res.json()) 
                currArray = currArray.concat(response['data'])
            }
            offset = nextInterval.getTimezoneOffset();

            startInterval = new Date(nextInterval.getTime());
        }
        currEndInterval.setDate(currEndInterval.getDate() + 1)
        nextInterval.setDate(nextInterval.getDate() + 1)
    }
        console.log(startInterval + ' ' + currEndInterval)
        console.log(genFetch2(1, 'daily', offset, startInterval, currEndInterval, metric));
    if(nextInterval.getTimezoneOffset() != offset){
        console.log(currEndInterval + ' ' + nextInterval)
        offset = nextInterval.getTimezoneOffset();
    }
    let toFetch = genFetch2(scenario, 'daily', offset, startInterval, currEndInterval, metric);
    let response =  await fetch(toFetch).then(res => res.json()) 
    currArray = currArray.concat(response['data'])
    // console.log(currArray)
    this.setState({
      apiRes: currArray,
      metric: metric
    })
  }

  async handleMonthly(scenario, metric){ //needs to check to make sure it actually handles daylight saving properly
    // /api/v1/data/nodes/group?SCENARIO_ID=1&START_DATE=2020-07-01T01:00:00&END_DATE=2020-12-03T01:00:00&FIELD=LMP&INTERVAL=daily&OFFSET=0
    let startDate = new Date(2020, 1, 1, 1); //start at zero instead, just move to 1 afterwards,
    let endDate = new Date(2020, 11, 5, 0);

    let startInterval = new Date(startDate.getTime())
    
    let currEndInterval = new Date(startDate.getTime())
    let nextInterval = new Date(startDate.getTime())
    nextInterval.setMonth(nextInterval.getDate() + 1, 1)
    let offset = startDate.getTimezoneOffset();

    let currArray = [];
    while(currEndInterval < endDate){//I think < not <= so that endDate is exclusive
        //if the time between the currEndInteveral and nextInterval is daylight savings
        if(nextInterval.getTimezoneOffset() != offset){
            console.log(startInterval.toUTCString() + ' ' + currEndInterval.toUTCString())
            //make an iff to make sure that start and curr interval are not the same currently
            if(startInterval.getTime() != currEndInterval.getTime()){
                console.log(genFetch2(scenario, 'monthly', offset, startInterval, currEndInterval, metric));
                let toFetch = genFetch2(scenario, 'monthly', offset, startInterval, currEndInterval, metric);
                let response =  await fetch(toFetch).then(res => res.json()) 
                currArray = currArray.concat(response['data'])
            }
            offset = nextInterval.getTimezoneOffset();
            console.log(currEndInterval + ' ' + nextInterval)
            startInterval = new Date(nextInterval.getTime());
        }
        currEndInterval.setMonth(currEndInterval.getMonth() + 1, 1)
        nextInterval.setMonth(nextInterval.getMonth() + 1, 1)
    }
        console.log(startInterval + ' ' + currEndInterval)
        console.log(genFetch2(1, 'monthly', offset, startInterval, currEndInterval, metric));
    if(nextInterval.getTimezoneOffset() != offset){
        console.log(currEndInterval + ' ' + nextInterval)
        offset = nextInterval.getTimezoneOffset();
    }
    let toFetch = genFetch2(scenario, 'monthly', offset, startInterval, currEndInterval, metric);
    let response =  await fetch(toFetch).then(res => res.json()) 
    currArray = currArray.concat(response['data'])
    // console.log(currArray)
    this.setState({
      apiRes: currArray,
      selectedMetric: metric
    })
  }


  //Move button into the statTableManager to make things easier
  //When the user presses submit, the client fetches the releavant info from the server
  onGenerateSubmit(){
    //Fetches the the data for the selected options
    if(this.state.scenario != undefined && this.state.metric != undefined && this.state.timePeriod != undefined && this.state.node != undefined){
      let currMetric = this.state.metric //These options are stored rather than direct passing something like this.state.metric so that nothing changes unless the user presses submit
      let currTimePeriod = this.state.timePeriod
      let currScenario = this.state.scenario
      if(currTimePeriod == 'Daily'){
        this.handleDaily(currScenario, currMetric);
      } else {
        this.handleMonthly(currScenario, currMetric);
      }
    }
  }

  render() {
    return(
      <Container>
          <div>
            <Container className="sub">
                {/* The options the user can select from */}
                <div>
                  {/* <DatabaseDropdown fetch="http://localhost:4000/api/v1/data/scenarios" buttonName = "Scenario" onSelect = {this.onScenarioClick}>Select Scenario</DatabaseDropdown> */}
                  <DatabaseDropdown fetch="http://localhost:4000/api/v1/data/scenarios" buttonName = "Scenario" onSelect={this.onScenarioClick}>Select Scenario</DatabaseDropdown>
                  <br/>
                  <Dropdown list ={["LMP"]} onSelect={this.onMetricClick}>Select Metric</Dropdown>
                  <br/>
                  <Dropdown list ={["ALL", "Yearly","Quarterly","Montly","Weekly","Daily", "Hourly"]} onSelect={this.onTimePeriodClick}>Select Time Period</Dropdown>
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
              {/* Manages how */}
              <StatTableManager data = {this.state.apiRes} metric = {this.state.selectedMetric} timePeriod = {this.state.selectedTimePeriod}/>
            </Container>
          </div>
      </Container>

    );
  }
  
}

export default AnaylsisPage;