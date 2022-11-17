import React from "react";
import ToggleButton from 'react-bootstrap/ToggleButton';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import Nav from 'react-bootstrap/Nav'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'

function genRow(date, mean, std, median, keyValue){
    return (
        <tbody key = {keyValue}>
                            <tr>
                                <td>{date}</td>
                                <td>{mean}</td>
                                <td>{std}</td>
                                <td>{median}</td>
                            </tr>
        </tbody>
    )
}

function toMonthString(month) {
    switch (month) {
        case 0:
            return 'Jan';
        case 1:
            return 'Feb';
        case 2:
            return 'Mar';
        case 3:
            return 'Apr';
        case 4:
            return 'May';
        case 5:
            return 'Jun';
        case 6:
            return 'Jul';
        case 7:
            return 'Aug';
        case 8:
            return 'Sep';
        case 9:
            return 'Oct';
        case 10:
            return 'Nov';
        case 11:
            return 'Dec';
    
    }
}

class TestPage extends React.Component {
    
    constructor(props) {
        super(props)
        this.state = {
            count:1,
            mean: 0,
            std: 0,
            median:0,
        }
        let toFetch = "http://localhost:4000/api/v1/data/nodes/group?SCENARIO_ID=1&START_DATE=2022-07-01T00:00:00&END_DATE=2023-07-02T00:00:00&FIELD=LMP&GROUPBY=PNODE_NAME&GROUPBY=LMP&LMP_RANGE";
        this.click = this.click.bind(this);
        this.allTesting = this.allTesting.bind(this);
        this.yearlyTesting = this.yearlyTesting.bind(this);
        this.monthlyTesting = this.monthlyTesting.bind(this);
        this.quarterlyTesting = this.quarterlyTesting.bind(this);
        this.dailyTesting = this.dailyTesting.bind(this);
        this.dailyTesting2 = this.dailyTesting2.bind(this);
        this.changeFrom = this.changeFrom.bind(this);
        this.submitFrom = this.submitFrom.bind(this);
        this.genTable = this.genTable.bind(this);
    }

    componentDidMount(){
        // this.allTesting();
    }
    
    async allTesting(){
        // for(let i = 0; i < 10; i++){
        let toFetch = "http://localhost:4000/api/v1/data/nodes/group?SCENARIO_ID=1&START_DATE=2020-07-01T00:00:00&END_DATE=2023-07-02T00:00:00&FIELD=LMP&GROUPBY=PNODE_NAME&GROUPBY=LMP&LMP_RANGE";
        let response = await fetch(toFetch);
        let json = await response.json();
        
        let results = json['data']['groups'][',.I.KENT    345 2']['stats'];
        let list2 = [];
        let startDate = new Date(2020, 7, 1, 1);
        list2.push(
            {dateName: 'All', date: startDate, mean: results['mean'], std: results['std'], median: results['median']}
        )
        this.setState((prevState) =>
            {
                console.log('hi1');
                return {   
                    testList2: list2,
                }
            }
        )
        
    }

    async monthlyTesting(){//need to add abort signal
        console.log('hi');
        let list2 = [];
        for(let year = 2019; year < 2023; year++){
            for(let i = 0; i < 12; i++){            
                
                let startDate = new Date(year, i, 1, 1)
                let endDate = new Date(year, i+1, 1, 0)
                let startDateInUTCString = startDate.toUTCString();
                let endDateInUTCString = endDate.toUTCString();
                let toFetch = "http://localhost:4000/api/v1/data/nodes/group?SCENARIO_ID=1&START_DATE=" +startDateInUTCString.slice(0, startDateInUTCString.length - 4) + "&END_DATE="+endDateInUTCString.slice(0, endDateInUTCString.length - 4)+"&FIELD=LMP&GROUPBY=PNODE_NAME&GROUPBY=LMP&LMP_RANGE"
                let response = await fetch(toFetch);
                let json = await response.json();
                if(json['data'] == undefined) {
                    list2.push(
                        // genRow(year + " " + toMonthString(i), 0, 0, 0, (year - 2019) * 365 + i)
                        {dateName: year + " " + toMonthString(i), date: startDate, mean: 0, std: 0, median: 0}
                    )
                } else {
                    let results = json['data']['groups'][',.I.KENT    345 2']['stats'];
                    list2.push(
                        // genRow(year + " " + toMonthString(i), results['mean'], results['std'], results['median'], (year - 2019) * 365 + i)
                        {dateName: year + " " + toMonthString(i), date: startDate, mean: results['mean'], std: results['std'], median: results['median']}
                    )
                }
            }
        }
        this.setState((prevState) =>
            {return {   
                testList2: list2,
            }}
        )
    }

