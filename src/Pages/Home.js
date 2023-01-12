import React, { useEffect, useState } from "react";
import PostInputBox from "../components/PostInputBox";
import AuthPopup from "../components/AuthPopup";
import Header from "../components/Header";
import { Container } from "../components/styled/Container.styled";
import PostCard from "../components/PostCard";
import { v4 as uuidv4 } from "uuid";
import RePost from "../components/RePost";

const Home = (props) => {
  useEffect(() => {
    const getMessages = async () => {
      const messages = await props.getHomeFeed();
      props.setPosts(messages);
    };
    getMessages().catch((err) => console.error(err));
  }, []);

  return (
    <Container>
      <Header
        pageTitle="Home"
        setShowPopup={props.setShowPopup}
        setShowRegisterForm={props.setShowRegisterForm}
        handleLogout={props.handleLogout}
        user={props.user}
      />
      {props.user ? (
        <PostInputBox
          user={props.user}
          postMessage={props.postMessage}
          getHomeFeed={props.getHomeFeed}
          setPosts={props.setPosts}
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

      {props.posts.map((post) => {
        if (post.type === "retweet") {
          return (
            <RePost
              key={uuidv4()}
              id={post.id}
              retweetDisplayName={post.displayName}
              post={post.origDoc}
              liked={props.checkLiked(post.origPostId)}
              retweeted={props.checkRetweeted(post.origPostId)}
              handleLike={props.handleLike}
              handleReply={props.handleReply}
              postMessage={props.postMessage}
              getMessages={props.getMessages}
            />
          );
        } else {
          return (
            <PostCard
              key={uuidv4()}
              id={post.id}
              post={post}
              profilePicURL={post.profilePicURL}
              user={post.user}
              displayName={post.displayName}
              timestamp={post.timestamp}
              message={post.message}
              likeCount={post.likeCount}
              retweetCount={post.retweetCount}
              commentCount={post.commentCount}
              liked={props.checkLiked(post.id)}
              retweeted={props.checkRetweeted(post.id)}
              handleLike={props.handleLike}
              handleReply={props.handleReply}
              postMessage={props.postMessage}
              getMessages={props.getMessages}
              setPosts={props.setPosts}
            />
          );
        }
      })}
    </Container>
  );
};

export default Home;
