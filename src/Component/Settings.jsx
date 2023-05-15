import React, { useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import {
  Link
} from 'react-router-dom';
//import 'react-tabs/style/react-tabs.css'
import "../css/settings.css";
import fpStyle from "../css/ForgotPass.module.css";
import { AiOutlineLogout } from "react-icons/ai";

// The Profile component shows data from the user table.  This is set up fairly generically to allow for you to customize
// user data by adding it to the attributes for each user, which is just a set of name value pairs that you can add things to
// in order to support your group specific functionality.  In this example, we store basic profile information for the user

// actually SETTINGS PAGE
export default class Settings extends React.Component {
  
  // The constructor will hold the default values for the state.  This is also where any props that are passed
  // in when the component is instantiated will be read and managed.  
  constructor(props) {
    super(props);
    this.state = {
      error: false,  
      inputfile: null,
      fileName: sessionStorage.getItem("profilePicture"),
      isSelected: false,
      sessiontoken: "",
      username: "",
      firstname: "",
      lastname: "",
      bio: "",
      responseMessage: "",
      email: "",
      coverPicture: sessionStorage.getItem("coverPicture"),
      emailChanged: "email changed!",
      usernameChanged: "username changed!",
      delete: "",

      dfail: false,
      // NOTE : if you wanted to add another user attribute to the profile, you would add a corresponding state element here
    };
    this.fieldChangeHandler.bind(this);
  }


  // This is the function that will get called every time we change one of the fields tied to the user data source.
  // it keeps the state current so that when we submit the form, we can pull the value to update from the state.  Note that
  // we manage multiple fields with one function and no conditional logic, because we are passing in the name of the state
  // object as an argument to this method.  
  fieldChangeHandler(field, e) {
    console.log("field change");
    this.setState({
      [field]: e.target.value
    });
  }

  
  // This is the function that will get called the first time that the component gets rendered.  This is where we load the current
  // values from the database via the API, and put them in the state so that they can be rendered to the screen.  
  componentDidMount() {
    console.log("In Settings");
    console.log(this.props);

    // fetch the user data, and extract out the attributes to load and display
    fetch(process.env.REACT_APP_API_PATH+"/users/"+sessionStorage.getItem("user"), {
      method: "get",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+sessionStorage.getItem("token")
      }
    })
      .then(res => res.json())
      .then(
        result => {
          if (result) {
            console.log(result);
            if (result.attributes){
            this.setState({
              // IMPORTANT!  You need to guard against any of these values being null.  If they are, it will
              // try and make the form component uncontrolled, which plays havoc with react
              username: result.attributes.username || "",
              firstname: result.attributes.firstName || "",
              lastname: result.attributes.lastName || "",
              bio: result.attributes.bio || ""

            });
          }
          }
        },
        // error => {
        //   alert("error!");
        // }
      );


  }

  handleImage = event => {   
    const input = event.target.files[0];
    if ((input.type).includes("image/") ){
        this.setState({error:false});
        this.setState({inputfile : input, isSelected:true});
    } else{
        this.setState({inputfile : null, isSelected:false});
        this.setState({error:true});
    }




}
//Uploading/updating profile picture
handleImageSubmission = event => {
    event.preventDefault();
    this.setState({isSelected:false});
    

    //The if statement handles uploading a profile picture if none exists, while the else statement handles updating the current one
        if(sessionStorage.getItem("profileID")!= null){
          let data = new FormData();
        data.append("uploaderID", sessionStorage.getItem("user"));
        data.append("attributes", JSON.stringify({"type" : "profileImage"}));
        data.append("file", this.state.inputfile);
        fetch(process.env.REACT_APP_API_PATH+"/file-uploads/"+(sessionStorage.getItem("profileID")), {
            method: "PATCH",
            headers: {
                    'Authorization': 'Bearer '+sessionStorage.getItem("token")
                  },
            body: data
        }).then(response => response.json())
            .then(
                result => {
                    if (result.path) {
                        sessionStorage.setItem("profilePicture", "https://webdev.cse.buffalo.edu" + result.path);
                        this.setState({fileName : "https://webdev.cse.buffalo.edu" + result.path}) 
                        this.props.sendImage(sessionStorage.getItem("profilePicture"))
                        
                    }
                }
            )
        }else{
          let data = new FormData();
        data.append("uploaderID", sessionStorage.getItem("user"));
        data.append("attributes", JSON.stringify({"type" : "profileImage"}));
        data.append("file", this.state.inputfile);
        
        fetch(process.env.REACT_APP_API_PATH+"/file-uploads", {
                    method: "POST",
                    headers: {
                        'Authorization': 'Bearer '+sessionStorage.getItem("token")
                      },
                    body: data
                }).then(res => res.json())
                    .then(
                        result => {
                            if (result.path) {
                                sessionStorage.setItem("profilePicture", "https://webdev.cse.buffalo.edu" + result.path);
                                sessionStorage.setItem("profileID", result.id);
                                this.setState({fileName : "https://webdev.cse.buffalo.edu" + result.path}) 
                                this.props.sendImage(sessionStorage.getItem("profilePicture"));
                            }
                        }

                    )
        }
        
} 

//Uploading/updating cover picture
handleCoverImageSubmission = event => {
  event.preventDefault();
  this.setState({isSelected:false});
  
  //The if statement handles uploading a profile picture if none exists, while the else statement handles updating the current one
      if(sessionStorage.getItem("coverid")!=null){
        let data = new FormData();
        data.append("uploaderID", sessionStorage.getItem("user"));
        data.append("attributes", JSON.stringify({"type" : "coverImage"}));
        data.append("file", this.state.inputfile);
        fetch(process.env.REACT_APP_API_PATH+"/file-uploads/"+(sessionStorage.getItem("coverid")), {
            method: "PATCH",
            headers: {
                    'Authorization': 'Bearer '+sessionStorage.getItem("token")
                  },
            body: data
        }).then(response => response.json())
            .then(
                result => {
                    if (result.path) {
                        sessionStorage.setItem("coverPicture", "https://webdev.cse.buffalo.edu" + result.path);
                        sessionStorage.setItem("coverid", result.id);
                        this.setState({
                          coverPicture: "https://webdev.cse.buffalo.edu" + result.path
                        });
  
                        
                    }
                }
            )

      }else{
      let data = new FormData();
      data.append("uploaderID", sessionStorage.getItem("user"));
      data.append("attributes", JSON.stringify({"type" : "coverImage"}));
      data.append("file", this.state.inputfile);
      
      fetch(process.env.REACT_APP_API_PATH+"/file-uploads", {
                  method: "POST",
                  headers: {
                      'Authorization': 'Bearer '+sessionStorage.getItem("token")
                    },
                  body: data
              }).then(res => res.json())
                  .then(
                      result => {
                          if (result.path) {
                              sessionStorage.setItem("coverPicture", "https://webdev.cse.buffalo.edu" + result.path);
                              sessionStorage.setItem("coverid", result.id);
                              this.setState({

                                coverPicture:"https://webdev.cse.buffalo.edu" + result.path
                              })


                          }
                      }

                  )}
      

} 



  // This is the function that will get called when the submit button is clicked, and it stores
  // the current values to the database via the api calls to the user and user_preferences endpoints
  submitHandler = event => {
    
    //keep the form from actually submitting, since we are handling the action ourselves via
    //the fetch calls to the API
    event.preventDefault();

    //make the api call to the user controller, and update the user fields (username, firstname, lastname)
    fetch(process.env.REACT_APP_API_PATH+"/users/"+sessionStorage.getItem("user"), {
      method: "PATCH",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+sessionStorage.getItem("token")
      },
      body: JSON.stringify({
        attributes: {
          username: this.state.username,
          firstName: this.state.firstname,
          lastName: this.state.lastname,
          bio: this.state.favoritecolor
        }
      })
    })
      .then(res => res.json())
      .then(
        result => {
          this.setState({
            responseMessage: result.Status
            
          });
          
        },

        // error => {
        //   alert("error!");
        // }
      );
      var url = window.location.href;
    var lastSlash = url.lastIndexOf('/');
    url = (url.substring(0,lastSlash+1));
    window.location.assign(url+ "profile");
  };

  changeemailHandler = event => {
    event.preventDefault();


      fetch(process.env.REACT_APP_API_PATH+"/users/"+sessionStorage.getItem("user"), {
        method: "PATCH",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+sessionStorage.getItem("token")
        },
        body: JSON.stringify({
          email: this.state.email
        })
      })
      .then(res => res.json())
      .then(
        result => {
          alert("Your email has changed!")
        },
        // error => {
        //   alert("error");
        // }
      )
      

  };

  //changeemailSubmissionHandler = event => {
  //  event.preventDefault();
  //}

  changeEmailHandler = event => {
    event.preventDefault();

    fetch(process.env.REACT_APP_API_PATH+"/users/"+sessionStorage.getItem("user"), {
      method: "PATCH",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+sessionStorage.getItem("token")
      },
      body: JSON.stringify({
       email: this.state.email
      })
    })
    .then(res => res.json())
    .then(
      result => {
        alert("your email has changed!")
      },
      // error => {
      //   alert("error");
      // }
    )

  };



  deleteTextHandler = (event) => {
    this.setState({dfail: false});
    this.setState({delete: event.target.value});
  }


  deleteHandler = (event) => {
    event.preventDefault();
    //checking for empty inputs

    if(this.state.delete == "delete"){
      this.setState({dfail:true});
    }


      //Checking if all fields are filled in
      if(this.state.dfail == true){
        //do nothing and render any possible error messages
        console.log("entering deletion api call");
        console.log("delete's state is : " + this.state.delete);
        console.log("dfail's state is : " + this.state.dfail);
        console.log("user token is : " + sessionStorage.getItem("token"));
        console.log("user ID is : " + sessionStorage.getItem("user"));
        
      
        //API call
        fetch(process.env.REACT_APP_API_PATH+"/users/" + sessionStorage.getItem("user") + "?relatedObjectsAction=delete", {
          method:"DELETE",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+sessionStorage.getItem("token")
          },
          
        })
        .then(   
          result => {
          
              console.log("delete api call done LOG OUT should execute");
              this.props.logout();
              
              
            }
          
        )

      }
  }

  // This is the function that draws the component to the screen.  It will get called every time the
  // state changes, automatically.  This is why you see the username and firstname change on the screen
  // as you type them.

  render() {

    return (
        <div className="container">
    
          <Tabs defaultFocus={true} onSelect={index => console.log(index)}>
            <TabList>
              <Tab label="Profile">Profile Settings</Tab>
              <Tab label="Notification">Notification Settings</Tab>
              <Tab label="Security">Security Settings</Tab>
            </TabList>
    
            <TabPanel>
              <div className="tab-content">
              <div className= {'profileImageBox'}>
                <form onSubmit={this.handleImageSubmission} className= {'ppform'}>
                <br></br>

                <img style={{width: 100, height: 100}} alt="Current profile picture" src = {sessionStorage.getItem("profilePicture")} className={'image'} />
                    <input type="file" onChange={this.handleImage} />
                    
                    {this.state.isSelected ? (
                        
                        <input type="submit" value = "Submit" className = {'button'} />
                    ): <p></p>
                    
                    
                    }
                    {this.state.error ? (
                        <p>Please select an image file</p>
                    ): <p></p>}

                    

                </form>
                <br></br>
            
         </div> 

         <div className= {'profileImageBox2'}>
         <br></br>
                <label> Update Cover Image</label>
          <br></br>
                <form onSubmit={this.handleCoverImageSubmission} className= {'ppform2'}>
                <img style={{width: 100, height: 100}} alt="Current cover image" src = {this.state.coverPicture} className={'image'} />
                    <input type="file" onChange={this.handleImage} />
                    
                    {this.state.isSelected ? (
                        
                        <input type="submit" value = "Submit" className = {'button'} />
                    ): <p></p>
                    
                    
                    }
                    {this.state.error ? (
                        <p>Please select an image file</p>
                    ): <p></p>}

                </form>
         </div>

              <form onSubmit={this.submitHandler} className="profileform">
              <br></br>
              <br></br>
                <label>
                Username
                <input
                    type="text"
                    onChange={e => this.fieldChangeHandler("username", e)}
                    value={this.state.username}
                />
                </label>
                <label>
                First Name
                <input
                    type="text"
                    onChange={e => this.fieldChangeHandler("firstname", e)}
                    value={this.state.firstname}
                />
                </label>
                <label>
                Last Name
                <input
                    type="text"
                    onChange={e => this.fieldChangeHandler("lastname", e)}
                    value={this.state.lastname}
                />
                </label>
                <label>
                Input Biography
                <input
                    type="text"
                    onChange={e => this.fieldChangeHandler("bio", e)}
                    value={this.state.bio}
                />
                </label>
                <input type="submit" onClick={this.submitHandler} value="Update" />
                </form>  
   
                
              </div>
            </TabPanel>
            <TabPanel>
              <div className="tab-content">
                <h2>Content 2</h2>
                <p>Max Notifications</p>
              </div>
            </TabPanel>
            <TabPanel>
              <div className="tab-content">
                {/* <form onSubmit={this.changeEmailHandler} className="securityform">
                <label>
                Email
                <input
                    type="text"
                    onChange={e => this.fieldChangeHandler("username", e)}
                    value={this.state.username}
                />
                <input type="submit" value = "Submit" className = {'button'}/>
                </label>
                </form>
              <form onSubmit={this.changeemailHandler} className="securityform">
                
                <label>
                email
                <input
                    type="text"
                    onChange={e => this.fieldChangeHandler("email", e)}
                    value={this.state.email}
                />
                <input type="submit" value = "Submit" className = {'button'}/>
                </label>
                
                </form> */}

              <form>
              <label className={fpStyle.label2}>
                  Enter in the word "delete" to confirm!&nbsp;
                  <input type="delete" onChange={this.deleteTextHandler} placeholder="Enter delete" className={fpStyle.input}/>
              </label>
                {this.state.dfail ? (
                  <p className={fpStyle.error}>Try entering "delete"</p>
                ): <></>}
                {this.state.bade ? (<p className={fpStyle.error} >Try entering "delete"</p>):<></>}
                <br/>
              </form>
              
              <button onClick={this.deleteHandler} className={'DeleteButton'}>Delete Account</button>

              </div>
            </TabPanel>
          </Tabs>
    
        </div> 
      )
  }
}