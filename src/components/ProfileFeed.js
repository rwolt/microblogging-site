import React, { useEffect, useState } from "react";
import PostCard from "./PostCard";

const ProfileFeed = (props) => {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const data = await props.getProfilePosts(props.profileFeed, props.userId);
      setPosts(data);
    };
    fetchData();
  }, [props]);

  const Feed = (props) => {
    return (
      <div>
        {props.posts.map((post) => {
          return <PostCard post={post} key={post.id} />;
        })}
      </div>
    );
  };

  return <Feed posts={posts} />;
};
export default ProfileFeed;
