import React from "react"; 
import SelectingScenario from "../Components/SelectingScenario";


class SanityCheckPage extends React.Component {
  constructor(props) {
    super(props);
    
  }

  render() {
    return(
      <div>
        <h1>Danity: Sanity Check</h1>
        <SelectingScenario list = {["apple","aae","tim","snake","torn", "ti"]} selected = {"apple"}/>
      </div>
    );
  }
  
}

export default SanityCheckPage;
