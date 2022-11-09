import React, {useState, useEffect} from "react"; 

import 'bootstrap/dist/css/bootstrap.min.css';
import DropDownTest from "../Components/DropDownTest";
import BasicButton from "../Components/BasicButton";

// The Analysis Page
function AnaylsisPage() {

  // Primary displayed names of buttons
  const buttonPrimaryName = {
    scenario: "Select Scenario",
    metric: "Select Metric",
    timePeriod: "Select Time Period",
    pnodeGrouping: "Select PNode Grouping"
  };

  // Stores all the names that a user would select from a DropDownTest button list
  // The 4 values correspond to the 4 DropDownTest buttons used in buttonList
  const [nameList, updateNameList] = useState({
    scenario: "",
    metric: "",
    timePeriod: "",
    pnodeGrouping: ""
  });

  // Stores all the dropDownTest buttons
  const buttonList = {
    scenario: <DropDownTest name = {buttonPrimaryName.scenario} list ={["1","2","3","4","5"]} func = {buttonListUpdate}/>,
    metric: <DropDownTest name = {buttonPrimaryName.metric} list ={["apple","aae","tim","snake","torn", "ti"]} func = {buttonListUpdate}/>,
    timePeriod: <DropDownTest name = {buttonPrimaryName.timePeriod} list ={["Yearly","Quarterly","Montly","Weekly","Daily", "Hourly"]} func = {buttonListUpdate}/>,
    pnodeGrouping: <DropDownTest name = {buttonPrimaryName.pnodeGrouping} list ={["Node 1","Node 2","Node 2341","Node 2351","Node 23511", "Node 11111"]} func = {buttonListUpdate}/>
  };

  // Based on the primaryName returned, updates the corresponding name in nameList
  // This function needs to be called when the child (DropDownTest button) is updated (pressed).
  // buttonName:  current name selected from list
  // primaryName:  primary name of button (see buttonPrimaryName)
  function buttonListUpdate(buttonName, primaryName) {
    switch(primaryName) {
      case buttonPrimaryName.scenario:
        updateNameList({
          // Copies old nameList
          ...nameList,

          // Updates
          scenario: buttonName
        });
        break;
      case buttonPrimaryName.metric:
        updateNameList({
          // Copies old nameList
          ...nameList,

          // Updates
          metric: buttonName
        });
        break;
      case buttonPrimaryName.timePeriod:
        updateNameList({
          // Copies old nameList
          ...nameList,

          // Updates
          timePeriod: buttonName
        });
        break;
      case buttonPrimaryName.pnodeGrouping:
        updateNameList({
          // Copies old nameList
          ...nameList,

          // Updates
          pnodeGrouping: buttonName
        });
        break;
      default:
        break;
    }
  }

  //const [todos, setTodos] = useState([{ text: 'Learn Hooks' }]);

  // "Similar to componentDidMount and componentDidUpdate"
  useEffect(() => {
  
  });

  // TEMPORARY:  Dropdown buttons use hardcoded lists
  // Trying to add functionality to update dropDownTestButtons
  return (
    <div>
      <h1>Danity Scenario Analysis</h1>
      <p>Scenario: {buttonList.scenario}</p>
      <p>Metric: {buttonList.metric} </p>
      <p>Time Period: {buttonList.timePeriod}</p>
      <p>PNode Grouping: {buttonList.pnodeGrouping}</p>
      <h1>getMeanMedianMode(scenario: {nameList.scenario}, metric: {nameList.metric}, timePeriod: {nameList.timePeriod}, pnodeGrouping: {nameList.pnodeGrouping})</h1>
    </div>
  );
  /*return (
    <div>
      <h1>Danity Scenario Analysis</h1>
      <p>Scenario: {todos[0].text}</p>
    </div>
  );*/
}

export default AnaylsisPage;