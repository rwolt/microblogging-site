import React, { useEffect } from "react";
import { Flex } from "./styled/Flex.styled";
import PostCard from "./PostCard";
import RePost from "./RePost";
import { v4 as uuidv4 } from "uuid";

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
            if (post.type == "repost") {
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
                  key={post.id}
                  profileFeed={props.profileFeed}
                  post={post}
                  profilePicURL={post.profilePicURL}
                  user={post.user}
                  displayName={post.displayName}
                  timestamp={post.timestamp}
                  message={post.message}
                  liked={props.checkLiked(post.id)}
                  reposted={props.checkReposted(post.id)}
                  commented={props.checkCommented(post.id)}
                  likeCount={post.likeCount}
                  repostCount={post.repostCount}
                  commentCount={post.commentCount}
                  handleLike={props.handleLike}
                  handleReply={props.handleReply}
                />
              );
            }
          })
        ) : (
          <Flex>{"There's nothing here yet"}</Flex>
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
        checkReposted={props.checkReposted}
        checkCommented={props.checkCommented}
        handleLike={props.handleLike}
        handleReply={props.handleReply}
      />
    );
  }
};
export default ProfileFeed;