    toUTC

    async dailyTesting2(){//need to add abort signal
        function numberOfDaysInMonth(year, month){
            let tempDate = new Date(year, month + 1, 0);
            return tempDate.getDate();
        }

        console.log('hi');

        let count = 0;
        let fetchList = [];
        let dateList =[];
        for(let year = 2020; year < 2021; year++){
            console.log(year);
            for(let i = 0; i < 12; i++){   
                console.log(i);
                console.log(numberOfDaysInMonth(year, i));        
                let numberOfDays = numberOfDaysInMonth(year, i);
                for(let j = 0; j < numberOfDays; j++){
                    let startDate = new Date(year, i, j+1, 1)
                    let endDate = new Date(year, i, j+2, 0)
                    let startDateInUTCString = startDate.toUTCString();
                    let endDateInUTCString = endDate.toUTCString();
                    console.log(startDate + " " + endDate);
                    let toFetch = "http://localhost:4000/api/v1/data/nodes/group?SCENARIO_ID=1&START_DATE=" +startDateInUTCString.slice(0, startDateInUTCString.length - 4) + "&END_DATE="+endDateInUTCString.slice(0, endDateInUTCString.length - 4)+"&FIELD=LMP&GROUPBY=PNODE_NAME&GROUPBY=LMP&LMP_RANGE"
                    // console.log(toFetch);
                    dateList.push(startDate);
                    fetchList.push(fetch(toFetch).then(res=>res.json()));

                    // console.log(json);
                    count++;
                } 
            }
        }
        let result = await Promise.all(fetchList);
        console.log('done with fetching data')
        let list2 = [];
        console.log('result');
        console.log(result);

        for(let i = 0; i < result.length; i++){
            let json = result[i];
            console.log(json['data']);
            // if(this.state.usedFilter == undefined || (this.state.usedFilter != undefined && dateList[i].getTime() >= this.state.usedFilter)){
            if(json['data'] == undefined) {
                list2.push(
                    {dateName: dateList[i].toDateString(), date: dateList[i], mean: 0, std: 0, median: 0, startDate: new Date(dateList[i].toUTCString().slice(0, dateList[i].toUTCString().length))}
                )
                
            } else {
                console.log('hi');
                let results = json['data']['groups'][',.I.KENT    345 2']['stats'];
                list2.push(
                    {dateName: dateList[i].toDateString(), date: dateList[i], mean: results['mean'], std: results['std'], median: results['median']}
                )
            }
            // }
        }
        console.log(list2);
        this.setState((prevState) =>
            {return {   
                testList2: list2,
            }}
        )
    }

