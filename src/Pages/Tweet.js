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
  const params = useParams();
  const { parentTweet } = props;

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
    props.setParentTweet({ ...postDoc, type: "parent" });
  }, [params.postId]);

  useEffect(async () => {
    const replies = await props.getComments(params.postId);
    console.log(replies);
    props.setComments(replies);
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
      {props.parentTweet.id == params.postId ? (
        <ParentTweet
          key={parentTweet.id}
          post={parentTweet}
          profilePicURL={parentTweet.profilePicURL}
          user={parentTweet.user}
          displayName={parentTweet.displayName}
          timestamp={parentTweet.timestamp}
          replyType={parentTweet.replyType}
          message={parentTweet.message}
          liked={props.checkLiked(parentTweet.id)}
          retweeted={props.checkRetweeted(parentTweet.id)}
          likeCount={parentTweet.likeCount}
          retweetCount={parentTweet.retweetCount}
          handleLike={props.handleLike}
          handleReply={props.handleReply}
        />
      ) : (
        ""
      )}
      <CommentInputBox
        user={props.user}
        handleReply={props.handleReply}
        post={parentTweet}
      />
      {props.comments.map((item) => {
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
