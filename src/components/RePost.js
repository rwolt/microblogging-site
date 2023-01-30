import React from "react";
import { FaRetweet } from "react-icons/fa";
import { Flex } from "./styled/Flex.styled";
import { v4 as uuidv4 } from "uuid";
import PostCard from "./PostCard";
import { StyledRepost } from "./styled/StyledRepost.styled";
import { AiFillPropertySafety } from "react-icons/ai";

const RePost = ({
  id,
  post,
  repostDisplayName,
  liked,
  reposted,
  commented,
  repostCount,
  likeCount,
  commentCount,
  handleLike,
  handleReply,
  postMessage,
}) => {
  return (
    <StyledRepost>
      <Flex
        alignItems="center"
        justifyContent="flex-start"
        padding="10px 11px 0 11px"
      >
        <FaRetweet id="repost-icon" />
        {repostDisplayName} reposted
      </Flex>
      <PostCard
        id={id}
        post={post}
        profilePicURL={post.profilePicURL}
        user={post.user}
        userHandle={post.userHandle}
        displayName={post.displayName}
        timestamp={post.timestamp}
        message={post.message}
        image={post.image}
        liked={liked}
        reposted={reposted}
        commented={commented}
        likeCount={likeCount}
        commentCount={commentCount}
        repostCount={repostCount}
        handleLike={handleLike}
        handleReply={handleReply}
        postMessage={postMessage}
      />
    </StyledRepost>
  );
};

export default RePost;
