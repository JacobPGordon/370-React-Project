import React from "react";
import { Navigate } from "react-router-dom";

import {
  Link
} from 'react-router-dom';


import "../css/App.css";
import regStyle from "../css/Reg.module.css";
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
      username: "",
      password: "",
      firstname: "",
      lastname: "",
      token: "",
      //The 'fail' booleans determine whether or not to display an error message for an empty input box on an attempted submission
      pfail: false,
      ufail: false,
      ffail: false,
      lfail: false,
      efail: false,
    };

  }

  


 /* firstnameHandler = event =>{
  }
  lastnameHandler = event =>{
  } */

  signup = (event) => {
    event.preventDefault();
    var failed=false;
    if(this.state.email == ""){
      this.setState({efail:true});
      failed=true;
    }

    if(this.state.password == ""){
      this.setState({pfail:true});
      failed=true;
    }
    
    if(this.state.username == ""){
      this.setState({ufail:true});
      failed=true;
    }
    if(failed==false){
      sessionStorage.setItem("regSuc", true);
      fetch("https://webdev.cse.buffalo.edu/hci/api/api/thejs/auth/signup", {
      method: "POST",

      headers:{
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password,
        attributes: {username: this.state.username},
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        
      });

    
    var url = window.location.href;
    var lastSlash = url.lastIndexOf('/');
    url = (url.substring(0,lastSlash+1));
    window.location.assign(url);
    }
    
    

  };

  passwordHandler = (event) => {
    this.setState({pfail: false});
    this.setState({password: event.target.value});
  }

  usernameHandler = (event) => {
    this.setState({ufail: false});
    this.setState({username: event.target.value});
  }

  emailHandler = (event) => {
    this.setState({efail: false});
    this.setState({email: event.target.value});
  }


  submitHandler = (event) => {
    event.preventDefault();
    //checking for empty inputs
    var failed=false;
    if(this.state.email == ""){
      this.setState({efail:true});
      failed=true;
    }

    if(this.state.password == ""){
      this.setState({pfail:true});
      failed=true;
    }
    
    if(this.state.username == ""){
      this.setState({ufail:true});
    }


      //Checking if all fields are filled in
      if(this.state.ufail == true || this.state.efail == true || this.state.pfail == true){
        //do nothing and render any possible error messages
      }else{
        //API call
        fetch(process.env.REACT_APP_API_PATH+"/auth/signup", {
          method:"post",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email : this.state.email,
            password : this.state.password,
            attributes: {username: this.state.username}

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
      <div className={regStyle.container}>
        <div className={regStyle.box}>
          <NewNavBar></NewNavBar>
        </div>  

        <div className={regStyle.box}>
          <form onSubmit={this.signup} className={regStyle.form} style={{width:440,height:600}}>
            <div className={regStyle.box}>
                
                <label className={regStyle.label}>
                  First Name&nbsp;
                  <input type="text" placeholder="Enter First Name" className={regStyle.input}/> 
                </label>
                <br/>

                <label className={regStyle.label}>
                  Last Name&nbsp;
                  <input type="text" placeholder="Enter Last Name" className={regStyle.input}/> 
                </label>
                <br/>

                <label className={regStyle.label}>
                  Username&nbsp;
                  <input type="text" onChange={this.usernameHandler} placeholder="Enter Username" className={regStyle.input}/> 
                </label>
                {this.state.ufail ? (
                  <text className={regStyle.formTextW} style={{padding:0}}>Username is a required field</text>
                ): ""}
                <br/>

                <label className={regStyle.label}>
                  Email Address&nbsp;
                  <input type="email" onChange={this.emailHandler} placeholder="Enter Email Address" className={regStyle.input}/> 
                </label>
                {this.state.efail ? (
                  <text style={{padding:0}} className={regStyle.formTextW}>Email is a required field</text>
                ): <></>}
                {this.state.bade ? (<text style={{padding:0}} className={regStyle.formTextW} >Please enter a valid email</text>):<></>}
                <br/>

                <label className={regStyle.label}>
                  Password&nbsp;
                  <input type="password" onChange={this.passwordHandler} placeholder="Password" className={regStyle.input}/> 
                </label>
                {this.state.pfail ? (
                  <text style={{padding:0}} className={regStyle.formTextW}>Password is a required field</text>
                ): <> </>}  
                  

                 <button onClick={this.signup} className={regStyle.button}>Sign Up!</button>

                <Link to='/'>
                  <button className={regStyle.button}>Already have an account?</button>
                </Link>
                  
              </div>
            </form>
              
          </div>
            
          <div className={regStyle.box}>
            <div className={regStyle.rightBox}></div>
          </div>      
        </div>
        
    );
  }
}