import React from "react";
import { AiOutlineRetweet, AiOutlineStar, AiFillStar } from "react-icons/ai";
import { FaRegComment, FaRetweet, FaHeart, FaRegHeart } from "react-icons/fa";
import { InteractionIcon } from "./styled/InteractionIcon.styled";
import { StyledInteractionBar } from "./styled/StyledInteractionBar.styled";

const InteractionBar = (props) => {
  return (
    <StyledInteractionBar>
      <InteractionIcon>
        <FaRegComment />
        <p>999</p>
      </InteractionIcon>
      <InteractionIcon>
        <FaRetweet />
        <p>999</p>
      </InteractionIcon>
      <InteractionIcon>
        {props.liked ? <FaHeart /> : <FaRegHeart />}
        <p>{props.post.likeCount}</p>
      </InteractionIcon>
    </StyledInteractionBar>
  );
};

export default InteractionBar;
