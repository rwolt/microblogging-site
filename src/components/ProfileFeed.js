import React, { useEffect } from "react";
import { Flex } from "./styled/Flex.styled";
import PostCard from "./PostCard";
import RePost from "./RePost";

const ProfileFeed = (props) => {
  const { profileFeed, user, getProfilePosts, setPosts } = props;

  useEffect(() => {
    props.setProfileFeed("posts");
  }, [user]);

  useEffect(() => {
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
            if (props.profileFeed === "posts-replies") {
              return (
                <RePost
                  retweetDisplayName={user.name}
                  // post={post}
                  // key={post.id}
                  // user={post.user}
                  // profilePicURL={post.data.profilePicURL}
                  // displayName={post.data.displayName}
                  // timestamp={post.data.timestamp}
                  // message={post.data.message}
                  // likeCount={post.data.likeCount}
                  // liked={props.checkLiked(post.data.id)}
                  // handleLike={props.handleLike}
                  // handleReply={props.handleReply}
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
        profileFeed={props.profileFeed}
        checkLiked={props.checkLiked}
        handleLike={props.handleLike}
        handleReply={props.handleReply}
      />
    );
  }
};
export default ProfileFeed;
