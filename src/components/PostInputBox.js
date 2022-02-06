import React from "react";
import { Flex } from "./styled/Flex.styled";
import { Input } from "./styled/Input.styled";
import { Button } from "./styled/Button.styled";
import { ProfileImage } from "./styled/ProfileImage.styled";

const PostInputBox = () => {
  return (
    <Flex>
      <ProfileImage />
      <Input type="text" placeholder="What's happening?" />
      <Button>Post</Button>
    </Flex>
  );
};
export default PostInputBox;
