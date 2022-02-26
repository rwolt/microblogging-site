import React from "react";
import { AiOutlineRetweet, AiOutlineStar, AiFillStar } from "react-icons/ai";
import { FaRegComment, FaRetweet, FaHeart, FaRegHeart } from "react-icons/fa";
import { InteractionIcon } from "./styled/InteractionIcon.styled";
import { StyledInteractionBar } from "./styled/StyledInteractionBar.styled";

const InteractionBar = (props) => {
  return (
    <StyledInteractionBar>
      <InteractionIcon id="comment">
        <FaRegComment />
        <p>999</p>
      </InteractionIcon>
      <InteractionIcon
        id="retweet"
        onClick={(e) => props.handleReply(e, props.post)}
      >
        <FaRetweet />
        <p>{props.retweetCount}</p>
      </InteractionIcon>
      <InteractionIcon onClick={() => props.handleLike(props.post)}>
        {props.liked ? <FaHeart /> : <FaRegHeart />}
        <p>{props.likeCount > 0 ? props.likeCount : ""}</p>
      </InteractionIcon>
    </StyledInteractionBar>
  );
};

export default InteractionBar;
