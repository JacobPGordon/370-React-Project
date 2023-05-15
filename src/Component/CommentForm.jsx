import React from "react";
import "../css/App.css";
import PostingList from "./PostingList.jsx";

export default class CommentForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      post_text: "",
      postmessage: ""
    };
    this.postListing = React.createRef();
  }

  submitHandler = event => {
    //keep the form from actually submitting
    event.preventDefault();

    //make the api call to the authentication page

    fetch(process.env.REACT_APP_API_PATH+"/posts", {
      method: "post",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+sessionStorage.getItem("token")
      },
      body: JSON.stringify({
        attributes: {
          location:"none given",
        },
        authorID: sessionStorage.getItem("user"),
        content: this.state.post_text,
        parentID: this.props.parent,
        thumbnailURL: "",
        type: "post"
      })
    })
      .then(res => res.json())
      .then(
        result => {
          // update the count in the UI manually, to avoid a database hit
          this.props.onAddComment(this.props.commentCount + 1);
          this.postListing.current.loadPosts();
        },
        error => {
          alert("error!");
        }
      );
  };

  myChangeHandler = event => {
    this.setState({
      post_text: event.target.value
    });
  };

  render() {
    return (
      <div>
        <div style={{paddingbottom:'80'}}>
        {/* {this.props.friend || (sessionStorage.getItem("user")==this.props.authorID) ? ( */}
          <form className="addCommentForm" onSubmit={this.submitHandler}>
          <label>
            Add A Comment to Post {this.props.parent}
            <br />
            <textarea rows="10" cols="65" onChange={this.myChangeHandler} />
          </label>
          <br />

          <input type="submit" value="submit" />
          <br />
          {this.state.postmessage}
        </form>
          {/* ):<p></p> } */}
          </div>
        <br></br>
        <PostingList
          ref={this.postListing}
          parentid={this.props.parent}
          type="commentlist"
        />
      </div>
    );
  }
}