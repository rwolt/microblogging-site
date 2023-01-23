import React from "react";
import { FaRetweet } from "react-icons/fa";
import { Flex } from "./styled/Flex.styled";
import { v4 as uuidv4 } from "uuid";
import PostCard from "./PostCard";
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
    <div>
      <Flex alignItems="center" justifyContent="flex-start">
        <FaRetweet />
        {repostDisplayName} reposted
      </Flex>
      <PostCard
        id={id}
        post={post}
        profilePicURL={post.profilePicURL}
        user={post.user}
        displayName={post.displayName}
        timestamp={post.timestamp}
        message={post.message}
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
    </div>
  );
};

export default RePost;
