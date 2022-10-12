import React from "react"; 

import './App.css';
import Chart1 from './Components/Chart1';
import MainButton from './Components/MainButton';
import ButtonLists from './Components/ButtonLists';
import BasicButton from './Components/BasicButton';

let test1 = [1,2,3,4,5,6,7,8];
let test2 = [1,2,3,4,5,6,9,6];

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { apiResponse: "" };
  }

  callAPI() {
    fetch("http://localhost:9000/testAPI")
        .then(res => res.text())
        .then(res => this.setState({ apiResponse: res }));
  }

  componentWillMount() {
      this.callAPI();
  }

  testingData(){
    let avg1 = 0;
    let avg2 = 0;
    avg1 =  test1.forEach((prev, curr) => 
        prev + curr    
    , avg1);
    avg2 =  test2.forEach((prev, curr) => 
        prev + curr    
    , avg2);
    if(avg1 === avg2) {
        return <h3> Suceeded SanityCheck</h3>
    }
    return <h3> failed SanityCheck </h3>
  }

  render() {
    return(
      <div>
        <h1>Very Early UI Prototype</h1>
        <p className="App-intro">{this.state.apiResponse}</p>
        <div>
          <MainButton 
              startButton = {"GoToAnaylisis"} 
              backButton = {"GoBackToSanityCheck"} 
              unPressedComponent = {() => <div><BasicButton name = "SanityCheck" clickMethod = {this.testingData}/></div>} 
              pressedComponent = {() =>  
                  <div>
                      <ButtonLists name = "hi2"/>
                      <BasicButton name = "testFiltered" clickMethod = {() => <Chart1/>}/>
                  </div>}
          />
          {/* <ButtonLists buttonList name = "hi"/> */}
          <BasicButton name = "closeProgram" clickMethod = {() => console.log("Under Construction")}/>
        </div>
      </div>
    );
  }
}

export default App;
