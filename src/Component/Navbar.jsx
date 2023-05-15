import React from "react";
import "../css/Navbar.module.css";
import generic from "../assets/GenericProfilePicture.jpg";
// import "../css/App.css";

import {
   Link
} from 'react-router-dom';
// pull in the images for the menu items
import treeIcon from "../assets/icon2.png";
import exitIcon from "../assets/exit.png";

/* The Navbar class provides navigation through react router links.  Note the callback
   to the parent app class in the last entry... this is an example of calling a function
   passed in via props from a parent component */
class Navbar extends React.Component {

  constructor(){
    super();

    this.state = {
        showNavbar: false,
    }
    this.showNavbar = this.showNavbar.bind(this);
}

showNavbar(event) {
    event.preventDefault();

    this.setState({
        showNavbar: true,
    })
}
componentDidMount() {
  this.getImage()
}

getImage() {
    
  fetch(process.env.REACT_APP_API_PATH+"/file-uploads?uploaderID=" + this.props.uploaderID + "&attributes={\"path\" : \"type\", \"equals\" : \"profileImage\"}" ,{
    method: "get",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+sessionStorage.getItem("token")
    },
    //Profile image fetch ends here
  }).then(result => result.json())
  .then(result => {
    if(result[0].length > 0){
      this.setState({avatar: "https://webdev.cse.buffalo.edu" + result[0][0].path});
    }else{
      this.setState({avatar : generic});
    }
  }
  )
}

render () {
    return (
      <div className="Navbar">
      <ul>
        <li className="treeIcon">
          <Link to="/posts">
            <img src={treeIcon} alt="Posts" />
          </Link>
        </li>
        <li>
          <input type="text" placeholder="Search Tags..." />
        </li>
        <li className="profilepic">
          <Link to="/profile">
          <img src = {this.props.avatar} alt="profile picture"/>
          </Link>
        </li>
        <li className="settingsPage">
          <Link to="/settings">
            Settings
          </Link>
        </li>
        <li className="friendsPage">
          <Link to="/friends">
            Friends
          </Link>
        </li>
        <li className="groupsPage">
          <Link to="groups">
            Groups
          </Link>
        </li>
        <li className="logoutButton">
          <button 
          onClick={e => this.props.logout(e)}>
            Logout
          </button>
        </li>
      </ul>
      </div>
    )
}

}
export default Navbar;
