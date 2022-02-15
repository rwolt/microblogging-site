import React, { useEffect, useState } from "react";
import PostCard from "./PostCard";

const UserPosts = (props) => {
  const [posts, setPosts] = useState([]);
  useEffect(async () => {
    const tweets = await props.getProfilePosts("posts", props.userId);
    setPosts(tweets);
  }, [posts]);
  return (
    <div>
      {posts.map((post) => (
        <PostCard post={post} />
      ))}
    </div>
  );
};
const UserPostsReplies = () => {
  return <div>Posts & Replies</div>;
};
const UserMedia = () => {
  return <div>Media</div>;
};
const UserLikes = () => {
  return <div>Likes</div>;
};

export { UserPosts, UserPostsReplies, UserMedia, UserLikes };
