import React, {Component} from "react";
import axios from "axios";
import PolicyTable from "../PolicyTable/PolicyTable";
import BarChart from "../Chart/BarChart";
import Select from '@material-ui/core/Select';
import {Button, FormControl, Input, InputLabel, MenuItem} from "@material-ui/core";

class Dashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            customerId: '',
            policyId: '',
            policies: [],
            policiesCols: [],
            year: '2018',
            region: 'South',
            chartData: []
        }
    }

    getPolicy = () => {
        const {customerId, policyId} = this.state;
        let policies = [];
        axios.get('http://localhost:4000/getPolicyDetails', {
            params: {
                customerId: customerId,
                policyId: policyId
            }
        })
            .then((response) => {
                policies = response.data
                return axios.get('http://localhost:4000/getColumnData')
            })
            .then((response) => {
                const cols = response.data;
                this.addValidationToColumns(policies, cols);
            }).catch(err => {
            console.log(err)
        })
    }

    getChartData = () => {
        const {year, region} = this.state;
        let policies = [];
        axios.get('http://localhost:4000/getChartData', {
            params: {
                year: year,
                region: region
            }
        })
            .then((response) => {
                policies = response.data
                this.setChartData(policies);
            }).catch(err => {
            console.log(err)
        })
    }

    setChartData = (policies) => {
        let chartData = [];
        let months = {
            "Jan": 0, "Feb": 0, "Mar": 0, "Apr": 0, "May": 0, "Jun": 0,
            "Jul": 0, "Aug": 0, "Sep": 0, "Oct": 0, "Nov": 0, "Dec": 0
        };
        chartData = policies.reduce((acc, policy) => {
            let month = new Date(policy["Date of Purchase"]).toLocaleString('default', {month: 'short'});
            if (acc[month]) {
                acc[month]++;
            } else {
                acc[month] = 1;
            }
            return acc;
        }, months)
        this.setState({
            chartData: chartData
        })
    }

    updatePolicy = (policyData) => {
        return axios.post('http://localhost:4000/policy', policyData).then(() => {
            const policies = [...this.state.policies];
            const policyIndex = policies.findIndex((policy) => policy._id === policyData._id);
            policies[policyIndex] = policyData;
            this.setState({
                policies: policies
            })
        }).catch(err => console.log(err))
    }

    addValidationToColumns = (policies = [], columns = []) => {
        if (columns.length) {
            columns.forEach((col, index) => {
                if (col.field === "Premium") {
                    columns[index]['validate'] = (rowData) => {
                        if (rowData.Premium >= 1000000) {
                            return 'Premium cannot be more than 1 Million'
                        }
                        return true;
                    }
                }
            });
        }
        this.setState({
            policies: policies,
            policiesCols: columns
        })
    }

    render() {
        return (
            <div>
                <header>
                    <h1>Insurance policies</h1>
                </header>
                <FormControl variant="outlined" style={{marginRight: "2em"}}>
                    <InputLabel>Customer Id</InputLabel>
                    <Input type="text" onChange={(e) => this.setState({customerId: e.target.value})}/>
                </FormControl>
                <FormControl variant="outlined">
                    <InputLabel>Policy Id</InputLabel>
                    <Input type="text" onChange={(e) => this.setState({policyId: e.target.value})}/>
                </FormControl>
                <br/>
                <Button variant="contained" color="primary" onClick={this.getPolicy} size="small"
                        style={{margin: "1.5em 0"}}>
                    Search
                </Button>
                <PolicyTable
                    policies={this.state.policies ? this.state.policies : undefined}
                    cols={this.state.policiesCols ? this.state.policiesCols : undefined}
                    updatePolicy={(policyData) => this.updatePolicy(policyData)}
                />
                <br/><br/><br/><br/>
                <FormControl variant="outlined" style={{marginRight: "2em"}}>
                    <InputLabel id="demo-simple-select-outlined-label">Year</InputLabel>
                    <Select
                        label="Year"
                        value={this.state.year}
                        onChange={(e) => this.setState({year: e.target.value})}
                    >
                        {['2017', '2018', '2019', '2020'].map((year, index) => {
                            return <MenuItem key={index} value={year}>{year}</MenuItem>
                        })}
                    </Select>
                </FormControl>
                <FormControl variant="outlined">
                    <InputLabel id="demo-simple-select-outlined-label">Region</InputLabel>
                    <Select
                        label="Region"
                        value={this.state.region}
                        onChange={(e) => this.setState({region: e.target.value})}
                    >
                        {['North', 'South', 'East', 'West'].map((region, index) => {
                            return <MenuItem key={index} value={region}>{region}</MenuItem>
                        })}
                    </Select>
                </FormControl>
                <br/>
                <Button variant="contained" color="primary" size="small" onClick={this.getChartData}
                        style={{margin: "1.5em"}}>
                    Generate Chart
                </Button>
                <BarChart
                    data={this.state.chartData}
                />
                <br/>
            </div>
        )
    }

}

export default Dashboard;