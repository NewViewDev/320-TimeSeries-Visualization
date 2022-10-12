import React from "react";
class BasicButton extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            button: props.name,
            clickMethod: props.clickMethod,
            returnedData: <></>
        }
        this.click = this.click.bind(this);//why???
    }

    click(){
        // console.log(typeof(this.props.clickMethod));
        if(typeof(this.props.clickMethod) !== "function"){
            console.log("Clicked");
        } else {
            let returned = this.props.clickMethod();
            this.setState(
                {
                    returnedData: returned
                }
            )
        }
    }

    render() {
        return (
            <React.Fragment>
                {this.state.returnedData}
                <button onClick={this.click}>
                    {this.state.button}
                </button>
            </React.Fragment>
        );
    }
}
export default BasicButton;