import React from "react";
import { ProfileImage } from "./styled/ProfileImage.styled";
import { Flex } from "./styled/Flex.styled";

const PostCard = (props) => {
  return (
    <Flex>
      <ProfileImage src={props.profilePic} />
      <p>{props.message}</p>
    </Flex>
  );
};

export default PostCard;