    async dailyTesting(){//need to add abort signal
        function numberOfDaysInMonth(year, month){
            let tempDate = new Date(year, month + 1, 0);
            return tempDate.getDate();
        }
        console.log('hi');

        let list2 = [];
        for(let year = 2017; year < 2023; year++){
            console.log(year);
            for(let i = 0; i < 12; i++){   
                console.log(i);
                console.log(numberOfDaysInMonth(year, i));        
                let numberOfDays = numberOfDaysInMonth(year, i);
                for(let j = 0; j < numberOfDays; j ++){
                    let startDate = new Date(year, i, j+1, 1)
                    let endDate = new Date(year, i, j+2, 0)
                    let startDateInUTCString = startDate.toUTCString();
                    let endDateInUTCString = endDate.toUTCString();
                    let toFetch = "http://localhost:4000/api/v1/data/nodes/group?SCENARIO_ID=1&START_DATE=" +startDateInUTCString.slice(0, startDateInUTCString.length - 4) + "&END_DATE="+endDateInUTCString.slice(0, endDateInUTCString.length - 4)+"&FIELD=LMP&GROUPBY=PNODE_NAME&GROUPBY=LMP&LMP_RANGE"
                    let response = await fetch(toFetch);
                    let json = await response.json();
                    if(json['data'] == undefined) {
                        list2.push(
                            {dateName: startDate.toDateString(), date: startDate, mean: 0, std: 0, median: 0}
                        )
                    } else {
                        let results = json['data']['groups'][',.I.KENT    345 2']['stats'];
                        list2.push(
                            
                            {dateName: startDate.toDateString(), date: startDate, mean: results['mean'], std: results['std'], median: results['median']}
                            
                        )
                    }
                } 
            }
        }
        this.setState((prevState) =>
            {return {   
                testList2: list2,
            }}
        )
    }

    async quarterlyTesting(){//need to add abort signal
        function getQuarter(i){
            switch (i) {
                case 0:
                    return 'q1';
                case 1:
                    return 'q2';
                case 2:
                    return 'q3';
                case 3:
                    return 'q4';
            }
        }
        console.log('hi');
        let list2 = [];
        for(let year = 2019; year < 2023; year++){
            for(let i = 0; i < 4; i++){            
                
                let startDate = new Date(year, 3*i, 1, 1)
                let endDate = new Date(year, 3*(i+1), 1, 0)
                let startDateInUTCString = startDate.toUTCString();
                let endDateInUTCString = endDate.toUTCString();
                let toFetch = "http://localhost:4000/api/v1/data/nodes/group?SCENARIO_ID=1&START_DATE=" +startDateInUTCString.slice(0, startDateInUTCString.length - 4) + "&END_DATE="+endDateInUTCString.slice(0, endDateInUTCString.length - 4)+"&FIELD=LMP&GROUPBY=PNODE_NAME&GROUPBY=LMP&LMP_RANGE"
                let response = await fetch(toFetch);
                let json = await response.json();
                if(json['data'] == undefined) {
                    list2.push(
                        {dateName: year + " " + getQuarter(i), date: startDate, mean: 0, std: 0, median: 0}
                    )
                } else {
                    let results = json['data']['groups'][',.I.KENT    345 2']['stats'];
                    list2.push(
                        {dateName: year + " " + getQuarter(i), date: startDate, mean: results['mean'], std: results['std'], median: results['median']}
                    )
                }
            }
        }
        this.setState((prevState) =>
            {return {   
                testList2: list2,
            }}
        )
    }

    async yearlyTesting(){//need to add abort signal
        let year = 2019;
        let list2 = [];
        for(year; year < 2023;){
            let startDate = new Date(year, 0, 1, 1)
            let endDate = new Date(year + 1, 0, 1, 0)
            let startDateInUTCString = startDate.toUTCString();
            let endDateInUTCString = endDate.toUTCString();
            console.log(startDateInUTCString.slice(0, startDateInUTCString.length - 4))
            let toFetch = "http://localhost:4000/api/v1/data/nodes/group?SCENARIO_ID=1&START_DATE=" +startDateInUTCString.slice(0, startDateInUTCString.length - 4) + "&END_DATE="+endDateInUTCString.slice(0, endDateInUTCString.length - 4)+"&FIELD=LMP&GROUPBY=PNODE_NAME&GROUPBY=LMP&LMP_RANGE"
            let response = await fetch(toFetch);
            let json = await response.json();
            if(json['data'] == undefined) {
                list2.push(
                    {dateName: year, date: startDate, mean: 0, std: 0, median: 0}
                )
            } else {
                let results = json['data']['groups'][',.I.KENT    345 2']['stats'];
                list2.push(
                    {dateName: year, date: startDate, mean: results['mean'], std: results['std'], median: results['median']}
                )
            }
            console.log(json);
            year += 1;
        
        }

        this.setState((prevState) =>
            {return {   
                testList2: list2,
            }}
        )
        
    }
    click(e) {
        // e.preventDefault();
        // this.allTesting();
        let list = [];
        for(let i = 0; i < this.state.count; i++){
            list.push(
            <tbody key ={i}>
                <tr>
                    <td>11/24/2022</td>
                    <td>{i}</td>
                    <td>{i}</td>
                    <td>{i}</td>
                </tr>
            </tbody>)
        }
        this.setState((prevState) =>
            {return {   
                count: prevState.count + 1,
                testList: list,
                mean: Math.floor(Math.random() * 100),
                std: Math.floor(Math.random() * 50) + 100,
                median: Math.floor(Math.random() * -50)
            }}
        )
        console.log("hi");
    }

