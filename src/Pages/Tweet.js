import { React, useState, useEffect } from "react";
import { Container } from "../components/styled/Container.styled";
import Header from "../components/Header";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../utils/firebase";
import { useParams } from "react-router-dom";
import PostCard from "../components/PostCard";
import ParentTweet from "../components/ParentTweet";
import CommentInputBox from "../components/CommentInputBox";

const Tweet = (props) => {
  const [comments, setComments] = useState([]);
  const params = useParams();

  useEffect(async () => {
    let docRef = "";
    //If the post is a reply
    if (params.replyType) {
      docRef = doc(db, "replies", params.postId);
    } else {
      //If the post is a post
      docRef = doc(db, "posts", params.postId);
    }
    const postDoc = await getDoc(docRef).then((doc) => {
      return { ...doc.data(), id: doc.id };
    });
    props.setPosts([{ ...postDoc, type: "parent" }]);
  }, [params.postId]);

  useEffect(async () => {
    const replies = await props.getComments(params.postId);
    setComments(replies);
  }, [params.postId]);

  return (
    <Container>
      <Header
        pageTitle="Tweet"
        setShowPopup={props.setShowPopup}
        setShowRegisterForm={props.setShowRegisterForm}
        handleLogout={props.handleLogout}
        user={props.user}
      />
      {props.posts.length > 0
        ? props.posts.map((post) => {
            if (post.type === "parent") {
              return (
                <ParentTweet
                  key={post.id}
                  post={post}
                  profilePicURL={post.profilePicURL}
                  user={post.user}
                  displayName={post.displayName}
                  timestamp={post.timestamp}
                  replyType={post.replyType}
                  message={post.message}
                  liked={props.checkLiked(post.id)}
                  retweeted={props.checkRetweeted(post.id)}
                  likeCount={post.likeCount}
                  retweetCount={post.retweetCount}
                  handleLike={props.handleLike}
                  handleReply={props.handleReply}
                />
              );
            }
          })
        : ""}
      <CommentInputBox
        user={props.user}
        handleReply={props.handleReply}
        post={props.posts[0]}
      />
      {comments.map((item) => {
        return (
          <PostCard
            key={item.id}
            post={item}
            profilePicURL={item.profilePicURL}
            user={item.user}
            displayName={item.displayName}
            timestamp={item.timestamp}
            replyType={item.replyType}
            message={item.message}
            liked={props.checkLiked(item.id)}
            retweeted={props.checkRetweeted(item.id)}
            likeCount={item.likeCount}
            retweetCount={item.retweetCount}
            handleLike={props.handleLike}
            handleReply={props.handleReply}
          />
        );
      })}
    </Container>
  );
};

export default Tweet;
