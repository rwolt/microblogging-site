import React from "react";
import { FaRetweet } from "react-icons/fa";
import { Flex } from "./styled/Flex.styled";
import PostCard from "./PostCard";

const RePost = (props) => {
  return (
    <div>
      <Flex alignItems="center" justifyContent="flex-start">
        <FaRetweet />
        {props.retweetDisplayName} reposted
      </Flex>
      <PostCard
        post={props.post}
        key={props.post.data.id}
        user={props.user}
        profilePicURL={props.profilePicURL}
        displayName={props.displayName}
        timestamp={props.timestamp}
        message={props.message}
        likeCount={props.likeCount}
        retweetCount={props.post.retweetCount}
        liked={props.liked}
        handleLike={props.handleLike}
        handleReply={props.handleReply}
      />
    </div>
  );
};

export default RePost;
