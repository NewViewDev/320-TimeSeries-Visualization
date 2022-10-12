import Button from 'react-bootstrap/Button';
import React from "react";
class MainButton extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            startButton: props.startButton,
            backButton: props.backButton,
            pressed: false,
            unPressedComponent: props.unPressedComponent,
            pressedComponent: props.pressedComponent
        }
        this.click = this.click.bind(this);//why???
    }

    click(){
        this.setState((prevState) => {
            return { pressed: !prevState.pressed}
        })
    }

    render() {
        return (
            <div className="Mainbutton">
                {!this.state.pressed &&
                <React.Fragment>
                    <Button onClick={this.click}>
                        {this.state.startButton}
                    </Button>
                    <this.state.unPressedComponent />
                </React.Fragment>
                }
                {this.state.pressed &&
                <React.Fragment>
                    <Button onClick={this.click}>
                        {this.state.backButton}
                    </Button>
                    <this.state.pressedComponent />
                </React.Fragment>
                }
            </div>
        );
    }
}

export default MainButton;