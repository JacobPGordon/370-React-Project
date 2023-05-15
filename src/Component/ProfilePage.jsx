import React from "react";
import "../css/profilepage.css";
import "../css/App.css";
import PostingList from "./PostingList.jsx";
import helpIcon from "../assets/delete.png";
import "../css/posts.css";
import Autocomplete from "./Autocomplete.jsx";


export default class ProfilePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          username: "",
          firstname: "",
          lastname: "",
          chosenid: null,
          users: [],
          userid: props.userid,
          blockedUsers: [],
          posts: [],
          mygroups: [],
          adding:false,
          removing:false,
          addError: false,
          existError: false,
          removeError:false,
          selferror:false,
          avatar: "",
          friendsList: []
          // NOTE : if you wanted to add another user attribute to the profile, you would add a corresponding state element here
        };
        this.fieldChangeHandler.bind(this);
    }

    componentDidMount() {
      
      this.loadUsername();
      this.loadPosts();
      this.loadBlocks();
      this.setState({avatar:sessionStorage.getItem})

      //Fetching users
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
              });
            }
          },
          error => {
            alert("error!");
          }
        );
    }
    
    fieldChangeHandler(field, e) {
        console.log("field change");
        this.setState({
          [field]: e.target.value
        });
    }

    selectAutocomplete(chosenid) {
      this.setState({
        chosenid:chosenid
      })
  }

    loadPosts(){
      fetch(process.env.REACT_APP_API_PATH +"/posts?authorID="+sessionStorage.getItem("user"), {
        method: "get",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+sessionStorage.getItem("token")
        },
  
      }).then(res => res.json())
      .then(result => {
        this.setState({posts: result[0]});
      })
    }

    loadUsername() {
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
          if(result){
            this.setState({
              username: result.attributes.username
            });
          }
        },
        error => {
          this.setState({
            error
          });
        }
      );
      
    }

    showDelete(){
     
        return(
        <img
          src={helpIcon}
          className="sidenav-icon deleteIcon"
          alt="Delete Post"
          title="Delete Post"
          onClick={e => this.deletePost(this.props.post.id)}
        />
      );
      
     
    }

    renderPost(post){
      return (
      
      
        <div name="User post">
          
          <div
        
        key={post.id}
        className={["postlist", "postbody"].join(" ")}
        
      >
        
        <div className="deletePost">
        {post.author.attributes.username} ({post.created})

        
        </div>
        <p>{post.attributes.location}</p>
        <p>{post.tag}</p>
           <br />{" "}
          {post.content}

  
        </div>
        </div>
      );
    }


    addingHandler = event => {
      console.log("adding");
      event.preventDefault();
      this.setState({adding : true, removing:false, addError:false, removeError:false, selferror:false, existError:false});
      this.processBlock(true);
      this.loadBlocks();
    }

    removingHandler = event => {
      event.preventDefault();
      this.setState({removing : true, adding:false, addError:false, removeError:false, selferror:false, existError:false});
      this.processBlock(false);
      this.loadBlocks();
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

    

    async processBlock(adding){
      //First we do some checks to make sure everything is right
      if(this.state.chosenid != null){
        console.log("User selected");
        //Check for the userid in our user list
        const users = this.state.users;
        var length = users.length;
        var found=0;
        for(var i=0; i < length; i++){
          if(users[i].id == this.state.chosenid){
            if(users[i].id == sessionStorage.getItem("user")){
              this.setState({selferror:true});
              this.loadBlocks();
              return;
            }
            found++;
            break;
          }
        }
        //If the selected user isn't found, we trigger an error
        if(found==0){
          console.log("This should appear");
          this.setState({existError:true});
          return;
        }
        
        var blocked = this.state.blockedUsers;
        length = blocked.length;
        found = 0;
        for(var i=0; i < length; i++){
          if(blocked[i].toUser.id == this.state.chosenid){
            found++;
            break;
          }
        }
        
        //handling trying to add someone who's already in
        if(found==1 && adding==true){
          console.log("Error: User is already in your block list!")
          this.setState({addError:true,adding:false})
          this.loadBlocks();
          return;
        }
        console.log("User found");
        //Handling if you're attempting to delete someone who isn't on your blocked list
        if(found==0 && adding==false){
          console.log("Error: User isn't in your block list!");
          this.setState({removeError:true,removing:false});
          this.loadBlocks();
          return;
        }

        //Handling adding a block
        if(adding==true){
          console.log("Loading friends to check for existing friend");
          //Patching possible friend
          var connectionUpdate=0;
          found=0;
          await fetch(process.env.REACT_APP_API_PATH+"/connections?anyUserID="+sessionStorage.getItem("user") +"&attributes={\"path\": \"type\", \"equals\" : \"friend\"}", {
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
                  console.log(this.state.chosenid);
                  console.log(sessionStorage.getItem("user"));
                  console.log(result);
                  console.log(result[0]);
                  console.log("Searching for friend");
                  length = result[0].length;
                  console.log()
                  for(var i=0; i<length;i++){
                    if((result[0][i].fromUserID==this.state.chosenid && result[i].toUserID==sessionStorage.getItem("user")) || (result[0][i].toUserID==this.state.chosenid && result[0][i].fromUserID==sessionStorage.getItem("user"))){
                      connectionUpdate=result[0][i].id;
                      found=1;
                    } 
                  }

                }
              },
            
            );
            if(found==1){
              console.log("Friend detected; removing connection!")
             await fetch(process.env.REACT_APP_API_PATH+"/connections/"+connectionUpdate, {
                method: "PATCH",
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer '+sessionStorage.getItem("token")
                },
                body: JSON.stringify({
                  attributes: { type: "blocked"}
                })
              })
                .then(res => res.json())
                .then(
                  result => {
                    this.loadBlocks();
                  },
                  
                );

                return;
            }

            //if no friend was detected, we just make a regular post
            await fetch(process.env.REACT_APP_API_PATH+"/connections", {
              method: "POST",
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+sessionStorage.getItem("token")
              },
              body: JSON.stringify({
                toUserID: this.state.chosenid,
                fromUserID: sessionStorage.getItem("user"),
                attributes:{type:"blocked", status:"active"}
              })
            })
              .then(res => res.json())
              .then(
                result => {
                  this.loadBlocks();
                },
                
              );
          return;
        }
        //Removing a block
        if(adding==false){
          length = blocked.length;
          var connectionid=0;
          for(var i=0; i < length; i++){
            if(blocked[i].toUser.id == this.state.chosenid){
              connectionid=blocked[i].id;
            }
          }
         await fetch(process.env.REACT_APP_API_PATH+"/connections/"+connectionid, {
            method: "DELETE",
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer '+sessionStorage.getItem("token")
            },
          });
          this.loadBlocks();
          return;
        }
        

      }else{
        //No user chosen
        console.log("No user selected!");
        this.setState({existError:true});
        this.loadBlocks();
      }

    }

    renderBlock = connection => {
      if(connection.fromUserID==sessionStorage.getItem("user")){
        return <div key ={connection.id}><p> {connection.toUser.attributes.username} </p></div>
        
      }
      return <span></span>
    }


    render(){
      const {posts} = this.state;
        return (
          <div classname="background-stuff" >
            {/* <input type = "text" className="searchBarSize" placeholder="SEARCH"/> */}
            <img alt="Cover picture"src = {sessionStorage.getItem("coverPicture")} className="coverImage"/>
            <img alt="Profile picture" src = {sessionStorage.getItem("profilePicture")} className="profileImage"/>
            <div className="updateUser">
              {this.state.username}
            </div>
            <div style={{position:"absolute", top:300, left:20}} classname="posts" name="User posts">
            
            {posts.map(post => (
              
                this.renderPost(post)
              ))}


            </div>
            <div style={{position:"absolute", top:300, left:750}} name="Block List">
              <h2>Block list</h2>
              <label>Type someone you'd like to block or unblock!</label>
              <div className="autocomplete">
                
                <Autocomplete suggestions={this.state.users} selectAutocomplete={e => this.selectAutocomplete(e)} />
                <input style={{height:25, width:150}} type="submit" value="Add to block list" onClick={this.addingHandler}/>
                  {this.state.addError ? (
                <p>Error: This person is already on your block list!</p>
                ):<span></span> }
                {this.state.selferror ? (
                  <p>Error: You can't block yourself!</p>
                ):<span></span> }
                {this.state.existError ? (
                    <p>Error: This person doesn't exist!</p>
                  ):<span></span> }
                <input type="submit" style={{position:"relative",left:10,height:25, width:150}} value="Remove from block list" onClick={this.removingHandler} />
                  {this.state.removeError ? (
                    <p>Error: This person isn't on your block list!</p>
                  ):<span></span> }
              </div>
              <h3>Blocked Users: </h3>
              <ul>
              {this.state.blockedUsers.map(connection => (
                this.renderBlock(connection)
              )
              )}


        </ul>
            </div>

          </div>
        );
    }
}