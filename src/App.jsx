/*
  App.js is the starting point for the application.   All of the components in your app should have this file as the root.
  This is the level that will handle the routing of requests, and also the one that will manage communication between
  sibling components at a lower level.  It holds the basic structural components of navigation, content, and a modal dialog.
*/
import genericAvatar from "./assets/GenericProfilePicture.jpg"
import React, {useState} from "react";
import "./css/App.css";
import FriendProfile from "./Component/FriendProfile.jsx";
import PostForm from "./Component/PostForm.jsx";
import FriendList from "./Component/FriendList.jsx";
import GroupList from "./Component/GroupList.jsx";
import LoginForm from "./Component/LoginForm.jsx";
import Settings from "./Component/Settings.jsx";
import ProfilePage from "./Component/ProfilePage.jsx"
import FriendForm from "./Component/FriendForm.jsx";
import Modal from "./Component/Modal.jsx";
import Navbar from "./Component/Navbar.jsx";
import NewNavBar from "./Component/NewNavBar.jsx";
// import ProfileUpload from "./Component/ProfileImage.jsx";
import Style from "./Component/styleGuide.jsx";
import ConfirmationPage from "./Component/confirmationPage.jsx";
import Register from "./Component/Registration.jsx";
import ForgotPassword from "./Component/ForgotPassword.jsx";
import ForgotPasswordAuth from "./Component/ForgotPasswordAuth.jsx";
import Abc from "./Component/abc.jsx";

import {
  BrowserRouter as Router, Route, Routes
} from 'react-router-dom';
import Post from "./Component/Post";

// toggleModal will both show and hide the modal dialog, depending on current state.  Note that the
// contents of the modal dialog are set separately before calling toggle - this is just responsible
// for showing and hiding the component
function toggleModal(app) {
  app.setState({
    openModal: !app.state.openModal
  });
}

  //Lifting function to grab the results of loading an image from file so it can be rendered in the navbar


// the App class defines the main rendering method and state information for the app
class App extends React.Component {

  // the app holds a few state items : whether or not the modal dialog is open, whether or not we need to refresh 
  // the post list, and whether or not the login or logout actions have been triggered, which will change what the 
  // user can see (many features are only available when you are logged in)
  constructor(props) {
    super(props);
    this.state = {
      profileImage: "",
      openModal: false,
      refreshPosts: false,
      logout: false,
      login: false,
      sendImage : "",
      showNavBar: false,
      avatar: sessionStorage.getItem("profilePicture"),
      sessionStorage: ""
      
    };

  
    // in the event we need a handle back to the parent from a child component,
    // we can create a reference to this and pass it down.
    this.mainContent = React.createRef();

      // since we are passing the following methods to a child component, we need to 
    // bind them, otherwise the value of "this" will mean the child, and not the app
    this.doRefreshPosts = this.doRefreshPosts.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.sendImage = this.sendImage.bind(this);
    
  }

  sendImage = (image) => {
    this.setState({avatar : image});
  }

showNavBar = () => {
  this.setState({
    showNavBar: true
  });
}
  

  logout = () =>{
    console.log("calling logout");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    this.setState({sendImage : ""});
    this.setState({
      logout: true,
      login: false,
      showNavBar: false
    });
    
  }
  
  login = () => {
    console.log("CALLING LOGIN IN APP");
    
    this.setState({
      login: true,
      logout: false,
      refreshPosts:true,
      showNavBar: true
    });  
  }


  // doRefreshPosts is called after the user logs in, to display relevant posts.
  // there are probably more elegant ways to solve this problem, but this is... a way
  doRefreshPosts = () => {
    console.log("CALLING DOREFRESHPOSTS IN APP");
    this.setState({
      refreshPosts:true
    });
  }

  // This doesn't really do anything, but I included it as a placeholder, as you are likely to
  // want to do something when the app loads.  You can define listeners here, set state, load data, etc.
  componentDidMount(){
    window.addEventListener('click', e => {console.log("TESTING EVENT LISTENER")});
  }


