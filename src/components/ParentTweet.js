import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import TweetStats from "./TweetStats";
import BigInteractionBar from "./BigInteractionBar";
import { StyledParentTweet } from "./styled/StyledParentTweet.styled";
import { UserInfo } from "./styled/UserInfo.styled";
import { Flex } from "./styled/Flex.styled";
import { ProfileImage } from "./styled/ProfileImage.styled";
import { BsDot } from "react-icons/bs";
const ParentTweet = ({
  timestamp,
  profilePicURL,
  user,
  userHandle,
  displayName,
  message,
  post,
  liked,
  reposted,
  commented,
  likeCount,
  repostCount,
  commentCount,
  handleLike,
  handleReply,
}) => {
  const navigate = useNavigate();
  return (
    <StyledParentTweet>
      <Flex flexDirection="row" padding="10px 10px 0 10px">
        <ProfileImage
          src={profilePicURL}
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/users/${user}`);
          }}
        />
        <UserInfo>
          <a
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/users/${user}`);
            }}
          >
            {displayName}
          </a>
          <a
            id="user-handle"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/users/${user}`);
            }}
          >
            {userHandle}
          </a>
        </UserInfo>
      </Flex>
      <p>{message}</p>
      <Flex justifyContent="flex-start" padding=" 5px 19px">
        <span>
          {format(timestamp.toDate(), "h:mm b")}
          <BsDot />
          {format(timestamp.toDate(), "MMM do yyyy")}
        </span>
      </Flex>
      <TweetStats
        commentCount={commentCount}
        repostCount={repostCount}
        likeCount={likeCount}
      />
      <BigInteractionBar
        handleLike={handleLike}
        handleReply={handleReply}
        liked={liked}
        reposted={reposted}
        commented={commented}
        post={post}
      />
    </StyledParentTweet>
  );
};

export default ParentTweet;
