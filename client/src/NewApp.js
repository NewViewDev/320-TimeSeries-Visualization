import React from "react"; 

import './App.css';
import Container from './CustomComponents/Container';
import Navbar from "./CustomComponents/Navbar";
import NavbarButton from "./CustomComponents/NavbarButton" // could definitely make this (as well as NavbarElement and NavbarImage) other elements within the Navbar file, then pull them with "import * as Nav"

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { page: 0 };
    this.setPage = this.setPage.bind(this);
  }

  setPage(page) {
    this.setState({page: page});
    // pages 1 and 2 should be inaccessible before login. We could potentially make it impossible to see page 0 after login as well, for simplicity's sake
  }

  render() {
    return(
        <Container>
            <Navbar>
                <NavbarImage src="./Components/Images/1200px-ISO_New_England.png"></NavbarImage> {/* we need a NavbarContent component and a NavbarImage component */}
                <NavbarContent>Danity</NavbarContent>
                <NavbarButton onClick={() => {this.setPage(1)}}>Sanity Check</NavbarButton>
                <NavbarButton onClick={() => {this.setPage(2)}}>Analysis</NavbarButton>
                <NavbarContent float="right">
                    <Dropdown list={[('home', () => {this.setPage(0)})]}></Dropdown> {/* Dropdown needs to accept an array of (label, onClick) pairs */}
                </NavbarContent>
            </Navbar>
            {this.state.page === 0 && <LoginPage></LoginPage>}
            {this.state.page === 1 && <SanityPage></SanityPage>}
            {this.state.page === 2 && <AnalysisPage></AnalysisPage>}
        </Container>
    );
  }
  
}

export default App;
