import { React, useState, useEffect } from "react";
import { Container } from "../components/styled/Container.styled";
import Header from "../components/Header";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../utils/firebase";
import { useParams } from "react-router-dom";
import PostCard from "../components/PostCard";
import ParentTweet from "../components/ParentTweet";

const Tweet = (props) => {
  const params = useParams();

  useEffect(async () => {
    const docRef = doc(db, "posts", params.postId);
    const postDoc = await getDoc(docRef).then((doc) => {
      return { ...doc.data(), id: doc.id };
    });
    props.setPosts([{ ...postDoc, type: "parent" }]);
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
                  message={post.message}
                  liked={props.checkLiked(post.id)}
                  likeCount={post.likeCount}
                  retweetCount={post.retweetCount}
                  handleLike={props.handleLike}
                  handleReply={props.handleReply}
                />
              );
            } else {
              return (
                <PostCard
                  key={post.id}
                  post={post}
                  profilePicURL={post.profilePicURL}
                  user={post.user}
                  displayName={post.displayName}
                  timestamp={post.timestamp}
                  message={post.message}
                  liked={props.checkLiked(post.id)}
                  likeCount={post.likeCount}
                  handleLike={props.handleLike}
                  handleReply={props.handleReply}
                />
              );
            }
          })
        : ""}
    </Container>
  );
};

export default Tweet;
