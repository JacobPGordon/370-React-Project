import React from "react";
import "../css/confirmationPage.css";
import "../css/App.css";

import {Link } from "react-router-dom";

export default class ConfirmationPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          username: "",
          firstname: "",
          lastname: "",
          userid: props.userid,
          // NOTE : if you wanted to add another user attribute to the profile, you would add a corresponding state element here
        };
        this.fieldChangeHandler.bind(this);
    }
    
    fieldChangeHandler(field, e) {
        console.log("field change");
        this.setState({
          [field]: e.target.value
        });
    }

    render(){
      const {error, isLoaded, userid} = this.state;
      if (error) {
        return <div> Error: {error.message} </div>;
      } else {
        return (
          <div>
            <p className="emailAddressText">We have sent an email with a confirmation link to your email address.</p>
            <p className="arrivalText">
              Please allow 5-10 minutes for this message to arrive.
              <br/>
              <br/>
              <Link to="/posts">
                <button className="positionButton">click here to get started!</button>
              </Link>
            </p>
          </div>
        );
      }
    }
}