import React from "react"; 

import 'bootstrap/dist/css/bootstrap.min.css';
import SelectingScenario from "../Components/SelectingScenario";
import SelectingScenarioNew from "../Components/SelectingScenarioNew";

//Sanity Check Page
class SanityCheckPage extends React.Component {
  constructor(props) {
    super(props);
    
  }

  render() {
    return(
      <div>
        <h1>Danity: Sanity Check</h1>
        {/* <SelectingScenario list = {["apple","aae","tim","snake","torn", "ti"]} selected = {"apple"}/> */}
        <SelectingScenarioNew/>
      </div>
    );
  }
  
}

export default SanityCheckPage;
