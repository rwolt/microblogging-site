import React from "react";
import { AiOutlineRetweet, AiOutlineStar, AiFillStar } from "react-icons/ai";
import { FaRegComment, FaRetweet, FaHeart, FaRegHeart } from "react-icons/fa";
import { InteractionIcon } from "./styled/InteractionIcon.styled";
import { StyledInteractionBar } from "./styled/StyledInteractionBar.styled";

const InteractionIcons = (props) => {
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
        <FaRegHeart />
        <p>999</p>
      </InteractionIcon>
    </StyledInteractionBar>
  );
};

export default InteractionIcons;
