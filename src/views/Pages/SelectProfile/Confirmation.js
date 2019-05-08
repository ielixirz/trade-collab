import React, { Component } from 'react';
import { Button } from 'reactstrap';

class Confirmation extends Component{
    saveAndContinue = (e) => {
        e.preventDefault();
        this.props.nextStep();
    }

    back  = (e) => {
        e.preventDefault();
        this.props.prevStep();
    }

    render(){
        const {values: { Firstname, Lastname, Email }} = this.props;

        return(
            <div>
                <h1 className="ui centered">Confirm your Details</h1>
                <p>Click Confirm if the following details have been correctly entered</p>
              
                        <p>First Name: {Firstname}</p>
                  
                        <p>Last Name: {Lastname}</p>
      
                        <p>
                        Email: {Email}
                        </p>
                 
                <Button onClick={this.saveAndContinue}>Confirm</Button>
            </div>
        )
    }
}

export default Confirmation;