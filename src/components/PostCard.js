import React from "react";
import {
  Link,
  NavLink,
  useNavigate,
  useParams,
  useLocation,
} from "react-router-dom";
import { format, formatDistance } from "date-fns";
import { BsDot } from "react-icons/bs";
import { StyledPostCard } from "./styled/StyledPostCard.styled";
import { ProfileImage } from "./styled/ProfileImage.styled";
import { UserInfo } from "./styled/UserInfo.styled";
import { Flex } from "./styled/Flex.styled";
import InteractionBar from "./InteractionBar";
import { AiFillPropertySafety } from "react-icons/ai";

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

const PostCard = ({
  id,
  timestamp,
  replyType,
  profilePicURL,
  user,
  displayName,
  userHandle,
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
  postMessage,
  setPosts,
  getMessages,
}) => {
  const navigate = useNavigate();
  const { uid } = useParams();
  const postDate = formatTimestamp(timestamp);
  return (
    <StyledPostCard>
      <ProfileImage
        src={profilePicURL}
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/users/${user}`);
        }}
      />
      <Flex
        onClick={(e) => {
          navigate(`/posts/${post.id}`);
        }}
        flexDirection="column"
        alignItems="flex-start"
        padding="0"
      >
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
          <span id="postcard-date">
            <BsDot id="dot-spacer" />
            <span>{postDate}</span>
          </span>
        </UserInfo>
        <Flex
          justifyContent="flex-start"
          padding="0"
          flexDirection="column"
          alignItems="flex-start"
        >
          <p style={{ padding: "0 5px" }}>{message}</p>
          {image ? (
            <img
              src={image}
              style={{
                width: "100%",
                alignSelf: "flex-end",
                padding: "10px 5px 0 0",
              }}
            />
          ) : (
            ""
          )}
        </Flex>
        <InteractionBar
          id={id}
          post={post}
          liked={liked}
          reposted={reposted}
          commented={commented}
          likeCount={likeCount}
          repostCount={repostCount}
          commentCount={commentCount}
          handleLike={handleLike}
          handleReply={handleReply}
          postMessage={postMessage}
          setPosts={setPosts}
          getMessages={getMessages}
        />
      </Flex>
    </StyledPostCard>
  );
};

export default PostCard;
