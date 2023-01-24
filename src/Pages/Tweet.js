import { React, useState, useEffect } from "react";
import { Container } from "../components/styled/Container.styled";
import Header from "../components/Header";
import {
  doc,
  collection,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "../utils/firebase";
import { useParams } from "react-router-dom";
import PostCard from "../components/PostCard";
import ParentTweet from "../components/ParentTweet";
import CommentInputBox from "../components/CommentInputBox";
import AuthPopup from "../components/AuthPopup";
import { OAuthCredential } from "firebase/auth";

const Tweet = (props) => {
  const params = useParams();

  const fetchMainTweet = async () => {
    const mainTweetRef = doc(db, "posts", params.postId);
    const mainTweet = await getDoc(mainTweetRef).then((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    return mainTweet;
  };

  const fetchCommentFeed = async () => {
    const commentsQuery = query(
      collection(db, "posts"),
      where("type", "==", "comment"),
      where("origPostId", "==", params.postId),
      orderBy("timestamp", "desc")
    );

    const commentsSnapshot = await getDocs(commentsQuery);

    const comments = [];
    commentsSnapshot.forEach((doc) =>
      comments.push({ ...doc.data(), id: doc.id })
    );

    return comments;
  };

  useEffect(() => {
    const fetchData = async () => {
      const mainTweet = await fetchMainTweet();
      const comments = await fetchCommentFeed();
      props.setPosts([mainTweet, ...comments]);
    };
    fetchData().catch((err) => console.error(err));
  }, [params.postId]);

  return (
    <Container>
      <Header
        pageTitle="Post"
        setShowPopup={props.setShowPopup}
        setShowRegisterForm={props.setShowRegisterForm}
        handleLogout={props.handleLogout}
        user={props.user}
      />
      {props.posts.map((item, i) => {
        if (i === 0) {
          return (
            <ParentTweet
              key={item.id}
              post={item}
              profilePicURL={item.profilePicURL}
              user={item.user}
              displayName={item.displayName}
              timestamp={item.timestamp}
              replyType={item.replyType}
              message={item.message}
              liked={props.checkLiked(item.id)}
              commented={props.checkCommented(item.id)}
              reposted={props.checkReposted(item.id)}
              likeCount={item.likeCount}
              repostCount={item.repostCount}
              commentCount={item.commentCount}
              handleLike={props.handleLike}
              handleReply={props.handleReply}
            />
          );
        }
      })}

      {props.user ? (
        <CommentInputBox
          user={props.user}
          handleReply={props.handleReply}
          post={props.posts[0]}
          posts={props.posts}
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
      {props.posts.map((item, i) => {
        if (i > 0) {
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
              reposted={props.checkReposted(item.id)}
              commented={props.checkCommented(item.id)}
              likeCount={item.likeCount}
              repostCount={item.repostCount}
              commentCount={item.commentCount}
              handleLike={props.handleLike}
              handleReply={props.handleReply}
            />
          );
        }
      })}
    </Container>
  );
};

export default Tweet;
