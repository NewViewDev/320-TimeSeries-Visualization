import React, {useState, useEffect} from "react"; 

import 'bootstrap/dist/css/bootstrap.min.css';
import DropDownTest from "../Components/DropDownTest";
import BasicButton from "../Components/BasicButton";

// The Analysis Page
function AnaylsisPage() {

  // Stores all the dropDownTest buttons
  const [buttonList, updateButtonList] = useState({
    scenario: <DropDownTest name = "Select Scenario" list ={["1","2","3","4","5"]} func = {buttonListUpdate}/>,
    metric: <DropDownTest name = "Select Metric" list ={["apple","aae","tim","snake","torn", "ti"]}/>,
    timePeriod: <DropDownTest name = "Select Time Period" list ={["Yearly","Quarterly","Montly","Weekly","Daily", "Hourly"]}/>,
    pnodeGrouping: <DropDownTest name = "Select PNode Grouping" list ={["Node 1","Node 2","Node 2341","Node 2351","Node 23511", "Node 11111"]}/>
  });

  // When the child (DropDownTest button) is updated (pressed)
  function buttonListUpdate(button) {
    console.log("test");
    updateNameList(prevState => ({
      scenario: button
    }));
  }

  // Stores all the names selected from the lists
  const [nameList, updateNameList] = useState({
    scenario: "",
    metric: "",
    timePeriod: "",
    pnodeGrouping: ""
  });

  //const [todos, setTodos] = useState([{ text: 'Learn Hooks' }]);

  // "Similar to componentDidMount and componentDidUpdate"
  useEffect(() => {
    // Updates buttonList on change
    //console.log(buttonList.scenario);
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
      <h1>getMeanMedianMode(scenario: {nameList.scenario}, metric: , timePeriod: , pnodeGrouping: )</h1>
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