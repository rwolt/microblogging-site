import { StyledParentTweet } from "./styled/StyledParentTweet.styled";
import { UserInfo } from "./styled/UserInfo.styled";
import { Flex } from "./styled/Flex.styled";
import React from "react";
import { ProfileImage } from "./styled/ProfileImage.styled";
import TweetStats from "./TweetStats";
import { Navigate, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { BsDot } from "react-icons/bs";
const ParentTweet = ({
  timestamp,
  profilePicURL,
  user,
  displayName,
  message,
  post,
  liked,
  likeCount,
  retweetCount,
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
            }}>
            {displayName}
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
      <TweetStats retweetCount={retweetCount} likeCount={likeCount} />
    </StyledParentTweet>
  );
};

export default ParentTweet;
