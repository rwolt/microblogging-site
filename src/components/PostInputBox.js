import React from "react";
import { Flex } from "./styled/Flex.styled";
import { Input } from "./styled/Input.styled";
import { Button } from "./styled/Button.styled";
import { ProfileImage } from "./styled/ProfileImage.styled";

const PostInputBox = (props) => {
  return (
    <Flex>
      <ProfileImage />
      <p>{props.user.displayName}</p>
      <Input type="text" placeholder="What's happening?" />
      <Button>Post</Button>
    </Flex>
  );
};
export default PostInputBox;
