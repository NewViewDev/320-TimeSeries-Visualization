import React from "react"; 

import 'bootstrap/dist/css/bootstrap.min.css';
import DropDownTest from "../Components/DropDownTest";
class AnaylsisPage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <div>
        <h1>Danity Scenario Analysis</h1>
        <DropDownTest name = "Select Scenario" list ={["1","2","3","4","5"]}/>
        <DropDownTest name = "Select Metric" list ={["apple","aae","tim","snake","torn", "ti"]}/>
        <DropDownTest name = "Select Time Period" list ={["Yearly","Quarterly","Montly","Weekly","Daily", "Hourly"]}/>
        <DropDownTest name = "Select PNode Grouping" list ={["Node 1","Node 2","Node 2341","Node 2351","Node 23511", "Node 11111"]}/>
      </div>
    );
  }
  
}

export default AnaylsisPage;