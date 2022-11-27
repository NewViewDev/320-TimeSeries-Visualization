import React from "react"; 

import Dropdown from "../CustomComponents/DropdownSearch";
import Container from "../CustomComponents/Container";
import Button from "../CustomComponents/Button";



class AnaylsisPage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <Container>

          <div>

            <Container className="sub">

                <div>
                  <Dropdown list ={["1","2","3","4","5"]}>Select Scenario</Dropdown> 
                  <br/>
                  <Dropdown list ={["apple","aae","tim","snake","torn", "ti"]}>Select Metric</Dropdown>
                  <br/>
                  <Dropdown list ={["Yearly","Quarterly","Montly","Weekly","Daily", "Hourly"]}>Select Time Period</Dropdown>
                  <br/>
                  <Dropdown list ={["Node 1","Node 2","Node 2341","Node 2351","Node 23511", "Node 11111"]}>Select PNode Grouping</Dropdown>
                </div>

              <Button className="action">Generate</Button>

            </Container>

            <Container className="grey sub">
              <h4 className="darkfont">Please generate a report</h4>
            </Container>

          </div>
        



      </Container>

    );
  }
  
}

export default AnaylsisPage;