  // As with all react files, render is in charge of determining what shows up on the screen, 
  // and it gets called whenever an element in the state changes.  There are three main areas of the app, 
  // the navbar, the main content area, and a modal dialog that you can use for ... you know, modal
  // stuff.  It's declared at this level so that it can overlay the entire screen.
  render() {
    console.log("AVATAR IS: "+ this.state.avatar);
    return (

      // the app is wrapped in a router component, that will render the
      // appropriate content based on the URL path.  Since this is a
      // single page app, it allows some degree of direct linking via the URL
      // rather than by parameters.  Note that the "empty" route "/", which has
      // the same effect as /posts, needs to go last, because it uses regular
      // expressions, and would otherwise capture all the routes.  Ask me how I
      // know this.

      //Pass something to the NewNavBar to 
      <Router basename={process.env.PUBLIC_URL}>
      <div className="App">

          <Navigation  avatar={this.state.avatar} logout={this.logout}/>
          <div className="maincontent" id="mainContent">

        

          {/* <NewNavBar toggleModal={e => toggleModal(this, e)} logout={this.logout} display={this.state.showNavBar}/> */}
            
            <Routes>
              <Route path="/settings" element={<SettingsPage login={this.login} sendImage = {this.sendImage} logout = {this.logout}/>} />
              <Route path="/style" element={<Styles sendImage={this.sendImage}/>}/>
              <Route path="/friends" element={<Friends  friendUpdate = {this.state.friendUpdate} friendFormChange = {this.friendFormChange} sendImage = {this.sendImage} login={this.login} />} />   
              <Route path="/groups" element={<Groups  sendImage = {this.sendImage} login={this.login} />} />     
              <Route path="/posts" element={<Posts avatar = {this.state.avatar} sendImage = {this.sendImage} doRefreshPosts={this.doRefreshPosts} login={this.login} apprefresh={this.state.refreshPosts} />} />
              <Route path="/abc" element={<Abc login={this.login}/>}/>
              <Route path="/confirmationPage" element={<ConfirmationPage sendImage = {this.sendImage} login={this.login} apprefresh={this.state.refreshPosts} />} />
              <Route path="/register" element={<Register login={this.login} apprefresh={this.state.refreshPosts} />} />
              <Route path="/forgotpassword" element={<ForgotPassword login={this.login} apprefresh={this.state.refreshPosts} />} />
              <Route path="/forgotpasswordauth" element={<ForgotPasswordAuth login={this.login} apprefresh={this.state.refreshPosts} /> } />
              <Route path="/profile" element={<ProfileWebpage login={this.login} apprefresh={this.state.refreshPosts} />} />
              <Route path="/friend" element={<Friend login={this.login} friendid={sessionStorage.getItem("friendpageid")}  />} />

              <Route path="/" element={<Posts sendImage = {this.sendImage} doRefreshPosts={this.doRefreshPosts} login={this.login} apprefresh={this.state.refreshPosts} />} />

            </Routes>
          </div>
      
        <Modal show={this.state.openModal} onClose={e => toggleModal(this, e)}>
          This is a modal dialog!
        </Modal>

        
      </div>
      </Router>
    );
  }
}

/*  BEGIN ROUTE ELEMENT DEFINITIONS */
// with the latest version of react router, you need to define the contents of the route as an element.  The following define functional components
// that will appear in the routes.  

const SettingsPage = (props) => {
   // if the user is not logged in, show the login form.  Otherwise, show the settings page
   if (!sessionStorage.getItem("token")){
    console.log("LOGGED OUT");
    return(
      <div>
      <LoginForm login={props.login} sendImage = {props.sendImage}/>
      </div>
    );
  }
  return (
    <div className="settings">
    <Settings sendImage={props.sendImage} userid={sessionStorage.getItem("user")} logout={props.logout}/>
    
  </div>
  );
}

const Styles = (props) => {
  // if the user is not logged in, show the login form.  Otherwise, show the friends page
  return (
   <div>
       <Style userid={sessionStorage.getItem("user")} />
   </div>
  );
}

const Friends = (props) => {
   // if the user is not logged in, show the login form.  Otherwise, show the friends page
   if (!sessionStorage.getItem("token")){
    console.log("LOGGED OUT");
    return(
      <div>
      <p>CSE 370 Social Media Test Harness</p>
      <LoginForm login={props.login} sendImage = {props.sendImage} />
      </div>
    );
  }
   return (
    <div>
      <h3>Friends</h3>

        <FriendForm  userid={sessionStorage.getItem("user")}  />
    </div>
   );
}

const Groups = (props) => {
  // if the user is not logged in, show the login form.  Otherwise, show the groups form
  if (!sessionStorage.getItem("token")){ 
   console.log("LOGGED OUT");
   return(
     <div>
     <LoginForm login={props.login} sendImage = {props.sendImage} />
     </div>
   );
 }
  return (
   <div>
       <GroupList userid={sessionStorage.getItem("user")} />
   </div>
  );
}

const Posts = (props) => {
  console.log("RENDERING POSTS");
  console.log(typeof(props.doRefreshPosts));
  

  console.log ("TEST COMPLETE");

  // if the user is not logged in, show the login form.  Otherwise, show the post form
  if (!sessionStorage.getItem("token")){
    console.log("LOGGED OUT");
    return(

      <div>
      <LoginForm login={props.login} sendImage = {props.sendImage}  />
      </div>

    );
  }else{
    console.log("LOGGED IN");
    return (
      <div>

      <PostForm avatar={props.avatar} refresh={props.apprefresh}/>
    </div>
    );
  }
}

const Navigation = (props) => {
  if (!sessionStorage.getItem("token")){
    return null;
  }else{
    return(
      <Navbar avatar={props.avatar} logout={props.logout} ></Navbar>

    )
  }
}
 
 const ProfileWebpage = (props) => {
   // if the user is not logged in, show the login form.  Otherwise, show the profile page
   if (!sessionStorage.getItem("token")){
    console.log("LOGGED OUT");
    return(
      <div>
      <LoginForm login={props.login}  />
      </div>
    );
  }
   return (
    
       <ProfilePage userid={sessionStorage.getItem("user")} />
    
   );
 }

 const Friend = (props) => {
  // if the user is not logged in, show the login form.  Otherwise, show the profile page
  if (!sessionStorage.getItem("token")){
   console.log("LOGGED OUT");
   return(
     <div>
     <LoginForm login={props.login}  />
     </div>
   );
 }
  return (
   <div>
      <FriendProfile userid={props.friendid} />
   </div>
  );
}
/* END ROUTE ELEMENT DEFINITIONS */

// export the app for use in index.js
export default App;