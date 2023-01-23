import React from "react";
import { useLocation } from "react-router-dom";
import { StyledBigInteractionBar } from "./styled/BigInteractionBar.styled";
import { BigInteractionIcon } from "./styled/BigInteractionIcon.styled";
import {
  FaRegComment,
  FaRetweet,
  FaHeart,
  FaRegHeart,
  FaComment,
} from "react-icons/fa";

const BigInteractionBar = (props) => {
  const location = useLocation();
  return (
    <StyledBigInteractionBar>
      <BigInteractionIcon id="comment">
        {props.commented ? (
          <FaComment className="big-icon" style={{ color: "#289d8c" }} />
        ) : (
          <FaRegComment className="big-icon" />
        )}
      </BigInteractionIcon>
      <BigInteractionIcon
        id="repost"
        onClick={async (e) => {
          e.stopPropagation();
          await props.handleReply(
            e,
            "repost",
            null,
            props.post,
            location.pathname
          );
        }}
      >
        {props.reposted ? (
          <FaRetweet className="big-icon" style={{ color: "#289d8c" }} />
        ) : (
          <FaRetweet className="big-icon" />
        )}
      </BigInteractionIcon>
      <BigInteractionIcon
        className="big-icon"
        onClick={(e) => {
          e.stopPropagation();
          props.handleLike(props.post);
        }}
      >
        {props.liked ? (
          <FaHeart className="big-icon liked" />
        ) : (
          <FaRegHeart className="big-icon" />
        )}
      </BigInteractionIcon>
    </StyledBigInteractionBar>
  );
};

export default BigInteractionBar;
