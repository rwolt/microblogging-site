import React from "react";
import { format, formatDistance } from "date-fns";
import { StyledPostCard } from "./styled/StyledPostCard.styled";
import { ProfileImage } from "./styled/ProfileImage.styled";
import { Flex } from "./styled/Flex.styled";

const formatTimestamp = (timestamp) => {
  const dateFromTimestamp = timestamp.toDate();
  const now = new Date();
  //If the post is more than 24 hours old, format as DD/MM
  if (now - dateFromTimestamp > 1000 * 3600 * 24) {
    return format(dateFromTimestamp, "MMMdd");
  } else {
    return formatDistance(dateFromTimestamp, now, {
      addSuffix: true,
      includeSeconds: true,
    });
  }
};

const PostCard = ({ post }) => {
  const postDate = formatTimestamp(post.timestamp);
  return (
    <StyledPostCard>
      <ProfileImage src={post.profilePicURL} />
      <Flex flexDirection="column">
        <Flex>
          <p>{post.displayName}</p>
          <p>{postDate}</p>
        </Flex>
        <Flex>
          <p>{post.message}</p>
        </Flex>
      </Flex>
    </StyledPostCard>
  );
};

export default PostCard;
