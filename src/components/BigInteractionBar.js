import React from "react";
import { StyledBigInteractionBar } from "./styled/BigInteractionBar.styled";
import { BigInteractionIcon } from "./styled/BigInteractionIcon.styled";
import { FaRegComment, FaRetweet, FaHeart, FaRegHeart } from "react-icons/fa";

const BigInteractionBar = (props) => {
  return (
    <StyledBigInteractionBar>
      <BigInteractionIcon id="comment">
        <FaRegComment className="big-icon" />
      </BigInteractionIcon>
      <BigInteractionIcon
        id="retweet"
        onClick={(e) => {
          e.stopPropagation();
          props.handleReply(e, props.post);
        }}>
        {props.retweeted ? (
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
        }}>
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
