import React, { useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Flex } from "./styled/Flex.styled";
import { Input } from "./styled/Input.styled";
import { Button } from "./styled/Button.styled";
import { ProfileImage } from "./styled/ProfileImage.styled";
import { StyledCommentInputBox } from "./styled/StyledCommentInputBox.styled";
import { UserInfo } from "./styled/UserInfo.styled";

const CommentInputBox = (props) => {
  const [message, setMessage] = useState("");
  const location = useLocation();
  return (
    <StyledCommentInputBox>
      <Flex justifyContent="flex-start" padding="10px">
        <ProfileImage src={props.user.photoURL} />
        <Input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your reply"
        />
        <Button
          id="comment"
          onClick={async (e) => {
            await props.handleReply(
              e,
              "comment",
              message,
              props.post,
              location.pathname
            );
            setMessage("");
          }}
        >
          Reply
        </Button>
      </Flex>
    </StyledCommentInputBox>
  );
};
export default CommentInputBox;
