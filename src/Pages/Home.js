import React, { useEffect, useState } from "react";
import PostInputBox from "../components/PostInputBox";
import AuthPopup from "../components/AuthPopup";
import Header from "../components/Header";
import { Container } from "../components/styled/Container.styled";
import PostCard from "../components/PostCard";
import { v4 as uuidv4 } from "uuid";
import RePost from "../components/RePost";

const Home = (props) => {
  const getMessages = async () => {
    const messages = await props.getHomeFeed();
    props.setPosts(messages);
  };

  useEffect(() => {
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
          handlePost={props.handlePost}
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
        if (post.type === "repost") {
          return (
            <RePost
              key={uuidv4()}
              id={post.id}
              repostDisplayName={post.displayName}
              post={post.origDoc}
              liked={props.checkLiked(post.origPostId)}
              reposted={props.checkReposted(post.origPostId)}
              commented={props.checkCommented(post.origPostId)}
              repostCount={post.origDoc.repostCount}
              commentCount={post.origDoc.commentCount}
              likeCount={post.origDoc.likeCount}
              handleLike={props.handleLike}
              handleReply={props.handleReply}
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
              userHandle={post.userHandle}
              timestamp={post.timestamp}
              message={post.message}
              image={post.image}
              likeCount={post.likeCount}
              repostCount={post.repostCount}
              commentCount={post.commentCount}
              liked={props.checkLiked(post.id)}
              reposted={props.checkReposted(post.id)}
              commented={props.checkCommented(post.id)}
              handleLike={props.handleLike}
              handleReply={props.handleReply}
            />
          );
        }
      })}
    </Container>
  );
};

export default Home;
