import React from "react";
import "../css/posts.css";
import generic from "../assets/GenericProfilePicture.jpg"
import CommentForm from "./CommentForm.jsx";
import helpIcon from "../assets/delete.png";
import commentIcon from "../assets/comment.svg";
import upvoteIcon from "../assets/upvote.jpeg";
import downvoteIcon from "../assets/downvote.png";

/* This will render a single post, with all of the options like comments, delete, tags, etc.  In the harness, it's only called from PostingList, but you could
  also have it appear in a popup where they edit a post, etc. */

export default class Post extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      avatar: "",
      showModal: false,
      comments: this.props.post.commentCount,
      showTags: this.props.post.reactions.length > 0,
      reactions: []
    };
    this.post = React.createRef();
    
  }

  showModal = e => {
    this.setState({
      showModal: !this.state.showModal
    });
  };
  
  //YOU GOT THE IDS IN friendIDs, NOW JUST SORT THEM TO SEE IF YOU RENDER THE COMMENT FORM


  showTags = e => {
    this.setState({
      showTags: !this.state.showTags
    });
  };
  
  componentDidMount(){
    console.log("Comment rendered");
    this.fetchImage();
  }

  setCommentCount = newcount => {
    this.setState({
      comments: newcount
    });
  };

  getCommentCount() {
    if (!this.state.comments || this.state.comments === "0") {
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

  componentDidUpdate(prevProps){
    if(this.props.avatar !== prevProps.avatar){
      this.fetchImage();
    }
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
          error => {
            alert("error!"+error);
          }
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
        error => {
          alert("error!"+error);
        }
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
    if (this.state.showTags) {
      if (this.props.post.reactions.length > 0){
        for (let i = 0; i < this.props.post.reactions.length; i++){
          if (this.props.post.reactions[i].reactorID == sessionStorage.getItem("user")){ 
            console.log("Had a reaaction");
            return "tags show tag-active"
          }
        }
      }
      return "tags show";
    }
    return "tags hide";
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
        error => {
          alert("error!"+error);
        }
      );
  }

  // this is showing both tags and comments... but used to show only comments.  That's a 
  // frequent cause of names being out of sync with the way things work; do you really want to 
  // risk breaking stuff by changing the name and not knowing everywhere it is called?  
  commentDisplay() {
    console.log("Comment count is " + this.props.post.commentCount);

    //if (this.props.post.commentCount <= 0) {
    //  return "";
    //  }

    //else {
      return (
        <div className="comment-block">

        <div>
          </div>

          <img alt="Comment profile image" src={this.state.avatar} style={{height:30, width:30}}/>
          <div className="tag-block">
            <button value="tag post" onClick={e => this.showTags()}>
            tag post
            </button>
          </div>

          <div name="tagDiv" className={this.showHideTags()}>
            <img 
              src={upvoteIcon}
              className="comment-icon"
              onClick={e => this.tagPost("upvote",this.props.post.id,0)}
              alt="Comment Up Vote Post"value
            />
          </div>

          <p> {this.getLikeCount()}</p>
          <div className="comment-indicator">
            <div className="comment-indicator-text">
              {this.getCommentCount()} Comments
            </div>
            <button style = {{position:"relative", right:325, bottom:-5}} onClick={e => this.showModal()}> Show comments</button>
          </div>
          <div className={this.showHideComments()}>
            <CommentForm
              onAddComment={this.setCommentCount}
              parent={this.props.post.id}
              commentCount={this.getCommentCount()}
            />
          </div>

         
        </div>
      );
    //}

  }

  // we only want to expose the delete post functionality if the user is
  // author of the post
  showDelete(){
    if (this.props.post.author.id === sessionStorage.getItem("user")) {
      return(
      <img
        src={helpIcon}
        className="sidenav-icon deleteIcon"
        alt="Comment Delete Post"
        title="Delete Post"
        onClick={e => this.deletePost(this.props.post.id)}
      />
    );
    }
    return "";
  }

  render() {

    return (
      
      
        
      <div
        
        key={this.props.post.id}
        className={[this.props.type, "postbody"].join(" ")}
        
      >
      
      <div className="deletePost">
      {this.props.post.author.attributes.username} ({this.props.post.created})
      {this.showDelete()}
      </div>
         <br />{" "}
         <img src={this.state.avatar} style={{height:30, width:30}}/>
        {this.props.post.content}
        

      </div>
      
    );
  }
}
