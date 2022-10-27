import { React, useState, useEffect } from "react";
import { Container } from "../components/styled/Container.styled";
import Header from "../components/Header";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../utils/firebase";
import { useParams } from "react-router-dom";
import PostCard from "../components/PostCard";
import ParentTweet from "../components/ParentTweet";
import CommentInputBox from "../components/CommentInputBox";
import AuthPopup from "../components/AuthPopup";

const Tweet = (props) => {
  const params = useParams();
  const { parentTweet } = props;

  // Set the parent tweet
  useEffect(async () => {
    const docRef = doc(db, "posts", params.postId);
    const postDoc = await getDoc(docRef).then((doc) => {
      return { ...doc.data(), id: doc.id };
    });
    props.setParentTweet({ ...postDoc, type: "parent" });
  }, [params.postId]);

  //Fetch the comments
  useEffect(async () => {
    const replies = await props.getComments(params.postId);
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
          postMessage={props.postMessage}
        />
      ) : (
        ""
      )}
      {props.user ? (
        <CommentInputBox
          user={props.user}
          handleReply={props.handleReply}
          post={parentTweet}
          postMessage={props.postMessage}
        />
      ) : (
        ""
      )}
      {props.showPopup ? (
        <AuthPopup
          showRegisterForm={props.showRegisterForm}
          setShowRegisterForm={props.setShowRegisterForm}
          handleLogin={props.handleLogin}
          handleRegister={props.handleRegister}
          setShowPopup={props.setShowPopup}
        />
      ) : (
        ""
      )}
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
            postMessage={props.postMessage}
          />
        );
      })}
    </Container>
  );
};

export default Tweet;
