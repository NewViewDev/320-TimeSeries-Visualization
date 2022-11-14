import React from "react"; 

import 'bootstrap/dist/css/bootstrap.min.css';
import DemoForDropdownUpdatingImmediately from "../Components/DemoForDropdownUpdatingImmediately";
import TimeSeriesLinePlot from "../Components/GraphFolder/TimeSeriesLinePlot";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = { apiResponse: "" };
  }

  callAPI() { //should probably add a endpoint to make sure that the server is up, I think that was one of the use cases for use case 2
    // fetch("http://localhost:9000/testAPI")
    //     .then(res => res.text())
    //     .then(res => this.setState({ apiResponse: res }));
    // fetch("http://localhost:9000/scenario/1")
    //     .then(res => res.json())
    //     .then(res => console.log( res ));
    // fetch("http://localhost:9000/scenario")
    //     .then(res => res.json())
    //     .then(res => console.log( res ));
  }

  componentWillMount() {//i think componentWillMount is being deprecated, so this so be updated
      this.callAPI();
  }


  render() {
    return(
      <div>
        <h1>Danity</h1>
        <p className="App-intro">{this.state.apiResponse}</p>
        <DemoForDropdownUpdatingImmediately/>
        {/* <TimeSeriesLinePlot/> */}
        
      </div>
    );
  }

}

export default Home;
