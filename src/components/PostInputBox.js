import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Flex } from "./styled/Flex.styled";
import { Input } from "./styled/Input.styled";
import { Button } from "./styled/Button.styled";
import { ProfileImage } from "./styled/ProfileImage.styled";
import { UserInfo } from "./styled/UserInfo.styled";
import { InteractionIcon } from "./styled/InteractionIcon.styled";
import { MdAddPhotoAlternate } from "react-icons/md";
import { resizeImage } from "../utils/resizeImage";

const PostInputBox = (props) => {
  const [message, setMessage] = useState("");
  const [image, setImage] = useState("");

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
      <Flex justifyContent="flex-end" alignItems="center">
        <label>
          <input
            type="file"
            style={{ display: "none" }}
            onChange={(e) => {
              resizeImage(e.target.files[0], 500).then((image) => {
                setImage(image);
              });
            }}
          />
          <InteractionIcon id="add-photo-button">
            <MdAddPhotoAlternate />
          </InteractionIcon>
        </label>
        <Button
          onClick={async (e) => {
            e.stopPropagation();
            setMessage("");
            await props.handlePost(
              e,
              "post",
              message,
              location.pathname,
              image
            );
          }}
        >
          Post
        </Button>
      </Flex>
    </div>
  );
};
export default PostInputBox;
