import React from "react";

import {
  Link
} from 'react-router-dom';

import "../css/App.css";
import loginStyle from "../css/Login.module.css";
import navbarStyle from "../css/Navbar.module.css";
import NewNavBar from "./NewNavBar.jsx";
import generic from "../assets/GenericProfilePicture.jpg"
import genericcover from "../assets/GenericCoverImage.jpeg"

// the login form will display if there is no session token stored.  This will display
// the login form, and call the API to authenticate the user and store the token in
// the session.

export default class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error:false,
      username: "",
      password: "",
      alanmessage: "",
      sessiontoken: ""
    };
    this.refreshPostsFromLogin = this.refreshPostsFromLogin.bind(this);
  }

  // once a user has successfully logged in, we want to refresh the post
  // listing that is displayed.  To do that, we'll call the callback passed in
  // from the parent.
  refreshPostsFromLogin(){
    console.log("CALLING LOGIN IN LOGINFORM");
    this.props.login();
  }

  // change handlers keep the state current with the values as you type them, so
  // the submit handler can read from the state to hit the API layer
  myChangeHandler = event => {
    this.setState({
      error:false,
      username: event.target.value
    });
  };

  passwordChangeHandler = event => {
    this.setState({
      error:false,
      password: event.target.value
    });
  };

  // when the user hits submit, process the login through the API
  submitHandler = event => {
    //keep the form from actually submitting
    event.preventDefault();
    if(this.state.username=="" || this.state.email=="" ){
      this.setState({error:true});
      return;
    }
    //make the api call to the authentication page
    fetch(process.env.REACT_APP_API_PATH+"/auth/login", {
      method: "post",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: this.state.username,
        password: this.state.password
      })
      //Login fetch ends here
    })
      .then(res => res.json())
      .then(
        result => {
          console.log("Testing");
          if (result.userID) {

            // set the auth token and user ID in the session state
            sessionStorage.setItem("token", result.token);
            sessionStorage.setItem("user", result.userID);        
             //Loading Profile Image
             fetch(process.env.REACT_APP_API_PATH+"/file-uploads?uploaderID=" + result.userID + "&attributes={\"path\" : \"type\", \"equals\" : \"profileImage\"}" ,{
              method: "get",
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+sessionStorage.getItem("token")
              },
              //Profile image fetch ends here
            }).then(result => result.json())
              .then(
                result => {
                  if(result[0].length > 0){
                    sessionStorage.setItem("profilePicture", "https://webdev.cse.buffalo.edu" + result[0][0].path);
                    sessionStorage.setItem("profileID", result[0][0].id);
                    this.props.sendImage(sessionStorage.getItem("profilePicture"));

                  }else{
                    sessionStorage.setItem("profilePicture", generic);
                    this.props.sendImage(sessionStorage.getItem("profilePicture"));
                    
                  }
                }

                //Assigning profile image ends here
              )

              fetch(process.env.REACT_APP_API_PATH+"/file-uploads?uploaderID=" + result.userID + "&attributes={\"path\" : \"type\", \"equals\" : \"coverImage\"}" ,{
                method: "get",
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer '+sessionStorage.getItem("token")
                },
                //Profile image fetch ends here
              }).then(result => result.json())
                .then(
                  result => {
                    if(result[0].length > 0){
                      sessionStorage.setItem("coverPicture", "https://webdev.cse.buffalo.edu" + result[0][0].path);
                      sessionStorage.setItem("coverid", result[0][0].id);

  
                    }else{
                      sessionStorage.setItem("coverPicture", genericcover);

                      
                    }
                  }
  
                  //Assigning profile image ends here
                )




              
            this.setState({ 
              sessiontoken: result.token,
              alanmessage: result.token
            });

            // call refresh on the posting list
            this.refreshPostsFromLogin();
          } else {

            // if the login failed, remove any infomation from the session state
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("user");
            this.setState({
              sessiontoken: "",
              alanmessage: result.message
            });
          }
        },
        error => {
          this.setState({
            error:true
            
          }
          );
          return;
        }
        // error => {
        //   alert("error!");
        // }
      );
      
  };

  render() {
    // console.log("Rendering login, token is " + sessionStorage.getItem("token"));

    if (!sessionStorage.getItem("token")) {
      return (

        <React.Fragment>
          <div className={loginStyle.container}>
            <div className={loginStyle.box}>
              <NewNavBar></NewNavBar>
            </div>
            
            
            <div class={loginStyle.box}>
              <form onSubmit={this.submitHandler} class={loginStyle.form}>
                <div className={loginStyle.box}>
                <label className={loginStyle.label}>
                  Email
                  <input type="text" onChange={this.myChangeHandler} class={loginStyle.formField} className={loginStyle.input}/>
                </label>
                </div>
                <br/>

                <div className={loginStyle.box}>
                <label className={loginStyle.label}>
                  Password&nbsp;
                  <input type="password" onChange={this.passwordChangeHandler} class={loginStyle.formField} className={loginStyle.input} />
                </label>
                </div>

                
                <div className={loginStyle.box}>
                <input type="submit" value="login" class={loginStyle.button}/>
                
                </div>
      


              <Link to="/register">
              <input type="submit" value="register" class={loginStyle.button}/>
              </Link>

              <Link to="/forgotpassword">
              <input type="submit" value="forgot password" class={loginStyle.button}/>
              </Link>

              {sessionStorage.getItem("regSuc") ? (
                  <label style={{fontSize:20, position:"relative", left:90}}>Registration Succesful!</label>
                ): <span></span>}
                {this.state.error ? (
                  <label style={{fontSize:20, position:"relative", left:90}}>Invalid login credentials!</label>
                ): <span></span>}
              </form>
              
              </div>


          
            
            <div className={loginStyle.box}>
              <div className={loginStyle.rightBox}></div>
            </div>

            
          </div>
        </React.Fragment>
      );
    } else {
      console.log("Returning welcome message");
      if (this.state.username) {
        return <p>Welcome, {this.state.username}</p>;
      } else {
        return <p>{this.state.alanmessage}</p>;
      }
    }
  }
}