    submitFrom(event) {//when they press enter, we print the state for debugging
        event.preventDefault();
        this.setState((prevState) =>
        {
            if(prevState.filterDate!=undefined) {
                return {
                    usedFilter: prevState.filterDate.getTime()    
                }
            }
        })
        console.log(this.state);
    }

    changeFrom(event){//may need to put all of this into the set state to deal with stale states(not sure though)
        ////whenever the user changes the input for time or date
        if(event.target.name == "date" && event.target.value.substring(0,5).endsWith('-')){//if they alter the date field, 
            let newDate = new Date(event.target.value);
            console.log(newDate);
            this.setState({
                filterDate: newDate
            })
        } else {
            this.setState({
                filterDate: undefined
            })
        }
    }

    genTable(){
        if(this.state.testList2 != undefined){
            console.log('hi')
            let tableData = []
            for(let i = 0; i < this.state.testList2.length; i++){
                let data = this.state.testList2[i]
                if((this.state.usedFilter == undefined) || (this.state.usedFilter != undefined && data['date'].getTime() >= this.state.usedFilter))
                    tableData.push(genRow(data['dateName'], data['mean'], data['std'], data['median'], i))
            }    
            return tableData;
        }
    }

    render() {
        return (
            <div>
                <form onSubmit = {this.submitFrom}>
                    <label> Local Time:
                        {/* This is where the user inputs the date and time */}
                        <input type = "date" name = "date" onChange = {this.changeFrom}/>
                    </label>
                    <Button type = "submit" value = "click">submit</Button>
                </form>
                <Nav variant = "pills">
                    <ToggleButtonGroup type = "radio" name = "Testing">
                        <ToggleButton variant = "outline-dark" id = {"All"} value ={'All'} onClick={this.allTesting}>
                            All
                        </ToggleButton>
                        <ToggleButton variant = "outline-dark" id = {"Daily"} value ={'Daily'} onClick={this.dailyTesting2}>
                            Daily
                        </ToggleButton>
                        <ToggleButton variant = "outline-dark" id = {"Monthly"} value ={'Monthly'} onClick={this.monthlyTesting}>
                            Monthly
                        </ToggleButton>
                        <ToggleButton variant = "outline-dark" id = {"Quarterly"} value ={'Quarterly'} onClick={this.quarterlyTesting}>
                            Quarterly
                        </ToggleButton>
                        <ToggleButton variant = "outline-dark" id = {"Yearly"} value ={'Yearly'} onClick={this.yearlyTesting}>
                            Yearly
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Nav>
                <Table striped bordered hover>
                    <thead onClick={this.click}>
                        <tr>
                            <th>Date</th>
                            <th>Mean</th>
                            <th>STD</th>
                            <th>Median</th>
                        </tr>
                    </thead>
                    {this.state.testList}
                    {/* {this.state.testList2} */}
                    {this.genTable()}
                </Table>   
            </div>
            
        );
    }
}
export default TestPage