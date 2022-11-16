import Dropdown from 'react-bootstrap/Dropdown'
import React from "react";
class DropDownTest2 extends React.Component {//the number of items following is variable
    constructor(props){
        super(props);
        this.state = {
            button: props.name,
            list: props.list,//currently just makes, also should make a copy
            filterList: props.list,
            length: 0
        }
        this.filterListing = this.filterListing.bind(this);
        this.setSelect = this.setSelect.bind(this);
        this.manageList = this.manageList.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.printTest = this.printTest.bind(this);
    }

    setSelect(key) {
        this.props.func(key)
        this.setState({
            button: key
        })
    }
    
    componentDidUpdate(){
        this.manageList();
    }

    manageList() {
        let count = -1;
        
        this.comList = this.state.filterList.map((entry) => 
            {
                count++;
                return <li key = {count}>{
                    <Dropdown.Item as = "button" onClick={() => {
                        if(this.props.func != undefined){
                            this.props.func(entry);
                        }
                        this.setSelect(entry)
                    }}>
                    {entry}
                    </Dropdown.Item>
                }
            </li>
            }
        );
        return (
            <ul style={{
                listStyle: 'none',
                padding: 0
            }}>{this.comList}</ul>
        );
    }

    componentDidUpdate(){
        this.manageList();
    }

    filterListing(filterName) {
        console.log(filterName);
        let tempList = [];

        if(filterName.length <= this.state.length){//builds list from scratch
            console.log(this.props.list);
            for(let i = 0; i < this.props.list.length; i++){
                if((this.props.list[i] + "").startsWith(filterName)){
                    tempList.push(this.props.list[i]);
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
        console.log(this.state.filterList[0]);
        this.props.func(this.state.filterList[0]);
    }

    handleChange(event) {
        this.filterListing(event.target.value);
    }

    render() {
        return (
            <Dropdown>
                <Dropdown.Toggle variant = "success" id = "dropdown-basic">
                    {this.props.name}
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
export default DropDownTest2;