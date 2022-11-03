import React from "react";
import BasicButton from "./BasicButton";
import Dropdown from 'react-bootstrap/Dropdown'
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';


function rangeOf(start, end){//creates an array from range start to end(exclusive for end) ex: rangeOf(1,4) => [1, 2, 3]
    let newArray = new Array(end-start);
    for(let i = 0; i < newArray.length; i++){
        newArray[i] = start + i;
    }
    return newArray;
}

class ScenarioDropDown extends React.Component {//Dropdown component that contains the list of scenarios or nodes
    constructor(props){
        super(props);
        let indexList = rangeOf(0, props.list.length); //indexList corresponding to the provided indexList
        this.state = {
            // list: indexList,//not needed because we are using an index list, so we can just use i to rebuilt the filteredList when filtering
            filterList: indexList, //uses a list of index instead of the actual value because we will be filtering the list, so the index will let us point to the actual value
            length: 0 //the length of the search term, used to decide if we have to rebuilt the search list from scratch or not
        }
        this.filterListing = this.filterListing.bind(this);
        this.manageList = this.manageList.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleName = this.handleName.bind(this);
    }
    
    componentDidUpdate(){ //I don't think this is needed, manageList() will get recalled whenever a state is updated
        // this.manageList();
    }

    manageList() { //takes the filteredList of indexes and returns the dropdown components based off of the filtered list
        let count = -1;//just used for the key for the list, (for react so that it knows when to update the)
        
        let comList = this.state.filterList.map((entry) => //for every value in the filtered list, it returns a list of dropdown buttons
            {
                count++;
                return <li key = {count}>{
                    <Dropdown.Item as = "button" onClick={() => {//the button takes in the passed in function from props and passes in the index to the function, this will update the state in the parent, so the parent knows the index of which item the user selected in the list
                        if(this.props.func != undefined){
                            this.props.func(entry);
                        }
                    }}>
                    {this.props.list[entry]} 
                    </Dropdown.Item>
                    //the word displayed is found by using the current index term and refferncing the actual list of names passed in props, props.list
                }
            </li>
            }
        );
        return (
            <ul style={{ //the list is then returned to be displayed in render,(note style should probably be removed since that should be handled outside of the js file)
                listStyle: 'none',
                padding: 0
            }}>{comList}</ul>
        );
    }

    filterListing(filterName) {//updates and creates the filtered list, so only the words that start with what the user put in the search field shows up
        //filterName is the string the user inputted in the search field
        let tempList = [];
        if(filterName.length <= this.state.length){//builds list from scratch(whenever the user backspaces)
            for(let i = 0; i < this.props.list.length; i++){//builts a list that only contains the indexs for words that start with the filterName
                if((this.props.list[i] + "").startsWith(filterName)){
                    tempList.push(i);
                }
            }
            this.setState((prevState) => { return {
                filterList: tempList,
                length: prevState.length - 1
            }})
        } else {//only checks the remaining values in the filtered list, when the user types a new character
            for(let i = 0; i < this.state.filterList.length; i++){//builts a list that only contains the indexes for words that start with the filterName in the filteredList
                if((this.props.list[this.state.filterList[i]] + "").startsWith(filterName)){
                    tempList.push(this.state.filterList[i]);
                }
            }
            this.setState((prevState) => { return {
                filterList: tempList,
                length: prevState.length + 1
            }})
        }    
    }

    handleSubmit(event) { //When the user hits enter on the search field
        event.preventDefault(); //prevents the default action of refreshing the page
        if(this.state.filterList.length > 0) {
            this.props.func(this.state.filterList[0]); //calls the function for the first index in the array, so that the user can press enter after typing in the name
        } else {
            this.props.func(-1);//if nothing is in the dropdown list
        }
    }

    handleChange(event) { //when the value in the search bar changes, we must refilter the liist
        this.filterListing(event.target.value);
    }

    handleName(){ //decides what to display on the text for the button
        if (this.props.index == -1) { //the default text on the button before any was displayed
            return this.props.name
        } else { //so that the selected index is displayed
            return this.props.list[this.props.index]
        }
    }

    render() {
        return (
            <Dropdown>
                {/* The dropdown button that you click to see the rest of the options */}
                <Dropdown.Toggle variant = "success" id = "dropdown-basic"> 
                    {/* decides what the text on the button should be */}
                    <this.handleName/> 
                </Dropdown.Toggle>
                {/* The dropdown menu */}
                <Dropdown.Menu>
                    <form onSubmit={this.handleSubmit}>
                        <input type = "text" onChange={this.handleChange}/>
                    </form>
                    <this.manageList/>
                </Dropdown.Menu>
            </Dropdown>
        );
    }
}

