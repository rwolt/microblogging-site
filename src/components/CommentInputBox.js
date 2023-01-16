import React, { useState } from "react";
import { Flex } from "./styled/Flex.styled";
import { Input } from "./styled/Input.styled";
import { Button } from "./styled/Button.styled";
import { ProfileImage } from "./styled/ProfileImage.styled";
import { UserInfo } from "./styled/UserInfo.styled";

const CommentInputBox = (props) => {
  const [message, setMessage] = useState("");
  return (
    <div style={{ borderBottom: "1px solid #e5e5e5" }}>
      <Flex justifyContent="flex-start">
        <ProfileImage src={props.user.photoURL} />
        <Input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tweet your reply"
        />
        <Button
          id="comment"
          onClick={async (e) => {
            const comment = await props.postMessage(
              e,
              message,
              "comment",
              props.post
            );
            props.setPosts(props.posts.splice(1, 0, comment));
            setMessage("");
          }}
        >
          Reply
        </Button>
      </Flex>
    </div>
  );
};
export default CommentInputBox;
