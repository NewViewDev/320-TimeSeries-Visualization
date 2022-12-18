import React from "react"; 
import Input from "../CustomComponents/Input.js"
import Container from "../CustomComponents/Container";
import Button from "../CustomComponents/Button";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = { apiResponse: "" };
  }


  render() {
    //renders the login screen, which  has a Input for username and password, as well as a button to sign in, however there is no funcitonality implemented
    return(
      <div>
        <Container className="center dark">
          <Container className="sub dark center">
            <div className="center"> <h1>Welcome to Danity</h1> </div>
            {/* <div><p className="App-intro center"> {this.state.apiResponse}</p></div> */}
            <div className="center"> <h3>Please sign in below</h3> </div>
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
