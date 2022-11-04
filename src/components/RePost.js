import React from "react";
import { FaRetweet } from "react-icons/fa";
import { Flex } from "./styled/Flex.styled";
import { v4 as uuidv4 } from "uuid";
import PostCard from "./PostCard";

const RePost = ({
  post,
  retweetDisplayName,
  liked,
  retweeted,
  handleLike,
  handleReply,
}) => {
  return (
    <div>
      <Flex alignItems="center" justifyContent="flex-start">
        <FaRetweet />
        {retweetDisplayName} reposted
      </Flex>
      <PostCard
        // id={post.id}
        post={post}
        profilePicURL={post.profilePicURL}
        user={post.user}
        displayName={post.displayName}
        timestamp={post.timestamp}
        message={post.message}
        liked={liked}
        retweeted={retweeted}
        likeCount={post.likeCount}
        handleLike={handleLike}
        handleReply={handleReply}
      />
    </div>
  );
};

export default RePost;
