import React from "react";

import {
  Link
} from 'react-router-dom';

import "../css/App.css";
import fpStyle from "../css/ForgotPass.module.css";
import navbarStyle from "../css/Navbar.module.css";
import NewNavBar from "./NewNavBar.jsx";
import factoryWithThrowingShims from "prop-types/factoryWithThrowingShims";

// Registration page - copied from login page, TODO: fix the backend connectivity.
// Commented out all of the component/class functions as I'm not sure what you guys do or don't need. You'll prob have to write some other ones.
//email validity rules courtesy of https://help.returnpath.com/hc/en-us/articles/220560587-What-are-the-rules-for-email-address-syntax-

export default class Register extends React.Component {
   constructor(props) {
     super(props);
     this.state = {
      email: "",
    
      //The 'fail' booleans determine whether or not to display an error message for an empty input box on an attempted submission
      efail: false,
    };

  }
  





  emailHandler = (event) => {
    this.setState({efail: false});
    this.setState({email: event.target.value});
  }


  submitHandler = (event) => {
    event.preventDefault();
    //checking for empty inputs

    if(this.state.email == ""){
      this.setState({efail:true});
    }


      //Checking if all fields are filled in
      if(this.state.efail == true){
        //do nothing and render any possible error messages
      }else{
        //API call
        fetch(process.env.REACT_APP_API_PATH+"/auth/request-reset", {
          method:"post",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email : this.state.email, 
          })
        }).then(response => response.json())
        .then(   
          result => {
            if(result.path){

            }else{
              
            }
          }
        )

      }
  }

  render() {
    return (
      <div className={fpStyle.container}>
        <div className={fpStyle.box}>
          <NewNavBar></NewNavBar>
        </div>  

        <div className={fpStyle.box}>
            
          <form onSubmit={this.submitHandler} className={fpStyle.form}>
            <div className={fpStyle.box}>

                <h1 className={fpStyle.headerA}> Forgot Password </h1>
                
                
                <label className={fpStyle.label}>
                  Email Address&nbsp;
                  <input type="email" onChange={this.emailHandler} placeholder="Enter Email Address" className={fpStyle.input}/>
                </label>
                {this.state.efail ? (
                  <p className={fpStyle.error}>Email is a required field</p>
                ): <></>}
                {this.state.bade ? (<p className={fpStyle.error} >Please enter a valid email</p>):<></>}
                <br/>

               
                <button onClick={this.submitHandler} className={fpStyle.button}>Submit Request For Emailed Token!</button>

                <Link to="/ForgotPasswordAuth">
                <button className={fpStyle.button}>Enter in Token</button>
                </Link>
                  
              </div>
            </form>
              
          </div>
            
          <div className={fpStyle.box}>
            <div className={fpStyle.rightBox}></div>
          </div>      
        </div>
        
    );
  }
}