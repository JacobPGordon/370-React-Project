import React from "react";

import {
  Link
} from 'react-router-dom';

import "../css/posts.css";
import generic from "../assets/GenericProfilePicture.jpg"
import CommentForm from "./CommentForm.jsx";
import deleteIcon from "../assets/delete.png";
import commentIcon from "../assets/comment.svg";
import upvoteIcon from "../assets/upvote.jpeg";
import downvoteIcon from "../assets/downvote.png";
import Comment from "./Comment.jsx";
import editIcon from "../assets/edit.png";

/* This will render a single post, with all of the options like comments, delete, tags, etc.  In the harness, it's only called from PostingList, but you could
  also have it appear in a popup where they edit a post, etc. */

export default class Post extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      avatar: "",
      showModal: false,
      showModalPopup: false,
      friend: false,
      comments: 0,
      showEdit: false,
      postContents: "",
      blocked: false,
      showTags: this.props.post.reactions.length > 0,
      reactions: []
    };
    this.post = React.createRef();
    this.fetchImage = this.fetchImage.bind(this);
    this.checkForFriend = this.checkForFriend.bind(this);
  }

  componentDidMount(){
    this.checkForFriend();
    this.checkForComments();
    this.fetchImage();
    this.checkBlocked();
  }

  componentDidUpdate(prevProps){
    if(this.props.friendIDs !== prevProps.friendIDs){
      this.checkForFriend();
    }
    if(this.props.blockedUsers !== prevProps.blockedUsers){
      this.checkBlocked();
    }
    if(this.props.avatar !== prevProps.avatar){
      this.fetchImage();
    }
  }

  checkBlocked(){
    console.log(this.props.blockedUsers);
    if(this.props.blockedUsers != null){
    var length = this.props.blockedUsers.length;
    console.log(this.props.blockedUsers);
    for(var i=0; i < length; i++){
      var user = sessionStorage.getItem("user");
      var authorid = this.props.post.authorID;
      var toID=this.props.blockedUsers[i].toUserID;
      var fromID=this.props.blockedUsers[i].fromUserID;
      if((user==fromID && authorid==toID) || (user==toID && authorid==fromID) ){
        this.setState({blocked:true});
      }
    }
    }
    
  }


   checkForComments() {
     fetch(process.env.REACT_APP_API_PATH+"/posts?parentID=" + this.props.post.id + "&sort=newest", {
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
            this.setState({comments:result[0].length});
            
            
            
          }
        },
        
      );

  }



  checkForFriend(){
   
    if(this.props.friendIDs != null){

      var length = this.props.friendIDs.length;
      var author = this.props.author;
      
      for(var i=0; i < length; i++){
        if(this.props.friendIDs[i].toUser.id==author || this.props.friendIDs[i].fromUser.id==author){
          this.setState({friend:true})
        }
      }
    }
      
  }

  showEditModal = e => {
    this.setState({
      showEdit: !this.state.showEdit
    });
  };

  myChangeHandler = event => {
    this.setState({
      postContents: event.target.value
    });
  };

  showModal = e => {
    this.setState({
      showModal: !this.state.showModal
    });
  };
  


  showTags = e => {
    this.setState({
      showTags: !this.state.showTags
    });
  };

  setCommentCount = newcount => {
    this.setState({
      comments: newcount
    });
  };

   getCommentCount() {
    
    if (!this.state.comments || this.state.comments === 0) {
      return 0;
    }
    return parseInt(this.state.comments);
  }

  fetchImage() {
    
    fetch(process.env.REACT_APP_API_PATH+"/file-uploads?uploaderID=" + this.props.post.authorID + "&attributes={\"path\" : \"type\", \"equals\" : \"profileImage\"}" ,{
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

  // this is the simplest version of reactions; it's only mananging one reaction, liking a post.  If you unlike the post, 
  // it deletes the reaction.  If you like it, it posts the reaction.  This will almost certainly be made more complex
  // by you, where you will account for multiple different reactions.  Note that in both cases, we reload the post afterwards to
  // show the updated reactions.

  tagPost(tag, thisPostID){

      //find the appropriate reaction to delete - namely, the one from the current user
      let userReaction = -1;
      this.props.post.reactions.forEach(reaction => {
        if (reaction.reactorID == sessionStorage.getItem("user")){
          userReaction = reaction.id;
        }
      });

      // if there is one, delete it.
      if (userReaction >= 0){

      //make the api call to post
      fetch(process.env.REACT_APP_API_PATH+"/post-reactions/"+userReaction, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+sessionStorage.getItem("token")
        },
      })
        .then(
          result => {
            this.props.loadPosts();
          },
          // error => {
          //   alert("error!"+error);
          // }
        );
     }else{
     //make the api call to post
     fetch(process.env.REACT_APP_API_PATH+"/post-reactions", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+sessionStorage.getItem("token")
      },
      body: JSON.stringify({
        reactorID: sessionStorage.getItem("user"),
        postID: thisPostID,
        name: "upvote",
      })
      })
      .then(
        result => {
          this.props.loadPosts();
        },
        // error => {
        //   alert("error!"+error);
        // }
      );
     }
  }

  // This function will get and return the amount of likes a post has!
  getLikeCount() {
    return(this.props.post.reactions.length);
  }

  // this will toggle the CSS classnames that will either show or hide the comment block
  showHideComments() {
    if (this.state.showModal) {
      return "comments show";
    }
    return "comments hide";
  }


  // this will toggle the CSS classnames that will either show or hide the tag block
  showHideTags() {
    // if (this.state.showTags) {
      if (this.props.post.reactions.length > 0){
        for (let i = 0; i < this.props.post.reactions.length; i++){
          if (this.props.post.reactions[i].reactorID == sessionStorage.getItem("user")){ 
            console.log("Had a reaaction");
            return "tags show tag-active"
          }
        }
      }
      return "tags show";
    //}
  }


  deletePost(postID) {
    //make the api call to post
    fetch(process.env.REACT_APP_API_PATH+"/posts/"+postID, {
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+sessionStorage.getItem("token")
      }
      })
      .then(
        result => {
          this.props.loadPosts();
        },
        // error => {
        //   alert("error!"+error);
        // }
      );
  }

  editPost(postID) {
    //make the api call to post
    fetch(process.env.REACT_APP_API_PATH+"/posts/"+postID, {
      method: "PATCH",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+sessionStorage.getItem("token")
      },
      body: JSON.stringify({
        content: this.state.postContents
      })
      })
      .then(
        result => {
          // this.setState({
          //   content: result.Status
          // });
          this.props.loadPosts();
        },
        // error => {
        //   alert("error!"+error);
        // }
      );
  }

  // this is showing both tags and comments... but used to show only comments.  That's a 
  // frequent cause of names being out of sync with the way things work; do you really want to 
  // risk breaking stuff by changing the name and not knowing everywhere it is called?  
  commentDisplay() {

    //if (this.props.post.commentCount <= 0) {
    //  return "";
    //  }

    //else {
      return (
        <div className="comment-block">

          <div className="comment-indicator">
            <div className="comment-indicator-text">
              {this.getCommentCount()} Comments
            </div>
            <div className={this.showHideTags()}>
            <img 
              src={upvoteIcon}
              className="comment-icon"
              onClick={e => this.tagPost("upvote",this.props.post.id,0)}
              alt="Up Vote Post"
              />
              {this.getLikeCount()}
          </div>
            <button style = {{position:"relative", right:280, bottom: 15}} onClick={e => this.showModal()}> Show/Add comments</button>
          </div>
          
          <div style={{width: 300}}className={this.showHideComments()}>
            <CommentForm
              friend={this.state.friend}
              onAddComment={this.setCommentCount}
              parent={this.props.post.id}
              authorID={this.props.post.authorID}
              commentCount={this.getCommentCount()}
            />
          </div>

         
        </div>
      );
    //}

  }

  // we only want to expose the delete post functionality if the user is
  // author of the current post
  showDelete(){
    if (this.props.post.author.id == sessionStorage.getItem("user")) {
      return(
      <img
        src={deleteIcon}
        className="sidenav-icon deleteIcon"
        alt="Delete Post"
        title="Delete Post"
        onClick={e => this.deletePost(this.props.post.id)}
      />
    );
    } else {
      return "";
    }
  }

  showEdit(){
    if (this.props.post.author.id == sessionStorage.getItem("user")) {
      if(!this.state.showEdit) {
        return(
          <img
            src={editIcon}
            className="sidenav-icon deleteIcon"
            alt="Edit Post"
            title="Edit Post"
            onClick={e => this.showEditModal()}
          />
        )
      } else {
        return(
          <div>
            <form onSubmit = {this.editPost(this.props.post.id)}>
              <label>
                What would you like to change?
                <br />
                <textarea rows="8" cols="70"
                placeholder={this.props.post.content} 
                onChange={this.myChangeHandler} />
              </label>
              <br />
              <input type="submit" value="SUBMIT" className="submitEditButton"/>
              <button className="cancelEdit" onClick={e => this.showEditModal()}>Cancel</button>
            </form>
          </div>
        );
      };
    } else {
      return "";
    }
  }

  handleEditPost = (id) => {
    if (this.state.showEdit) {
      this.setState({ showEdit: false });
    } 
    else {
      this.setState({ showEdit: true });
      document.getElementById(id).removeAttribute("readonly")
    }
  }


  
  render() {
    if(this.props.parentID != null && this.state.blocked==false){
      return(<Comment avatar={this.props.avatar} key={this.props.post.id} parentID = {this.props.post.parentID} post={this.props.post} type={this.props.type} loadPosts={this.loadPosts}/>)
    }
    console.log(this.state.blocked);
    if(this.state.blocked==false){
    return (
      
      
      <div>
        
      <div
        
        key={this.props.post.id}
        className={[this.props.type, "postbody"].join(" ")}
        
      >
      <div className="deletePost">
        <img src={this.state.avatar} style={{height:50, width:50}}/> {this.props.post.author.attributes.username} ({this.props.post.updated.slice(0,10)})
      <div className="deleteIcon">
        {this.showDelete()}
      </div>
      <div className = "editIcon">
          {this.showEdit()}
      </div>
      <p><b>Location</b>: {this.props.location}</p>
      <p><b>Tag</b>: {this.props.tag}</p>
      </div>
         <br />{" "}
        {this.props.post.content}
        <br/>
        {this.commentDisplay()}

      </div>
      </div>
    );}else{
      return(<span></span>)
    }
  }
}