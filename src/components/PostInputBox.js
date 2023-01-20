import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Flex } from "./styled/Flex.styled";
import { Input } from "./styled/Input.styled";
import { Button } from "./styled/Button.styled";
import { ProfileImage } from "./styled/ProfileImage.styled";
import { UserInfo } from "./styled/UserInfo.styled";

const PostInputBox = (props) => {
  const [message, setMessage] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <div style={{ borderBottom: "1px solid #e5e5e5" }}>
      <Flex justifyContent="flex-start">
        <ProfileImage
          src={props.user.photoURL}
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/users/${props.user.uid}`);
          }}
        />
        <Input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="What's happening?"
        />
      </Flex>
      <Flex justifyContent="flex-end">
        <Button
          onClick={async (e) => {
            e.stopPropagation();
            setMessage("");
            await props.handlePost(e, "post", message, location.pathname);
          }}
        >
          Post
        </Button>
      </Flex>
    </div>
  );
};
export default PostInputBox;