class SelectingScenarioNew extends React.Component {//manages the various components to handle use case 1
    constructor(props){
        
        super(props);
        this.state = {
            scenarioNameList: [], //a list of the name of the scenario
            scenarioList: [], //a list of the actual scenario IDs
            selectedScenario: -1, //the index of the selected scenario value in the list of scenarios
            selectedBaseCase: -1,//the index of the selected base case value in the list of scenarios
            apiResponse: "",
            loadingScenario: true, //this is used so we know when we have finished recieving the data from the server

            nodeList: [], //the list of nodes
            selectedNode: -1, //the index of the selected value in the list for nodes
            loadingNode: true, //this is used so we know when we have finished recieving the data from the server
            clicked: false, //the node dropdown should only show up after the user pressed submit for their chosen scenario
            prev: <></>
        }
        this.selectScenario = this.selectScenario.bind(this);
        this.selectBase = this.selectBase.bind(this);
        this.selectNode = this.selectNode.bind(this);
        this.callAPI = this.callAPI.bind(this);
        this.getScenario = this.getScenario.bind(this);
        this.apiResponse = this.apiResponse.bind(this);
        this.getNode = this.getNode.bind(this);
        console.log(this.selectScenario)
    }
    
    componentDidMount() { //when we mount the component we get the list of scenarios
        this.getScenario();
    }

    getScenario() { //calls the server to get the scenario
        let toFetch = "http://localhost:4000/api/v1/data/scenarios";
        fetch(toFetch)
            .then(res => res.json()) //converts to json
            .then(res => {
                let dataArray = res['data']['scenarios']; //the returned value
                let nameArray = []; //name of the items in the array
                let idArray = []; //the actual id of the items in the array
                for(let i = 0; i < dataArray.length; i++){
                    idArray.push(dataArray[i]["SCENARIO_ID"])
                    nameArray.push(dataArray[i]["SCENARIO_NAME"])
                }
                console.log(idArray)
                console.log(nameArray)
                this.setState({ 
                    scenarioList: idArray,
                    scenarioNameList: nameArray,
                    loadingScenario: false //tells the system we finished getting the data from the database                    
                })
            });
    }

    getNode() { //calls the server to get the scenario
        let toFetch = "http://localhost:4000/api/v1/data/nodes/name";
        fetch(toFetch)
            .then(res => res.json()) //converts to json
            .then(res => {
                let dataArray = res['data']['nodes']; //the returned value, which is a array of nodeIds
                console.log(dataArray)
                this.setState({ 
                    clicked: false,
                    nodeList: dataArray,
                    loadingNode: false //tells the system we finished getting the data from the database                    
                })
            });
    }

    getInfo() {
        let toFetch = "http://localhost:4000/api/v1/data/nodes?PNODE_NAME=DR.NORTH&SCENARIO_ID_1=1&SCENARIO_ID_2=2&FIELD=LMP";
        fetch(toFetch)
            .then(res => res.json()) //converts to json
            .then(res => {
                let dataArray = res['data']['nodes']; //the returned value, which is a array of nodeIds
                console.log(dataArray)
                this.setState({ 
                    clicked: false,
                    nodeList: dataArray,
                    loadingNode: false //tells the system we finished getting the data from the database                    
                })
            });
    }

    selectScenario(index) { //updates the selectedScenario's index, passed onto dropdown list, so that those buttons can update the selectedScenario based on the button they press
        this.setState(prevState => ({
            selectedScenario: index
        }));
        console.log("currentIndex: " + index);
    }

    selectBase(index) { //updates the selectedBaseCase's index, passed onto dropdown list, so that those buttons can update the selectedBaseCase based on the button they press
        this.setState(prevState => ({
            selectedBaseCase: index
        }));
        console.log("currentIndex: " + index);
    }

    selectNode(index){ //updates the selectedBaseCase's index, passed onto dropdown list, so that those buttons can update the selectedBaseCase based on the button they press
        this.setState(prevState => ({
            selectedNode: index
        }));
    }

    callAPI() { //After selecting a scenario, a user is able to press the submit button in which we get the node
        if(this.state.selectedScenario != -1) {
            this.getNode(); //gets the list of nodes
            this.setState((prevState) =>
                {
                    return {
                        clicked: true,
                        selectedNode: -1,
                        loadingNode: true,
                        apiResponse: this.state.scenarioList[prevState.selectedScenario] + " " + this.state.scenarioList[prevState.selectedBaseCase]
                    }
                }
            )        
        }
    }

