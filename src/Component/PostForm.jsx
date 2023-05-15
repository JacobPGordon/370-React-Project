import React from "react";
// import "../css/App.css";
import "../css/posts.css";
import PostingList from "./PostingList.jsx";

// The post form component holds both a form for posting, and also the list of current posts in your feed.  This is primarily to 
// make updating the list simpler.  If the post form was contained entirely in a separate component, you would have to do a lot of calling around
// in order to have the list update.  Communication between components in react is ... fun. 
export default class PostForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      friendIDs:[],
      post_text: "",
      location: "",
      postmessage: "",
      blockedUsers: [],
    };
    this.postListing = React.createRef();
    
  }
  
  locationhandler = event => {
    this.setState({location: event.target.value})
  }
  //FIX COMMENT DISPLAY

    getFriends() {
      fetch(process.env.REACT_APP_API_PATH+"/connections?anyUserID="+sessionStorage.getItem("user") +"&attributes={\"path\": \"type\", \"equals\" : \"friend\"}", {
      method: "get",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+sessionStorage.getItem("token")
      }
     })
     .then(response => response.json())
     .then(res =>{
        this.setState({friendIDs:res[0]});
        
     })
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
      console.log(result[0]);
     this.setState({blockedUsers:result[0]});        
    })
 }

  componentDidMount(){
    this.getFriends();
    this.loadBlocks();
  }
  
  

  

  tagHandler = event => {
    this.setState({tag: event.target.value})
  }

  // the handler for submitting a new post.  This will call the API to create a new post.
  // while the test harness does not use images, if you had an image URL you would pass it
  // in the attributes field.  Posts also does double duty as a message; if you want in-app messaging
  // you would add a recipientUserID for a direct message, or a recipientGroupID for a group chat message.
  // if the post is a comment on another post (or comment) you would pass in a parentID of the thing
  // being commented on.  Attributes is an open ended name/value segment that you can use to add 
  // whatever custom tuning you need, like category, type, rating, etc.
  submitHandler = event => {

    //keep the form from actually submitting via HTML - we want to handle it in react
    event.preventDefault();
    var location = "";
    if(this.state.location == ""){
      location = "No location given";
    }else{
      location = this.state.location;
    }

    var tag = "";
    if(this.state.tag == ""){
      tag = "";
    }else{
      tag = this.state.tag;
    }

    //make the api call to post
    fetch(process.env.REACT_APP_API_PATH+"/posts", {
      method: "post",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+sessionStorage.getItem("token")
      },
      body: JSON.stringify({
        authorID: sessionStorage.getItem("user"),
        content: this.state.post_text,
        attributes: {
          location: location,
          tag: tag
        }
      })
    })
      .then(res => res.json())
      .then(
        result => {
          this.setState({
            postmessage: result.Status
          });
          // once a post is complete, reload the feed
          this.postListing.current.loadPosts();
        },
        error => {
          alert("error!");
        }
      );
  };

  // this method will keep the current post up to date as you type it,
  // so that the submit handler can read the information from the state.
  myChangeHandler = event => {
    this.setState({
      post_text: event.target.value
      
    });
  };

  // the login check here is redundant, since the top level routing also is checking,
  // but this could catch tokens that were removed while still on this page, perhaps due to a timeout?
   render() {
    
    if (!sessionStorage.getItem("token")) {
      console.log("NO TOKEN");
      return ("Please log in to make and view posts");

    }else{
      
    }

    return (
      
      <div className="posting">
        <form onSubmit={this.submitHandler}>
          <label className="labels">
            <b>What's on your mind?</b>
            <br />
            <textarea rows="10" cols="70" onChange={this.myChangeHandler} />
            <br />
            Want to add a location for your post? 
            <input type="text" style={{position:'relative', left:10}} onChange={this.locationhandler} />
            <br />
            add ONE tag to your post!
            <input type="text" style={{position:'relative', left:10}} onChange={this.tagHandler} />
          </label>
          <br />

          <input type="submit" value="submit" class="submit"/>
          <br />
          {this.state.postmessage}
        </form>
        <PostingList ref={this.postListing} blockedUsers={this.state.blockedUsers} friendIDs={this.state.friendIDs} refresh={this.props.refresh} type="postlist" />
      </div>
    );
  }
}