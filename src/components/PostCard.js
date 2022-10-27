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
  timestamp,
  replyType,
  profilePicURL,
  user,
  displayName,
  message,
  post,
  liked,
  retweeted,
  likeCount,
  retweetCount,
  handleLike,
  postMessage,
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
          console.log(replyType);
          if (replyType) {
            navigate(`/posts/${post.id}/${replyType}`);
          } else {
            navigate(`/posts/${post.id}`);
          }
        }}
        flexDirection="column"
        alignItems="flex-start"
        padding="0"
        margin=" 0 0 0 10px"
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
          {/* <NavLink to={`/users/${user}`}> {displayName}</NavLink> */}
          <span>
            <BsDot />
            <p>{postDate}</p>
          </span>
        </UserInfo>
        <Flex justifyContent="flex-start" padding="0px">
          <p>{message}</p>
        </Flex>
        <InteractionBar
          post={post}
          liked={liked}
          retweeted={retweeted}
          likeCount={likeCount}
          retweetCount={retweetCount}
          handleLike={handleLike}
          postMessage={postMessage}
        />
      </Flex>
    </StyledPostCard>
  );
};

export default PostCard;
