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
                <span>Button: </span>
                {!this.state.pressed &&
                <React.Fragment>
                    <button className = "square" onClick={this.click}>
                        {this.state.startButton}
                    </button>
                    <this.state.unPressedComponent />
                </React.Fragment>
                }
                {this.state.pressed &&
                <React.Fragment>
                    <button onClick={this.click}>
                        {this.state.backButton}
                    </button>
                    <this.state.pressedComponent />
                </React.Fragment>
                }
            </div>
        );
    }
}

export default MainButton;