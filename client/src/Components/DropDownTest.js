import Dropdown from 'react-bootstrap/Dropdown'
import React from "react";
class DropDownTest extends React.Component {//the number of items following is variable
    constructor(props){
        super(props);
        this.state = {
            button: props.name,
            function: props.list,//currently just makes
            name: props.list
        }
        this.comList = null;
        this.renderText = this.renderText.bind(this);
        this.manageList = this.manageList.bind(this);
    }

    renderText(){
        return (
            this.state.button
        );
    }

    manageList() {
        this.comList = this.state.function.map((number) =>
            <li key = {number}>{
                    <Dropdown.Item as = "button" onClick={() => console.log("Clicked on Button " + number)}>Action</Dropdown.Item>
            }
            </li>
        );
        return (
            <ul style={{
                listStyle: 'none',
                padding: 0
            }}>{this.comList}</ul>
        );
    }

    render() {
        return (
            <Dropdown>
                <Dropdown.Toggle variant = "sucess" id = "dropdown-basic">
                    <this.renderText/>
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    <this.manageList/>
                </Dropdown.Menu>
            </Dropdown>
        );
    }
}
export default DropDownTest;