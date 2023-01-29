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
  image,
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
      <Flex
        flexDirection="row"
        width="100%"
        margin="auto"
        padding="5px"
        alignItems="flex-start"
        height="30px"
        style={{ overflow: "visible" }}
      >
        <ProfileImage
          src={profilePicURL}
          padding="5px"
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
        <Flex
          justifyContent="flex-end"
          padding="5px 10px"
          alignItems="flex-start"
        >
          <span id="post-time">
            {format(timestamp.toDate(), "h:mm b")}
            <BsDot />
          </span>
          <span id="post-full-date">
            {format(timestamp.toDate(), "MMM do yyyy")}
          </span>
          <span id="post-short-date" style={{ display: "none" }}>
            {format(timestamp.toDate(), "MMM do")}
          </span>
        </Flex>
      </Flex>
      <Flex
        margin="0 0 0 60px"
        padding="0 10px 10px 10px"
        flexDirection="column"
        width="calc(100% - 60px)"
        alignItems="flex-start"
      >
        <p style={{ padding: "0" }}>{message}</p>
        {image ? (
          <img
            src={image}
            style={{
              alignSelf: "flex-end",
              paddingRight: "5px",
              width: "100%",
            }}
          />
        ) : (
          ""
        )}
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
