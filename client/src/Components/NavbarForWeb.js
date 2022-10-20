import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown' 
import Nav from 'react-bootstrap/Nav'
import React from "react";
import ToggleButton from 'react-bootstrap/ToggleButton';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';

import SanityCheckPage from '../Pages/SanityCheck';
import Home from '../Pages/Home';
import AnaylsisPage from '../Pages/Anaylsis';

// import logo from './Images/iso-logo-gray.jpg'
import logo from './Images/1200px-ISO_New_England.png'
import BasicButton from './BasicButton';

class NavbarForWeb extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            currPage: 0
        }
        this.getPage = this.getPage.bind(this);
    }

    setPageIndex(i){
        this.setState({
            currPage: i
        })
    }

    getPage(){
        let key = this.state.currPage
        switch (key) {
            case 0:
                return <Home/>
            case 1:
                return <SanityCheckPage/>
            case 2:
                return <AnaylsisPage/>
            default:
                break;
        }
    }

    render() {
        return (
            <div>
                <Navbar float = "left" bg ='dark' variant = "dark" sticky="top" expand = "sm">
                    <Container>
                        <Navbar.Brand href = '#home' className = 'ml-0'>
                            <h1>
                                <img
                                    src = {logo}
                                    // class = "center"
                                    width = "130"
                                    height = "40"
                                    className = "d-inline-block align-top"
                                    alt =""
                                />{" "}
                                Danity
                            </h1>
                        </Navbar.Brand>
                        <Nav variant = "pills" className="me-auto">
                            {/* <Nav.Link href="#SanityCheck">Sanity Check</Nav.Link>
                            <Nav.Link href="#Anaysis">Analysis</Nav.Link> */}
                            {/* <Button variant="primary">
                                Sanity Check
                            </Button>
                            <Button variant="primary">
                                Analysis
                            </Button> */}
                            <ToggleButtonGroup type = "radio" name = "navSite">
                                <ToggleButton variant = "outline-light" id = {0} value ={0} onChange = {(val) => this.setPageIndex(1)}>
                                    Sanity Check
                                </ToggleButton>
                                <ToggleButton variant = "outline-light" id = {1} value ={1} onChange = {(val) => this.setPageIndex(2)}>
                                    Analysis
                                </ToggleButton>
                            </ToggleButtonGroup>
                        </Nav>
                        <Nav variant = "pills" className="ml-auto">
                            <NavDropdown title = "Profile">
                                <NavDropdown.Item href="#Home">Home</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </Container>
                </Navbar>
                {this.getPage()}
            </div>
        );
    }
}
export default NavbarForWeb;