import React from "react";
import BasicButton from "./BasicButton";
import DropDownTest from "./DropDownTest";
import Stack from 'react-bootstrap/Stack';
class ButtonLists extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            name: props.name,
            count: 0,
            list: []
        };
        this.comList = null;
        this.manageList = this.manageList.bind(this);//why???
        this.plus = this.plus.bind(this);//why???
        this.minus = this.minus.bind(this);
        this.reset = this.reset.bind(this);
    }

    manageList() {
        this.comList = this.state.list.map((number) =>
            <li key = {number}>{
                    // <BasicButton name = {"Filter #" + (number + 1)} clickMethod = {() => console.log("Clicked on Button " + (number + 1))}/>
                    <DropDownTest name = {"Filter #" + (number + 1)} list = {[1,2,3,4,5]}/>
            }
            </li>
        );
        return (
            <ul>{this.comList}</ul>
        );
    }

    reset() {
        this.setState(
            {list: []}
        )
    }

    plus(){
        // console.log("what");
        this.setState((prevState) => {
            let copyList = prevState.list.slice(0);
            // let copyList = [0,1];
            copyList.push(copyList.length);
            // console.log(copyList);
            return { 
                count: prevState.count + 1,
                list: copyList
            }
        })
    }

    minus(){
        // console.log("what");
        this.setState((prevState) => {
            let copyList = prevState.list.slice(0);
            // let copyList = [0,1];
            copyList.pop();
            return { 
                count: prevState.count - 1,
                list: copyList
            }
        })
    }

    render(){
        return (
            <>
                <Stack direction="horizontal" gap={2}>
                    <BasicButton name = {"+"} clickMethod = {this.plus}/>
                    <BasicButton name = {"-"} clickMethod = {this.minus}/>
                    <BasicButton name = {"reset"} clickMethod = {this.reset}/>
                    
                </Stack>
                <this.manageList/>
            </>
        );
    }
}

export default ButtonLists;