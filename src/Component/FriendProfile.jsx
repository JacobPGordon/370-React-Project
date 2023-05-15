import React from "react";
import "../css/profilepage.css";
import "../css/App.css";
import generic from "../assets/GenericProfilePicture.jpg"
import genericcover from "../assets/GenericCoverImage.jpeg"

export default class ProfilePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          username: "",
          firstname: "",
          lastname: "",
          friendid: this.props.userid,
          mygroups: [],
          cover: "",
          profile: "",
          posts: [],
          friendsList: []
          // NOTE : if you wanted to add another user attribute to the profile, you would add a corresponding state element here
        };
        this.fieldChangeHandler.bind(this);
    }

    componentDidMount() {
      console.log(this.props.userid);
      this.loadUser();
      this.loadPosts();
    }

    componentDidUpdate(prevProps){
      console.log(this.props.userid);
      if(prevProps.userid != this.props.userid){
        this.loadUser();
      }
    }

    loadPosts(){
      fetch(process.env.REACT_APP_API_PATH +"/posts?authorID="+this.props.userid, {
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


    
    fieldChangeHandler(field, e) {
        console.log("field change");
        this.setState({
          [field]: e.target.value
        });
    }

     loadUser() {
      console.log(this.state.friendid);

        //NEED TO LOAD USER'S COVER IMAGE AND PROFILE PIC
       fetch(process.env.REACT_APP_API_PATH+"/users/"+this.state.friendid, {
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
            console.log("Username loaded!");
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

       fetch(process.env.REACT_APP_API_PATH+"/file-uploads?uploaderID=" + this.state.friendid + "&attributes={\"path\" : \"type\", \"equals\" : \"profileImage\"}" ,{
        method: "get",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+sessionStorage.getItem("token")
        },
        //Profile image fetch ends here
      }).then(result => result.json())
        .then(
          result => {
            console.log("Profile Picture Loaded!");
            if(result[0].length > 0){
              
              this.setState({profile:"https://webdev.cse.buffalo.edu" + result[0][0].path})

            }else{
              this.setState({profile:generic});
              
              
            }
          }


          //Assigning profile image ends here
        )
         fetch(process.env.REACT_APP_API_PATH+"/file-uploads?uploaderID=" + this.state.friendid + "&attributes={\"path\" : \"type\", \"equals\" : \"coverImage\"}" ,{
          method: "get",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+sessionStorage.getItem("token")
          },
          
        }).then(result => result.json())
          .then(
            result => {
              console.log("Cover loaded!");
              if(result[0].length > 0){
                
                this.setState({cover:"https://webdev.cse.buffalo.edu" + result[0][0].path})
  
              }else{
                this.setState({cover:genericcover});
                
                
              }
            }
  
  
           
          )
          console.log("Update forced!");
          


      
    }

    renderPost(post){
      return (
      
      
        <div name="Friend post">
          
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


    render(){
      const {posts} = this.state;
        return (
         // <div>
          //  <input type = "text" className="searchBarSize" placeholder="SEARCH"/>
         //   <div style={{position: 'absolute', top:250,}}>
         //     <img src = {this.state.profileimage} className="profileImage"/>
         //     <p style={{position: 'absolute', left:9, top:-75}}>{this.state.username}</p>
        //    </div>
       //   </div>
       <div>
            {/* <input type = "text" className="searchBarSize" placeholder="SEARCH"/> */}
            <img alt="Cover image" src = {this.state.cover} className="coverImage"/>
            <img alt="Friend's profile picture" src = {this.state.profile} className="profileImage"/>
            <div className="updateUser">
              {this.state.username}
            </div>
            <div style={{position:"absolute", top:300, left:20}} classname="posts" name="Friend's posts">
            {posts.map(post => (

                this.renderPost(post)

              ))}



            </div>
          </div>
        );
    }
}