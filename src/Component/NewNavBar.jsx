// This file will contain the newNavBar information

import React from "react";
// import "../css/App.css";
import "../css/AltNav.module.css";
// import LoginStyle from "../css/Login.module.css"

import {
  ProSidebar,
  Menu,
  MenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
} from "react-pro-sidebar";


import {FaHome} from 'react-icons/fa';
import { AiFillSetting } from "react-icons/ai";

import {
    Link
 } from 'react-router-dom';

import postIcon from "../assets/post.svg";
import friendIcon from "../assets/friends.svg";
import settingIcon from "../assets/settings.svg";
import helpIcon from "../assets/help.svg";
import exitIcon from "../assets/exit.png";
import groupIcon from "../assets/group.png";



/* The Navbar class provides navigation through react router links.  Note the callback
   to the parent app class in the last entry... this is an example of calling a function
   passed in via props from a parent component */
class Navbar extends React.Component {
    //<h1 className={style.Treehouse}>TreeHouse</h1>
    constructor(props){
      super(props);
      
    }
    
  render() {
    if(!this.props.display){
      return ""
    }
    return (
        <ProSidebar>
          <SidebarContent>
            <Link to="/posts">
            <Menu>
              <MenuItem 
              icon={<FaHome />}
              >
                Home
              </MenuItem>
            </Menu>
            </Link>
            <Link to="/friends">
            <Menu>
              <MenuItem
              icon={<friendIcon />}
              >
                Friends
              </MenuItem>
            </Menu>
            </Link>
            
            <Link to="/groups">
            <Menu>
              <MenuItem
              icon={<groupIcon />}
              >
              Groups
              </MenuItem>
            </Menu>
            </Link>
          
            
          </SidebarContent>
        </ProSidebar>
  );
  }

}
export default Navbar;