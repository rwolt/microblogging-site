import React from "react";
import InteractionBar from "./InteractionBar";
import { Flex } from "./styled/Flex.styled";
import { StyledTweetStats } from "./styled/TweetStats.styled";

const TweetStats = ({ commentCount, retweetCount, likeCount }) => {
  return (
    <>
      {retweetCount > 0 || likeCount > 0 ? (
        <StyledTweetStats>
          <span className="counter">{commentCount}</span>
          <span>{commentCount === 1 ? "Comment" : "Comments"}</span>
          <span className="counter">{retweetCount}</span>
          <span>{retweetCount === 1 ? "Retweet" : "Retweets"}</span>
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
