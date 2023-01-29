import React from "react";
import { useLocation } from "react-router-dom";
import {
  FaRegComment,
  FaRetweet,
  FaHeart,
  FaRegHeart,
  FaComment,
} from "react-icons/fa";
import { InteractionIcon } from "./styled/InteractionIcon.styled";
import { StyledInteractionBar } from "./styled/StyledInteractionBar.styled";

const InteractionBar = (props) => {
  const location = useLocation();
  return (
    <StyledInteractionBar>
      <InteractionIcon commented={props.commented} id="comment">
        {props.commented ? <FaComment /> : <FaRegComment />}
        <p>{props.commentCount > 0 ? props.commentCount : ""}</p>
      </InteractionIcon>
      <InteractionIcon
        reposted={props.reposted}
        id="retweet"
        onClick={async (e) => {
          e.stopPropagation();
          await props.handleReply(
            e,
            "repost",
            null,
            props.post,
            location.pathname,
            props.id
          );
        }}
      >
        <FaRetweet />
        <p>{props.post.repostCount > 0 ? props.repostCount : ""}</p>
      </InteractionIcon>
      <InteractionIcon
        liked={props.liked}
        id="like"
        onClick={async (e) => {
          e.stopPropagation();
          await props.handleLike(props.post);
        }}
      >
        {props.liked ? <FaHeart /> : <FaRegHeart />}
        <p>{props.likeCount > 0 ? props.likeCount : ""}</p>
      </InteractionIcon>
    </StyledInteractionBar>
  );
};

export default InteractionBar;
