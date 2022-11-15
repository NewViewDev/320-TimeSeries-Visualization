import React from "react"; 
import Dropdown from "../CustomComponents/DropdownSearch";
import Button from "../CustomComponents/Button";

class SanityCheckPage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <>
        <Dropdown list={[]}>Select Scenario</Dropdown>
        <Button className="action">Check</Button>
      </>
    );
  }
  
}

export default SanityCheckPage;
