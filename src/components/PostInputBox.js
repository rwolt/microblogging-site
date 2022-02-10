import React from "react";
import { Flex } from "./styled/Flex.styled";
import { Input } from "./styled/Input.styled";
import { Button } from "./styled/Button.styled";
import { ProfileImage } from "./styled/ProfileImage.styled";

const PostInputBox = (props) => {
  return (
    <div>
      <Flex>
        <ProfileImage src={props.user.photoURL} />
        <Input type="text" placeholder="What's happening?" />
      </Flex>
      <Flex justifyContent="flex-end">
        <Button>Post</Button>
      </Flex>
    </div>
  );
};
export default PostInputBox;
