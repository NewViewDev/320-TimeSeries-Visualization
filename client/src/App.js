import React from "react"; 

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import NavbarForWeb from "./Components/NavbarForWeb";

let test1 = [1,2,3,4,5,6,7,8];
let test2 = [1,2,3,4,5,6,9,6];

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { apiResponse: "" };
    this.callAPI = this.callAPI.bind(this);
  }
  //calls API just for testing to make sure that we can contact the server
  callAPI() {
    let toFetch = "http://localhost:4000/api/v1/data/scenarios";
    fetch(toFetch)
        .then(res => res.json())
        .then(res => {
            let dataArray = res['data']['scenarios']; //the returned value
            let nameArray = [];
            let idArray = [];
            for(let i = 0; i < dataArray.length; i++){
                idArray.push(dataArray[i]["SCENARIO_ID"])
                nameArray.push(dataArray[i]["SCENARIO_NAME"])
            }
            // console.log(idArray)
            // console.log(nameArray)
            this.setState({ 
                scenarioList: res,
                selectedScenario: "Select Scenario",
                loading: false                    
            })
    });
    let toFetchNodes = "http://localhost:4000/api/v1/data/nodes/name";
  }

  componentWillMount() {//i think componentWillMount is being deprecated, so this so be updated, the call is to make sure the server is alive
      this.callAPI();
  }

  render() { //contains the navbar because currently we have no routes, so the navbar is just switching components, instead of actually changing pages
    return(
      <div>
        <NavbarForWeb/>
      </div>
    );
  }
  
}

export default App;
