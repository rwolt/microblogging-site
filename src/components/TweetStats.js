import React from "react";
import InteractionBar from "./InteractionBar";
import { Flex } from "./styled/Flex.styled";
import { StyledTweetStats } from "./styled/TweetStats.styled";

const TweetStats = ({ commentCount, repostCount, likeCount }) => {
  return (
    <>
      {repostCount > 0 || likeCount > 0 || commentCount > 0 ? (
        <StyledTweetStats>
          <span className="counter">{commentCount}</span>
          <span>{commentCount === 1 ? "Comment" : "Comments"}</span>
          <span className="counter">{repostCount}</span>
          <span>{repostCount === 1 ? "Retweet" : "Retweets"}</span>
          <span className="counter">{likeCount}</span>
          <span> {likeCount === 1 ? "Like" : "Likes"}</span>
        </StyledTweetStats>
      ) : (
        ""
      )}
    </>
  );
};

export default TweetStats;
