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
        <p>{props.commentCount}</p>
      </InteractionIcon>
      <InteractionIcon
        retweeted={props.retweeted}
        id="retweet"
        onClick={async (e) => {
          e.stopPropagation();
          await props.postMessage(e, null, "retweet", props.post);
          props.setPosts(await props.getMessages());
        }}
      >
        <FaRetweet />
        <p>{props.post.retweetCount > 0 ? props.retweetCount : ""}</p>
      </InteractionIcon>
      <InteractionIcon
        liked={props.liked}
        id="like"
        onClick={(e) => {
          e.stopPropagation();
          props.handleLike(props.post);
        }}
      >
        {props.liked ? <FaHeart /> : <FaRegHeart />}
        <p>{props.likeCount > 0 ? props.likeCount : ""}</p>
      </InteractionIcon>
    </StyledInteractionBar>
  );
};

export default InteractionBar;
