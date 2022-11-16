import React from "react"; 
import Dropdown from "../CustomComponents/DropdownSearch";
import DatabaseDropdown from "../Components/DatabaseDropdown";
import Container from "../CustomComponents/Container";
import Button from "../CustomComponents/Button";
import Navbar from "../CustomComponents/Navbar";
import NavButton from "../CustomComponents/NavbarButton";
import NavElement from "../CustomComponents/NavbarElement"
import Scatterplot from "../Components/Scatterplot";

class SanityCheckPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { page: 0 };
    this.setPage = this.setPage.bind(this);
  }

  setPage(page) {
    this.setState({page: page});
  }

  render() {
    return(
      <>
        <DatabaseDropdown fetch="http://localhost:9000/scenario/">Select Scenario</DatabaseDropdown>
        <Button className="action">Check</Button>
        <br/><br/>
        <Container className="light">
          <Navbar height="50px">
            <NavButton onClick={() => {this.setPage(1)}} active={this.state.page === 1}>Scatter</NavButton>
            <NavButton onClick={() => {this.setPage(2)}} active={this.state.page === 2}>Histogram</NavButton>
            <NavButton onClick={() => {this.setPage(3)}} active={this.state.page === 3}>Heat Map</NavButton>
            <NavElement float="right">
              <Dropdown className="dark" list={[]}>Select PNode</Dropdown>
            </NavElement>
          </Navbar>
          <Scatterplot data={{}}>Select PNode</Scatterplot>
        </Container>
      </>
    );
  }
  
}

export default SanityCheckPage;
