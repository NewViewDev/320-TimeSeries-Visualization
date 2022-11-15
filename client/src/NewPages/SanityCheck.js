import React from "react"; 
import Dropdown from "../CustomComponents/DropdownSearch";
import Container from "../CustomComponents/Container";
import Button from "../CustomComponents/Button";
import Navbar from "../CustomComponents/Navbar";
import NavButton from "../CustomComponents/NavbarButton";

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
        <Dropdown list={[]}>Select Scenario</Dropdown>
        <Button className="action">Check</Button>
        <br/><br/>
        <Container className="light">
          <Navbar height="50px">
            <NavButton>Scatter</NavButton>
            <NavButton>Histogram</NavButton>
            <NavButton>Heat Map</NavButton>
          </Navbar>
          <Dropdown list={[]}>Select PNode</Dropdown>
        </Container>
      </>
    );
  }
  
}

export default SanityCheckPage;
