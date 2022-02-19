import React, { useEffect } from "react";
import { Flex } from "./styled/Flex.styled";
import PostCard from "./PostCard";

const ProfileFeed = (props) => {
  const { profileFeed, user, getProfilePosts, setPosts } = props;

  useEffect(() => {
    props.setProfileFeed("posts");
  }, []);

  useEffect(() => {
    console.log("rerender effect hook");
    let active = true;
    const fetchData = async () => {
      const data = await getProfilePosts(profileFeed, user.uid);
      if (active) {
        setPosts(data);
      }
    };
    fetchData();
    return () => {
      active = false;
    };
  }, [profileFeed, user]);

  const Feed = (props) => {
    return (
      <div>
        {props.posts.length > 0 ? (
          props.posts.map((post) => {
            return (
              <PostCard
                post={post}
                key={post.id}
                liked={props.checkLiked(post.id)}
                handleLike={props.handleLike}
              />
            );
          })
        ) : (
          <Flex>There's nothing here yet</Flex>
        )}
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
