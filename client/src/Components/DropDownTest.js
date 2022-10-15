import Dropdown from 'react-bootstrap/Dropdown'
import React from "react";
class DropDownTest extends React.Component {//the number of items following is variable
    constructor(props){
        super(props);
        this.state = {
            button: props.name,
            function: props.list,//currently just makes, also should make a copy
            filterList: props.list,
            select: {},
            length: 0
        }
        this.comList = null;
        this.filterList = null;
        this.filterListing = this.filterListing.bind(this);
        this.setSelect = this.setSelect.bind(this);
        this.manageList = this.manageList.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.printTest = this.printTest.bind(this);
    }

    setSelect(key) {
        this.setState({
            button: key
        })
    }

    manageList() {
        this.comList = this.state.filterList.map((number) =>
            <li key = {number}>{
                    <Dropdown.Item as = "button" onClick={() => {
                        this.setSelect(number)
                    }}>
                        {number}
                    </Dropdown.Item>
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

    filterListing(filterName) {
        console.log(filterName);
        let tempList = [];

        if(filterName.length <= this.state.length){
            for(let i = 0; i < this.state.function.length; i++){
                if((this.state.function[i] + "").startsWith(filterName)){
                    tempList.push(this.state.function[i]);
                }
            }
            this.setState((prevState) => { return {
                filterList: tempList,
                length: prevState.length - 1
            }})
            console.log(tempList);
        } else {
            for(let i = 0; i < this.state.filterList.length; i++){
                if((this.state.filterList[i] + "").startsWith(filterName)){
                    tempList.push(this.state.filterList[i]);
                }
            }
            this.setState((prevState) => { return {
                filterList: tempList,
                length: prevState.length + 1
            }})
            console.log(tempList);
        }
        
    }

    printTest(){
        console.log("Update");
    }

    handleSubmit(event) {
        console.log("HI");
        event.preventDefault();
        this.setState({
            button: this.state.filterList[0]
        })
    }

    handleChange(event) {
        this.filterListing(event.target.value);
    }

    render() {
        return (
            <Dropdown>
                <Dropdown.Toggle variant = "success" id = "dropdown-basic">
                    {this.state.button}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    <form onSubmit={this.handleSubmit}>
                        <input type = "text" onChange={this.handleChange}/>
                    </form>
                    <this.printTest/>
                    <this.manageList/>
                </Dropdown.Menu>
            </Dropdown>
        );
    }
}
export default DropDownTest;