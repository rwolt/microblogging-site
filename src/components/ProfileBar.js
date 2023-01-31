import React from "react";
import { Flex } from "./styled/Flex.styled";
import { ProfileBarButton } from "./styled/ProfileBarButton.styled";

const ProfileBar = ({ profileFeed, setProfileFeed }) => {
  return (
    <Flex style={{ padding: "10px 15px 10px 16px" }}>
      <ProfileBarButton
        onClick={() => {
          setProfileFeed("posts");
        }}
        id={profileFeed === "posts" ? "active" : ""}
      >
        Posts
      </ProfileBarButton>
      <ProfileBarButton
        onClick={() => {
          setProfileFeed("posts-replies");
        }}
        id={profileFeed === "posts-replies" ? "active" : ""}
      >
        Posts & replies
      </ProfileBarButton>
      <ProfileBarButton
        onClick={() => {
          setProfileFeed("media");
        }}
        id={profileFeed === "media" ? "active" : ""}
      >
        Media
      </ProfileBarButton>
      <ProfileBarButton
        onClick={() => {
          setProfileFeed("likes");
        }}
        id={profileFeed === "likes" ? "active" : ""}
      >
        Likes
      </ProfileBarButton>
    </Flex>
  );
};

export default ProfileBar;