    apiResponse() {//designed so that we only return the elements if the user clicked on submit and the program had finish getting the list of nodes from the server
        return (
            <div className = 'row g-2'>
                {this.state.clicked && this.state.loadingNode && //when we are loading, it displays a loading spinner
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                }
                {!this.state.clicked && !this.state.loadingNode && //displays a dropdown menu with the list of nodes, after we recieved the info from the server
                    <>
                        {/* current logic needs to be updated */}
                        {this.state.apiResponse}
                        <ScenarioDropDown name = "Select Node" index = {this.state.selectedNode} list = {this.state.nodeList} func = {this.selectNode}/>
                        <Button variant="primary" onClick={this.click}>
                            Submit
                        </Button>
                    </>
                }
            </div>
        );
    
    }

    render() {
        return (
            <div>
                {this.state.loadingScenario && //when we are loading, it just says loading
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                }
                {!this.state.loadingScenario && //when we are not loading it produces the acutal result, which is a dropdown of scenarios
                    <div className ='row g-0'>
                        <div>Scenario:</div>

                        <div className = 'col-md-auto '>
                            <ScenarioDropDown name = "Select Scenario" index = {this.state.selectedScenario} list = {this.state.scenarioNameList} func = {this.selectScenario}/>
                        </div>
                        <div className = 'col-md-auto '>
                            <ScenarioDropDown name = "Select BaseCase" index = {this.state.selectedBaseCase} list = {this.state.scenarioNameList} func = {this.selectBase}/>
                        </div>
                        <div className = 'col-md-auto'>
                            <BasicButton name = {"Check"} clickMethod = {() => {
                                this.callAPI()
                            }}/>
                        <SelectingNode base = {this.state.scenarioList[prevState.selectedBaseCase]} scenario = {this.state.scenarioList[prevState.selectedScenario]} />
                        </div>
                    </div>
                }

            </div>
            
        );
    }
}


class SelectingNode extends React.Component {//manages the various components to handle use case 1
    constructor(props){
        super(props);
        //props.base
        //props.scenario
        //props.clicked
        this.state = {
            nodeList: [], //the list of nodes
            selectedNode: -1, //the index of the selected value in the list for nodes
            loadingNode: true, //this is used so we know when we have finished recieving the data from the server
            preview: <></>
        }
        this.selectNode = this.selectNode.bind(this);
        this.callAPI = this.callAPI.bind(this);
        this.apiResponse = this.apiResponse.bind(this);
        this.getNode = this.getNode.bind(this);
        this.getInfo = this.getInfo.bind(this);
        console.log(this.selectScenario)
    }

    getNode() { //calls the server to get the scenario
        let toFetch = "http://localhost:4000/api/v1/data/nodes/name";
        fetch(toFetch)
            .then(res => res.json()) //converts to json
            .then(res => {
                let dataArray = res['data']['nodes']; //the returned value, which is a array of nodeIds
                console.log(dataArray)
                this.setState({ 
                    clicked: false,
                    nodeList: dataArray,
                    loadingNode: false //tells the system we finished getting the data from the database                    
                })
            });
    }

    getInfo() {
        let toFetch = "http://localhost:4000/api/v1/data/nodes?PNODE_NAME=DR.NORTH&SCENARIO_ID_1=1&SCENARIO_ID_2=2&FIELD=LMP";
        fetch(toFetch)
            .then(res => res.json()) //converts to json
            .then(res => {
                let dataArray = res['data']['nodes']; //the returned value, which is a array of nodeIds
                console.log(dataArray)
                this.setState({ 
                    clicked: false,
                    nodeList: dataArray,
                    loadingNode: false //tells the system we finished getting the data from the database                    
                })
            });
    }

    selectNode(index){ //updates the selectedBaseCase's index, passed onto dropdown list, so that those buttons can update the selectedBaseCase based on the button they press
        this.setState(prevState => ({
            selectedNode: index
        }));
    }

    callAPI() { //After selecting a scenario, a user is able to press the submit button in which we get the node
        if(this.state.selectedScenario != -1) {
            this.getNode(); //gets the list of nodes
            this.setState((prevState) =>
                {
                    return {
                        clicked: true,
                        selectedNode: -1,
                        loadingNode: true,
                        apiResponse: this.state.scenarioList[prevState.selectedScenario] + " " + this.state.scenarioList[prevState.selectedBaseCase]
                    }
                }
            )        
        }
    }

    render() {
        return (
            <div className = 'row g-2'>
                {this.state.clicked && this.state.loadingNode && //when we are loading, it displays a loading spinner
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                }
                {!this.state.clicked && !this.state.loadingNode && //displays a dropdown menu with the list of nodes, after we recieved the info from the server
                    <>
                        {/* current logic needs to be updated */}
                        {this.state.apiResponse}
                        <ScenarioDropDown name = "Select Node" index = {this.state.selectedNode} list = {this.state.nodeList} func = {this.selectNode}/>
                        <Button variant="primary" onClick={this.click}>
                            Submit
                        </Button>
                    </>
                }
            </div>
        );
    }
}
export default SelectingNode;