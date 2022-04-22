import { React, useState, useEffect } from "react";
import { Container } from "../components/styled/Container.styled";
import Header from "../components/Header";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../utils/firebase";
import { useParams } from "react-router-dom";
import PostCard from "../components/PostCard";

const Tweet = (props) => {
  const params = useParams();
  const [post, setPost] = useState();

  useEffect(async () => {
    let active = true;
    const getPost = async (id) => {
      const docRef = doc(db, "posts", params.postId);
      const postDoc = await getDoc(docRef).then((doc) => doc.data());
      if (active) {
        setPost(postDoc);
      }
    };
    getPost();
    return () => {
      active = false;
    };
  }, [params.postId]);

  return (
    <Container>
      <Header pageTitle="Tweet" />
      {post ? (
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
      ) : (
        ""
      )}
    </Container>
  );
};

export default Tweet;
