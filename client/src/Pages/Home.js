import React from "react"; 

import 'bootstrap/dist/css/bootstrap.min.css';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = { apiResponse: "" };
  }

  callAPI() {
    fetch("http://localhost:9000/testAPI")
        .then(res => res.text())
        .then(res => this.setState({ apiResponse: res }));
    fetch("http://localhost:9000/scenario/1")
        .then(res => res.json())
        .then(res => console.log( res ));
    fetch("http://localhost:9000/scenario")
        .then(res => res.json())
        .then(res => console.log( res ));
  }

  componentWillMount() {//i think componentWillMount is being deprecated, so this so be updated
      console.log("CALL");
      this.callAPI();
  }


  render() {
    return(
      <div>
        <h1>Danity</h1>
        <p className="App-intro">{this.state.apiResponse}</p>
      </div>
    );
  }
  
}

export default Home;
