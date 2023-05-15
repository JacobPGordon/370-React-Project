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
      password: "",
      token: "",
    
      //The 'fail' booleans determine whether or not to display an error message for an empty input box on an attempted submission
      pfail: false,
      tfail: false,
    };

  }

  passwordHandler = (event) => {
    this.setState({pfail: false});
    this.setState({password: event.target.value});
 
  }

  tokenHandler = (event) => {
    this.setState({tfail: false});
      this.setState({token: event.target.value});
     
  }


  submitHandler = (event) => {
    event.preventDefault();
    //checking for empty inputs

    if(this.state.password == ""){
      this.setState({pfail:true});
    }

    if(this.state.token ==""){
        this.setState({tfail:true});
    }


      //Checking if all fields are filled in
      if(this.state.tfail == true || this.state.pfail == true){
        //do nothing and render any possible error messages
      }else{
        //API call
        fetch(process.env.REACT_APP_API_PATH+"/auth/reset-password", {
          method:"post",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            password : this.state.password,
            token: this.state.token,
          })
        }).then(response => response.json())
        .then(
          result => {
            if(result.path){
                console.log(this.state.token);
                console.log(this.state.password);
            }else{
                console.log(this.state.token);
              console.log(this.state.password);
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
                  Token&nbsp;
                  <input type="email" onChange={this.tokenHandler} placeholder="Enter Token From Email" className={fpStyle.input}/> 
                </label>
                {this.state.tfail ? (
                  <p className={fpStyle.formTextW} class={fpStyle.error}>Token is a required field</p>
                ): <></>}
                {this.state.bade ? (<p className={fpStyle.formTextW} class={fpStyle.error} >Looks like the token was incorrect, try again!</p>):<></>}
                <br/>

                <label className={fpStyle.label}>
                  New Password&nbsp;
                  <input type="password" onChange={this.passwordHandler} placeholder="Enter Password" className={fpStyle.input}/> 
                </label>
                {this.state.pfail ? (
                  <p className={fpStyle.formTextW} class={fpStyle.error}>Password is a required field</p>
                ): <></>}
                {this.state.bade ? (<p className={fpStyle.formTextW} class={fpStyle.error} >Please enter a valid email</p>):<></>}
                <br/>

               
                <button onClick={this.submitHandler} className={fpStyle.button}>Submit!</button>
                

                <Link to="/">
                <button className={fpStyle.button}>Return Home</button>
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