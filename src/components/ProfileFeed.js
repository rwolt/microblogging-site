import React, { useEffect, useState } from "react";
import PostCard from "./PostCard";

const ProfileFeed = (props) => {
  useEffect(() => {
    let active = true;
    const fetchData = async () => {
      const data = await props.getProfilePosts(
        props.profileFeed,
        props.user.uid
      );
      if (active) {
        props.setPosts(data);
      }
    };
    fetchData();
    return () => {
      active = false;
    };
  }, [props.profileFeed, props]);

  const Feed = (props) => {
    return (
      <div>
        {props.posts !== []
          ? props.posts.map((post) => {
              return (
                <PostCard
                  post={post}
                  key={post.id}
                  liked={props.checkLiked(post.id)}
                  handleLike={props.handleLike}
                />
              );
            })
          : ""}
      </div>
    );
  };

  if (props.posts) {
    return (
      <Feed
        posts={props.posts}
        checkLiked={props.checkLiked}
        handleLike={props.handleLike}
      />
    );
  }
};
export default ProfileFeed;
