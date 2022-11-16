import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown' 
import Nav from 'react-bootstrap/Nav'
import React from "react";
import ToggleButton from 'react-bootstrap/ToggleButton';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';

import SanityCheckPage from '../Pages/SanityCheck';
import Home from '../Pages/Home';
import AnaylsisPage from '../Pages/Anaylsis';

import logo from './Images/1200px-ISO_New_England.png'

class NavbarForWeb extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            currPage: 0 //stores an index which specifies which page we are on
        }
        this.getPage = this.getPage.bind(this);
    }

    setPageIndex(i){ //Switches the index for the current page
        this.setState({
            currPage: i
        })
    }

    getPage(){ //Gets the actual component that represents the currPage index
        let key = this.state.currPage
        switch (key) {
            case 0:
                return <Home/> //The initial page, in Home.js
            case 1:
                return <SanityCheckPage/> //The Sanity Check page, in SanityCheck.js
            case 2:
                return <AnaylsisPage/> //The Anaylsis page, in Anaylsis.js
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
                                {/* ISO Logo */}
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
                            <ToggleButtonGroup type = "radio" name = "navSite">
                                <ToggleButton variant = "outline-light" id = {0} value ={0} onChange = {(val) => this.setPageIndex(1)}>
                                    {/* This button toggles to the sanity check page */}
                                    Sanity Check
                                </ToggleButton>
                                <ToggleButton variant = "outline-light" id = {1} value ={1} onChange = {(val) => this.setPageIndex(2)}>
                                    {/* This button toggles to the Analysis Page */}
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
                {/* Switches the component to the correct page */}
                {this.getPage()} 
            </div>
        );
    }
}
export default NavbarForWeb;