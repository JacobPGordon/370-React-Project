import React from "react";
import "../css/App.css";
import Autocomplete from "./Autocomplete.jsx";
import blockIcon from "../assets/block_white_216x216.png";
import unblockIcon from "../assets/thumbsup.png";
import { Link, useNavigate } from "react-router-dom";

//CHECK THE WAY METHOD WORKS TO GET IT TO RENDER
export default class FriendForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      friendname: "",
      friendid: "",
      connectionid: "",
      responseMessage: "",
      users: [],
      blockedUsers: [],
      addError: false,
      removeError: false,
      errorID: "",
      adding: false,
      connections: [],
      selferror: false,
      outboundconnections: [],
      inboundconnections: [],
      blockError: false,
      blockedError: false,
      userid: props.userid,
      update: false,
      deleting: false
    
    };
    this.fieldChangeHandler.bind(this);
  }

  loadBlocks(){
    fetch(process.env.REACT_APP_API_PATH+"/connections?userID=" +sessionStorage.getItem("user") + "&attributes={\"path\": \"type\", \"equals\" : \"blocked\"}", {
     method: "get",
     headers: {
       'Content-Type': 'application/json',
       'Authorization': 'Bearer '+sessionStorage.getItem("token")
     }
    }).then(res => res.json())
    .then(result => {
     this.setState({blockedUsers:result[0]});        
    })
 }

   loadFriends() {
     console.log("connections loaded");
     fetch(process.env.REACT_APP_API_PATH+"/connections?anyUserID="+sessionStorage.getItem("user") +"&attributes={\"path\": \"type\", \"equals\" : \"friend\"}", {
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
            console.log(result[0]);
            this.setState({
              isLoaded: true,
              
              connections: result[0]
            });
          }
        },
        
      );

       fetch(process.env.REACT_APP_API_PATH+"/connections?fromUserID="+sessionStorage.getItem("user") +"&attributes={\"path\": \"type\", \"equals\" : \"friendrequest\"}", {
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
              this.setState({
                isLoaded: true,
                outboundconnections: result[0]
              });
              
            }
          },
          
        );

        fetch(process.env.REACT_APP_API_PATH+"/connections?toUserID="+sessionStorage.getItem("user") +"&attributes={\"path\": \"type\", \"equals\" : \"friendrequest\"}", {
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
                this.setState({
                  isLoaded: true,
                  inboundconnections: result[0]
                });
                
              }
            },
            
          );



  }

  updateConnection(id, status){
    //make the api call to the user controller
    fetch(process.env.REACT_APP_API_PATH+"/connections/"+id, {
      method: "PATCH",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+sessionStorage.getItem("token")
      },
      body: JSON.stringify({
        attributes: {status: status, type: "friend"}
      })
    })
      .then(res => res.json())
      .then(
        result => {
          this.setState({
            responseMessage: result.Status
          });
          this.loadFriends();
        },
        error => {
          alert("error!");
        }
      );
  }

  conditionalAction(status, id){
    if (status === "active"){
      return(

      <img
        src={blockIcon}
        className="sidenav-icon deleteIcon"
        alt="Block User"
        title="Block User"
        onClick={e => this.updateConnection(id, "blocked")}
      />
    )
    }else{
      return(
      <img
        src={unblockIcon}
        className="sidenav-icon deleteIcon"
        alt="Unblock User"
        title="Unblock User"
        onClick={e => this.updateConnection(id, "active")}
      />
    )
    }
  }

  fieldChangeHandler(field, e) {
    console.log("field change");
    this.setState({
      [field]: e.target.value
    });
  }

  selectAutocomplete(friendID) {
      this.setState({
        friendid:friendID
      })
      console.log("Set Friend ID to "+friendID)
  }

  componentDidMount() {
    this.loadFriends();
    this.loadBlocks();
    //make the api call to the user API to get the user with all of their attached preferences
    fetch(process.env.REACT_APP_API_PATH+"/users/", {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+sessionStorage.getItem("token")
      }

    })
      .then(res => res.json())
      .then(
        result => {
          if (result) {
            let names = [];

            result[0].forEach(element => {if (element.attributes.username){names.push(element)}});

            this.setState({
              users: names,
              responseMessage: result.Status
            });
            console.log(names);
          }
        },
        error => {
          alert("error!");
        }
      );
  }

  friendTab = connection => {

    
    if(connection.fromUserID==sessionStorage.getItem("user")){     
      return <Link to="/friend" onClick={this.updateStorage.bind(this,connection.toUser.id)}>{connection.toUser.attributes.username + "'s profile"}</Link>;
    }else{
      return <Link to="/friend" onClick={this.updateStorage.bind(this,connection.fromUser.id)}>{connection.fromUser.attributes.username+"'s profile"}</Link>;
    }
    
  }

  updateStorage = (id,event) => {
    event.preventDefault();
    console.log(id);
    sessionStorage.setItem("friendpageid",id);
    var url = window.location.href;
    var lastSlash = url.lastIndexOf('/');
    url = (url.substring(0,lastSlash+1) + "friend");
    window.location.assign(url);
    
    
  }

  addingHandler = event =>  {
    //Passes true to submitHandler so it attempts to add the friend
    event.preventDefault();
    this.setState({"adding" : true, addError:false, removeError:false, selferror:false, blockedError:false,blockError:false});
    this.submitHandler(true);
  }

  removingHandler = event => {
    //Passes false to submitHandler so it attempts to delete the friend
    event.preventDefault();
    this.setState({"deleting" : true, addError:false, removeError:false, selferror:false,blockedError:false,blockError:false});
    this.submitHandler(false);
  }

 

  //Unused function made during dev; handy for refrence -JG

  /* async checkforFriend() {
     await fetch(process.env.REACT_APP_API_PATH+"/connections?fromUserID="+sessionStorage.getItem("user")+"&toUserID="+this.state.friendid+"&attributes={\"path\": \"type\", \"equals\" : \"friend\"}", {
      method: "get",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+sessionStorage.getItem("token")
      }
     })
      .then(res => res.json())
      .then(
        result => {
            if (result[0].length == 0) {
              console.log("no friend detected");
              return false;
            }else{
              console.log("friend detected");
              this.setState({connectionid: result[0][0].id})
              console.log(result[0][0].id);
              return true
              
            }
          
        },
      );
  }
  */

   async submitHandler(input)  {
    //keep the form from actually submitting

    console.log("UserID of selected friend is ");
    console.log(this.state.friendid);
    if(this.state.friendid == sessionStorage.getItem("user")){
      this.setState({selferror:true});
      this.loadFriends();
      return;
    }
    var friend = false;
    var adderror = false;
    var request = false;
    var addconnectionid = null;
      await fetch(process.env.REACT_APP_API_PATH+"/connections?userID=" +sessionStorage.getItem("user") + "&attributes={\"path\": \"type\", \"equals\" : \"friend\"}", {
      method: "get",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+sessionStorage.getItem("token")
      }
     })
      .then(res => res.json())
      .then(
        result => {
            
            if (result[0].length == 0) {
              friend = false;
            }else{
              var arrayLength = result[0].length;
                for(var i=0; i < arrayLength; i++ ){
                  var user = sessionStorage.getItem("user");
                  if((result[0][i].fromUserID == user || result[0][i].toUserID == user) && result[0][i].attributes.type=="friend" ){
                    user = true;
                  }

                  if((result[0][i].fromUserID == this.state.friendid || result[0][i].toUserID == this.state.friendid) && user==true ){
                    this.setState({connectionid: result[0][i].id})
                    console.log(result[0][i].id);
                    friend = true;
                    request = false;
                    if(input==true){
                      this.setState({addError:true});
                      this.loadFriends();
                      return;
                    }
                  }
                }
              
            }
          
        },
      );

        console.log(friend);
      if(friend == false){
        console.log("FRIEND WORKED");
      await fetch(process.env.REACT_APP_API_PATH+"/connections?userID=" + sessionStorage.getItem("user") +"&attributes={\"path\": \"type\", \"equals\" : \"friendrequest\"}", {
        method: "get",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+sessionStorage.getItem("token")
        }
       })
        .then(res => res.json())
        .then(
          result => {
            friend = false;
            request = false;
              if (result[0].length == 0) {
                friend = false;
                request = false;
              }else{
                var arrayLength = result[0].length;
                console.log(arrayLength);
                for(var i=0; i < arrayLength; i++ ){
                  if(result[0][i].fromUserID == this.state.friendid || result[0][i].toUserID == this.state.friendid){
                    this.setState({connectionid: result[0][i].id})
                    console.log(result[0][i].id);
                    friend = true;
                    request = true;
                    addconnectionid=result[0][i].id;
                    if(result[0][i].fromUserID == sessionStorage.getItem("user")){
                      adderror = true ;
                    }
                  }
                }
                
              }
            
          },
        );}

        
        
    //make the api call to the user controller
    console.log(friend);
    console.log(request);
  if(input == true){
    //Checking if friend already exists
    
    //Adding friend API call
    
    if(friend == false && request==false){
      var length = this.state.blockedUsers.length;
      for(var i=0; i< length; i++){
        if(this.state.blockedUsers[i].fromUserID==this.state.friendid && this.state.blockedUsers[i].toUserID==sessionStorage.getItem("user")){
          this.setState({blockedError:true});
          return;
        }
      }

      for(var i=0; i< length; i++){
        if(this.state.blockedUsers[i].toUserID==this.state.friendid && this.state.blockedUsers[i].fromUserID==sessionStorage.getItem("user")){
          this.setState({blockError:true});
          return;
        }
      }


       await fetch(process.env.REACT_APP_API_PATH+"/connections", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+sessionStorage.getItem("token")
        },
        body: JSON.stringify({
          toUserID: this.state.friendid,
          fromUserID: sessionStorage.getItem("user"),
          attributes:{type:"friendrequest", status:"active"}
        })
      })
        .then(res => res.json())
        .then(
          result => {
            this.setState({
              responseMessage: result.Status
            });
          },
          error => {
            alert("error!");
          }
        );
      }else{  
          console.log(adderror);
          console.log(addconnectionid);
          if(addconnectionid != null){
            if(adderror == true){
              this.setState({addError:true})
              this.loadFriends();
              return;
            }
            
            await fetch(process.env.REACT_APP_API_PATH+"/connections/"+addconnectionid, {
            method: "PATCH",
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer '+sessionStorage.getItem("token")
            },
            body: JSON.stringify({
              attributes:{type:"friend", status:"active"}

            })
          })
          .then(res => res.json())
          .then(
            result => {
              console.log(result.attributes.type);
              this.loadFriends();
              return;
              
              
              
            },
          );
        }
      } 
    }
    console.log("input:" + input + "; friend: "+ friend);
    if(input == false){
      if(friend == true){
        //Friend deletion API call
         await fetch(process.env.REACT_APP_API_PATH+"/connections/"+this.state.connectionid, {
          method: "DELETE",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+sessionStorage.getItem("token")
          },
        })
      }else{
        this.setState({removeError:true});
        
      }
      
    }
    
    let output = false;
    this.setState({"adding" : output, "deleting" : output});
    this.loadFriends();
    


  };

  render() {
    //FIX DISPLAYING NAME PROPERLY AND LEADING TO RIGHT PAGE AS WELL AS PAGE LOADING
    const {connections, outboundconnections, inboundconnections} = this.state;
    return (
      <div style={{position: 'absolute', left:125,}}>
        <label style={{width:200}}>
          Add or delete a friend (or friend request). Type name below!
          <br />
          <div className="autocomplete">
            <Autocomplete suggestions={this.state.users} selectAutocomplete={e => this.selectAutocomplete(e)} />
          </div>
        </label>
        <input type="submit" style={{height:25, width:150}} value="Add as friend" onClick={this.addingHandler}/>
        {this.state.blockError ? (
          <p>Error: This person is on your block list!</p>
          ):<span></span> }
          {this.state.blockedError ? (
          <p>Error: You are blocked by this person!</p>
          ):<span></span> }
        {this.state.addError ? (
          <p>Error: Friend already exists or you are already sending them a request!</p>
          ):<span></span> }
          {this.state.selferror ? (
          <p>Error: You can't add yourself as a friend!</p>
          ):<span></span> }
        <input type="submit" style={{height:25, width:150, position:"relative",left:10}}value="Delete friend" onClick={this.removingHandler} />
        {this.state.removeError ? (
          <p>Error: This person isn't your friend or you weren't sending them a request!</p>
          ):<span></span> }
        {this.state.responseMessage}
        <div style={{position: 'absolute', left:650, top:-15, width:200} } className="post">
          <h4>Friend List</h4>
          <ul>
            {connections.map(connection => (
              <div key={connection.id} className="userlist">
                {console.log(connection)};
                <p>{this.friendTab(connection)}</p>
              </div>
            ))}
          </ul>
        </div>
        <div style={{position: 'absolute', width:200, height:200}}>
        <h4>Outbound friend requests</h4>
        <ul>
              {outboundconnections.map(connection => (
               <div key ={connection.id}><p> {connection.toUser.attributes.username} </p></div>

              )
              
              
              
              )}

        </ul>
      </div>
      
      <div style={{position: 'absolute', width:200, height:200, left:250}}>
        <h4>Inbound friend requests</h4>
        <ul>
              {inboundconnections.map(connection => (
               <div key ={connection.id}><p> {connection.fromUser.attributes.username} </p></div>

              )     
              )}

        </ul>
      </div>
      </div>
    );
  }
}
