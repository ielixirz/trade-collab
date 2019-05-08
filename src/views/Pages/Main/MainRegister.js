// MainForm.jsx
import React, { Component } from 'react';
import Register from '../Register/Register';
import SelectRole from '../SelectProfile/SelectRole';
import Confirmation from '../SelectProfile/Confirmation';
import Success from '../SelectProfile/Success';

class MainRegister extends Component {
    state = {
        step: 1,
        Firstname: '',
        Lastname: '',
        Email: ''
    }

    nextStep = () => {
        const { step } = this.state
        this.setState({
            step : step + 1
        })
    }

    prevStep = () => {
        const { step } = this.state
        this.setState({
            step : step - 1
        })
    }

    handleChange = input => event => {
        this.setState({ [input] : event.target.value })
    }

    render(){
        const {step} = this.state;
        const { Firstname, Lastname, Email} = this.state;
        const values = { Firstname, Lastname, Email };
        switch(step) {
        case 1:
            return <Register 
                    nextStep={this.nextStep} 
                    handleChange = {this.handleChange}
                    values={values}
                    />
        case 2:
            return <SelectRole 
                    nextStep={this.nextStep}
                    prevStep={this.prevStep}
                    handleChange = {this.handleChange}
                    values={values}
                    />
        case 3:
            return <Confirmation 
                    nextStep={this.nextStep}
                    prevStep={this.prevStep}
                    values={values}
                    />
        case 4:
            return <Success />
        }
    }
}

export default MainRegister;