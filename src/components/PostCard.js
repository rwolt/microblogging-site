import React from "react";
import { Link, NavLink, useNavigate, useParams } from "react-router-dom";
import { format, formatDistance } from "date-fns";
import { BsDot } from "react-icons/bs";
import { StyledPostCard } from "./styled/StyledPostCard.styled";
import { ProfileImage } from "./styled/ProfileImage.styled";
import { UserInfo } from "./styled/UserInfo.styled";
import { Flex } from "./styled/Flex.styled";
import InteractionBar from "./InteractionBar";

export const formatTimestamp = (timestamp) => {
  const dateFromTimestamp = timestamp.toDate();
  const now = new Date();
  //If the post is more than 24 hours old, format as DD/MM
  if (now - dateFromTimestamp > 1000 * 3600 * 24) {
    return format(dateFromTimestamp, "MMM dd");
  } else {
    return formatDistance(dateFromTimestamp, now, {
      addSuffix: true,
      includeSeconds: true,
    });
  }
};

const PostCard = ({ post }) => {
  const navigate = useNavigate();
  const { uid } = useParams();
  const postDate = formatTimestamp(post.timestamp);
  return (
    <StyledPostCard>
      <ProfileImage src={post.profilePicURL} />
      <Flex
        flexDirection="column"
        alignItems="flex-start"
        padding="0"
        margin=" 0 0 0 10px"
      >
        <UserInfo>
          <NavLink to={`/users/${post.user}`}> {post.displayName}</NavLink>
          <span>
            <BsDot />
            <p>{postDate}</p>
          </span>
        </UserInfo>
        <Flex justifyContent="flex-start" padding="0px">
          <p>{post.message}</p>
        </Flex>
        <InteractionBar />
      </Flex>
    </StyledPostCard>
  );
};

export default PostCard;
