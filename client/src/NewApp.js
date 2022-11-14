import React from "react"; 

import './App.css';
import Container from './CustomComponents/Container';
import Dropdown from './CustomComponents/Dropdown';
import Navbar from "./CustomComponents/Navbar";
import NavButton from "./CustomComponents/NavbarButton" // could definitely make this (as well as NavbarElement and NavbarImage) other elements within the Navbar file, then pull them with "import * as Nav"
import NavElement from "./CustomComponents/NavbarElement";
import LoginPage from "./NewPages/Login"
import SanityPage from "./NewPages/SanityCheck"
import AnalysisPage from "./NewPages/Anaylsis"
import logo from "./Components/Images/1200px-ISO_New_England.png"

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
        <Container fullPage>
            <Navbar>
                <NavElement>
                    <img src={logo} alt="ISO New England" />
                </NavElement>
                <NavButton onClick={() => {this.setPage(1)}}>Sanity Check</NavButton>
                <NavButton onClick={() => {this.setPage(2)}}>Analysis</NavButton>
                <NavElement float="right">
                    <Dropdown list={[['home', () => {this.setPage(0)}]]}>Profile</Dropdown>
                </NavElement>
            </Navbar>
            {this.state.page === 0 && <LoginPage></LoginPage>}
            {this.state.page === 1 && <SanityPage></SanityPage>}
            {this.state.page === 2 && <AnalysisPage></AnalysisPage>}
        </Container>
    );
  }
  
}

export default App;
