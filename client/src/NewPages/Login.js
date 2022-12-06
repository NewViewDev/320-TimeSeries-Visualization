import React from "react"; 
import Input from "../CustomComponents/Input.js"
import Container from "../CustomComponents/Container";
import Button from "../CustomComponents/Button";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = { apiResponse: "" };
  }

  // callAPI() {
  //   fetch("http://localhost:9000/testAPI")
  //       .then(res => res.text())
  //       .then(res => this.setState({ apiResponse: res }));
  //   fetch("http://localhost:9000/scenario/1")
  //       .then(res => res.json())
  //       .then(res => console.log( res ));
  //   fetch("http://localhost:9000/scenario")
  //       .then(res => res.json())
  //       .then(res => console.log( res ));
  // }

  componentWillMount() {//i think componentWillMount is being deprecated, so this so be updated
      console.log("CALL");
      // this.callAPI();
  }


  render() {
    return(
      <div>
        <Container className="center dark">
          <Container className="sub dark center">
            <div class="center"> <h1>Welcome to Danity</h1> </div>
            <div><p className="App-intro center"> {this.state.apiResponse}</p></div>
            <div class="center"> <h3>Please sign in below</h3> </div>
            <div className="center"><Input>Username</Input></div>
            <div className="center"><Input>Password</Input></div>
            <div className="center"><Button>Sign in</Button></div>
          </Container>

        </Container>
        
      </div>
    );
  }
  
}

export default Home;
