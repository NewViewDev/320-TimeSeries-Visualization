import React from "react"; 

import Dropdown from "../CustomComponents/DropdownSearch";
class AnaylsisPage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <div>
        <Dropdown list ={["1","2","3","4","5"]}>Select Scenario</Dropdown>
        <br/>
        <Dropdown list ={["apple","aae","tim","snake","torn", "ti"]}>Select Metric</Dropdown>
        <br/>
        <Dropdown list ={["Yearly","Quarterly","Montly","Weekly","Daily", "Hourly"]}>Select Time Period</Dropdown>
        <br/>
        <Dropdown list ={["Node 1","Node 2","Node 2341","Node 2351","Node 23511", "Node 11111"]}>Select PNode Grouping</Dropdown>
      </div>
    );
  }
  
}

export default AnaylsisPage;