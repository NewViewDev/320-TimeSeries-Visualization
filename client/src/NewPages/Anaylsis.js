import React from "react"; 

import Dropdown from "../CustomComponents/DropdownSearch";
import Container from "../CustomComponents/Container";
import Button from "../CustomComponents/Button";

import DatabaseDropdown from "../Components/DatabaseDropdown";
import NodeDropdown from "../Components/NodeDropdown";
import StatTableManager from "../Components/StatTableManager";
import DateRangeSelector from "../CustomComponents/DateRangeSelector";

import AnalyticsTable from "../Components/AnalyticsTable";

//generates the fetch command to the server
// function genFetch(ScenarioID, Metric, Node, startDate, endDate){
//   let toFetch = "http://localhost:4000/api/v1/data/nodes";
//   toFetch += "?PNODE_NAME=" + Node; 
//   toFetch += "&SCENARIO_ID_1=" + ScenarioID + "&SCENARIO_ID_2=" + ScenarioID;
//   toFetch += "&FIELD=" + Metric;
//   toFetch += "&START_DATE=" + startDate.toISOString().split(".")[0];
//   toFetch += "&END_DATE=" + endDate.toISOString().split(".")[0];
// }
  
function genFetch2(ScenarioID, Interval, minuteOffset, StartDate, EndDate, Metric, PnodeID, DST = 0){
  let offset = minuteOffset/60
  DST = DST/60
  let startID = extractPeriod(StartDate, true)
  let endID = extractPeriod(EndDate)
  let toFetch = 'http://localhost:4000/api/v1/data/nodes/group'
  toFetch += '?SCENARIO_ID=' + ScenarioID; //1
  // toFetch += '&START_DATE=2020-07-01T01:00:00'
  toFetch += '&START_DATE='+ startID
  // toFetch += '&END_DATE=2020-12-03T01:00:00'
  toFetch += '&END_DATE='+endID
  toFetch += '&PNODE_NAME='+PnodeID//'.I.KENT    345 2'
  toFetch += '&FIELD=' + Metric
  toFetch += '&INTERVAL=' + Interval
  toFetch += '&OFFSET=' + offset;
  toFetch += '&DST=' + DST;
  return toFetch;
}

function extractPeriod(date, isStart = false){
  let period_ID = '';
  period_ID += date.getFullYear() + '-'
  period_ID += String(date.getMonth() + 1).padStart(2, '0') + '-'
  period_ID += String(date.getDate()).padStart(2, '0') + 'T'
  if(isStart){
    period_ID += '01:00:00'
  } else {
    period_ID += String(date.getHours()).padStart(2, '0') + ':00:00'
  }
  return period_ID;
}


class AnaylsisPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
    this.state.ranges = {startDate: new Date(2020, 2, 1, 0), endDate: new Date(2020, 10, 1, 0), key: 'selection'};
    this.onScenarioClick = this.onScenarioClick.bind(this);
    this.onMetricClick = this.onMetricClick.bind(this);
    this.onTimePeriodClick = this.onTimePeriodClick.bind(this);
    this.onNodeClick = this.onNodeClick.bind(this);
    this.onGenerateSubmit = this.onGenerateSubmit.bind(this);
    // this.onDateClick = this.onDateClick.bind(this);
    this.handleDaily = this.handleDaily.bind(this);
    this.handleMonthly = this.handleMonthly.bind(this);
  }

  //When the user selects a scenario, the state is updated to contain the user's selection
  onScenarioClick(value){
    this.setState({scenario: value})
  }

  // onDateClick(ranges) {
  //   this.setState({selection: ranges.selection});
  // }

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

  async handleDaily(scenario, metric, pnodeID){ //needs to check to make sure it actually handles daylight saving properly
    console.log(this.state.ranges)
    let startDate = new Date(this.state.ranges['startDate'].getTime())
    let endDate = new Date(this.state.ranges['endDate'].getTime())
    // let startDate = new Date(2020, 1, 1, 0);
    // let endDate = new Date(2020, 9, 5, 0);

    let startInterval = new Date(startDate.getTime()) //The start of the span of time
    
    let currEndInterval = new Date(startDate.getTime()) //The end of the span of time
    let nextInterval = new Date(startDate.getTime()) //The next interval
    nextInterval.setDate(nextInterval.getDate() + 1)
    let offset = startDate.getTimezoneOffset(); //The timezone offset

    let currArray = [];
    while(currEndInterval < endDate){
        //if the time between the currEndInteveral and nextInterval is daylight savings
        if(nextInterval.getTimezoneOffset() != offset){//if the nextInterval has a different offset
            //make an iff to make sure that start and curr interval are not the same currently
            if(startInterval.getTime() != currEndInterval.getTime()){//startInterval to currEndInterval is one interval of time in which daylight savings does not change
                let toFetch = genFetch2(scenario, 'daily', offset, startInterval, currEndInterval, metric, pnodeID);
                console.log(toFetch)
                let response =  await fetch(toFetch).then(res => res.json()) 
                if(response['data'] != undefined)
                  currArray = currArray.concat(response['data'])
            }
            //while currEndInterval to nextInterval is the day in which daylight saving changes
            let toFetchDstChange = genFetch2(scenario, 'daily', offset, currEndInterval, nextInterval, metric, pnodeID, nextInterval.getTimezoneOffset() - currEndInterval.getTimezoneOffset());
            let response2 =  await fetch(toFetchDstChange).then(res => res.json()) 
            if(response2['data'] != undefined)
              currArray.push(response2['data'][0])
            offset = nextInterval.getTimezoneOffset();
            startInterval = new Date(nextInterval.getTime());//we start at the 
        }
        //The currEndInterval and nextInterval move to the next day
        currEndInterval.setDate(currEndInterval.getDate() + 1)
        nextInterval.setDate(nextInterval.getDate() + 1)
    }

    let toFetch = genFetch2(scenario, 'daily', offset, startInterval, currEndInterval, metric, pnodeID);
    let response =  await fetch(toFetch).then(res => res.json()) 
    if(response['data'] != undefined)
      currArray = currArray.concat(response['data'])
    if(nextInterval.getTimezoneOffset() != offset){//
      let toFetchDstChange = genFetch2(scenario, 'daily', offset, currEndInterval, nextInterval, metric, pnodeID, nextInterval.getTimezoneOffset() - currEndInterval.getTimezoneOffset());
      let response2 =  await fetch(toFetchDstChange).then(res => res.json()) 
      if(response2['data'] != undefined)
          currArray.push(response2['data'][0])
    }
    this.setState({
      apiRes: currArray,
      metric: metric
    })
  }

  async handleMonthly(scenario, metric, pnodeID){ //needs to check to make sure it actually handles daylight saving properly
    let startDate = new Date(this.state.ranges['startDate'].getTime());
    startDate.setDate(1);
    let endDate = new Date(this.state.ranges['endDate'].getTime());
    endDate.setDate(1);
    // console.log(startDate + " " + endDate)
    console.log(startDate + " " + endDate)

    let startInterval = new Date(startDate.getTime())
    
    let currEndInterval = new Date(startDate.getTime())
    let nextInterval = new Date(startDate.getTime())
    nextInterval.setMonth(nextInterval.getMonth() + 1, 1)
    let offset = startDate.getTimezoneOffset();

    let currArray = [];
    while(currEndInterval < endDate){//I think < not <= so that endDate is exclusive
        //if the time between the currEndInteveral and nextInterval is daylight savings
        if(nextInterval.getTimezoneOffset() != offset){
            //make an iff to make sure that start and curr interval are not the same currently
            if(startInterval.getTime() != currEndInterval.getTime()){
                console.log(genFetch2(scenario, 'monthly', offset, startInterval, currEndInterval, metric, pnodeID));
                let toFetch = genFetch2(scenario, 'monthly', offset, startInterval, currEndInterval, metric, pnodeID);
                let response =  await fetch(toFetch).then(res => res.json()) 
                if(response['data'] != undefined)
                  currArray = currArray.concat(response['data'])
            }
            let toFetchDstChange = genFetch2(scenario, 'monthly', offset, currEndInterval, nextInterval, metric, pnodeID, nextInterval.getTimezoneOffset() - currEndInterval.getTimezoneOffset());
            console.log(toFetchDstChange)
            let response2 =  await fetch(toFetchDstChange).then(res => res.json()) 
            if(response2['data'] != undefined)
              currArray.push(response2['data'][0])
            offset = nextInterval.getTimezoneOffset();
            startInterval = new Date(nextInterval.getTime());
        }
        currEndInterval.setMonth(currEndInterval.getMonth() + 1, 1)
        nextInterval.setMonth(nextInterval.getMonth() + 1, 1)
    }
    let toFetch = genFetch2(scenario, 'monthly', offset, startInterval, currEndInterval, metric, pnodeID);
    let response =  await fetch(toFetch).then(res => res.json()) 
    if(response['data'] != undefined)
      currArray = currArray.concat(response['data'])
    if(nextInterval.getTimezoneOffset() != offset){
        console.log('hi');
        let toFetchDstChange = genFetch2(scenario, 'monthly', offset, currEndInterval, nextInterval, metric, pnodeID, nextInterval.getTimezoneOffset() - currEndInterval.getTimezoneOffset());
        let response2 =  await fetch(toFetchDstChange).then(res => res.json()) 
        if(response2['data'] != undefined)
          currArray.push(response2['data'][0])
        offset = nextInterval.getTimezoneOffset();
        startInterval = new Date(nextInterval.getTime());
    }

    this.setState({
      apiRes: currArray,
      selectedMetric: metric
    })
  }

  async handleYear(scenario, metric, pnodeID){ //needs to check to make sure it actually handles daylight saving properly
    let startDate = new Date(2019, 1, 1, 0); //start at zero instead, just move to 1 afterwards,
    let endDate = new Date(2021, 11, 1, 0);

    let startInterval = new Date(startDate.getTime())
    
    let currEndInterval = new Date(startDate.getTime())
    let nextInterval = new Date(startDate.getTime())
    nextInterval.setMonth(nextInterval.getDate() + 1, 1)
    let offset = startDate.getTimezoneOffset();

    let currArray = [];
    while(currEndInterval < endDate){//I think < not <= so that endDate is exclusive
        //if the time between the currEndInteveral and nextInterval is daylight savings
        if(nextInterval.getTimezoneOffset() != offset){
            //make an iff to make sure that start and curr interval are not the same currently
            if(startInterval.getTime() != currEndInterval.getTime()){
                console.log(genFetch2(scenario, 'monthly', offset, startInterval, currEndInterval, metric, pnodeID));
                let toFetch = genFetch2(scenario, 'monthly', offset, startInterval, currEndInterval, metric, pnodeID);
                let response =  await fetch(toFetch).then(res => res.json()) 
                if(response['data'] != undefined)
                  currArray = currArray.concat(response['data'])
            }
            let toFetchDstChange = genFetch2(scenario, 'monthly', offset, currEndInterval, nextInterval, metric, pnodeID, nextInterval.getTimezoneOffset() - currEndInterval.getTimezoneOffset());
            let response2 =  await fetch(toFetchDstChange).then(res => res.json()) 
            if(response2['data'] != undefined)
              currArray.push(response2['data'][0])
            offset = nextInterval.getTimezoneOffset();
            startInterval = new Date(nextInterval.getTime());
        }
        currEndInterval.setMonth(currEndInterval.getMonth() + 1, 1)
        nextInterval.setMonth(nextInterval.getMonth() + 1, 1)
    }
    let toFetch = genFetch2(scenario, 'monthly', offset, startInterval, currEndInterval, metric, pnodeID);
    let response =  await fetch(toFetch).then(res => res.json()) 
    if(response['data'] != undefined)
      currArray = currArray.concat(response['data'])
    if(nextInterval.getTimezoneOffset() != offset){
        console.log('hi');
        let toFetchDstChange = genFetch2(scenario, 'monthly', offset, currEndInterval, nextInterval, metric, pnodeID, nextInterval.getTimezoneOffset() - currEndInterval.getTimezoneOffset());
        let response2 =  await fetch(toFetchDstChange).then(res => res.json()) 
        if(response2['data'] != undefined)
          currArray.push(response2['data'][0])
        offset = nextInterval.getTimezoneOffset();
        startInterval = new Date(nextInterval.getTime());
    }

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
      // let toFetch = genFetch(this.state.scenario, this.state.metric, this.state.node, this.state.ranges.startDate, this.state.ranges.endDate);
      let currMetric = this.state.metric //These options are stored rather than direct passing something like this.state.metric so that nothing changes unless the user presses submit
      let currTimePeriod = this.state.timePeriod
      let currScenario = this.state.scenario
      let currPnode = this.state.node
      if(currTimePeriod == 'Daily'){
        this.handleDaily(currScenario, currMetric, currPnode);
      } else {
        this.handleMonthly(currScenario, currMetric, currPnode);
      }
    }
  }

  render() {
    return(
      <Container className="grid">
            <Container className="a">

              <DateRangeSelector setRange={val => {this.setState({ranges: val})}} ranges={[this.state.ranges]}></DateRangeSelector>

                {/* The options the user can select from */}
                <div>
                  {/* <DatabaseDropdown fetch="http://localhost:4000/api/v1/data/scenarios" buttonName = "Scenario" onSelect = {this.onScenarioClick}>Select Scenario</DatabaseDropdown> */}
                  <DatabaseDropdown fetch="http://localhost:4000/api/v1/data/scenarios" buttonName = "Scenario" onSelect={this.onScenarioClick}>Select Scenario</DatabaseDropdown>
                  <br/>
                  <Dropdown list ={["LMP"]} onSelect={this.onMetricClick}>Select Metric</Dropdown>
                  <br/>
                  <Dropdown list ={["ALL", "Yearly","Quarterly","Monthly","Weekly","Daily", "Hourly"]} onSelect={this.onTimePeriodClick}>Select Time Period</Dropdown>
                  <br/>

                  {/* <Dropdown list ={["Node 1","Node 2","Node 2341","Node 2351","Node 23511", "Node 11111"]}>Select PNode Grouping</Dropdown> */}
                  {/* <NodeDropdown fetch="http://localhost:4000/api/v1/data/nodes/name" buttonName = "PNodes" onSelect = {this.onNodeClick}></NodeDropdown> */}
                  <NodeDropdown fetch="http://localhost:4000/api/v1/data/nodes/name" buttonName = "PNodes" onSelect = {this.onNodeClick}></NodeDropdown>
                  <br/>

                  <Dropdown list ={["Type", "Load Zone","Dispatch Zone","Reserve Zone","Fuel Type"]}>Select Grouping</Dropdown>
                  <br/>
                </div>

              <Button className="action" onClick = {this.onGenerateSubmit}>Generate</Button>

            </Container>

            <Container className="grey b">
              <h4 className="darkfont">Please generate a report</h4>
              {/* Just prints out what the user currently has selected */}
              {this.state.scenario}
              {this.state.metric}
              {this.state.timePeriod}
              {this.state.node}
              {/* {this.state.ranges} */}
              {/* Manages how */}
              {/* <AnalyticsTable></AnalyticsTable> */}
              <StatTableManager data = {this.state.apiRes} metric = {this.state.selectedMetric} timePeriod = {this.state.selectedTimePeriod}/>
            </Container>
      </Container>

    );
  }
  
}

export default AnaylsisPage;