import React from "react";
import { Flex } from "./styled/Flex.styled";
import { ProfileBarButton } from "./styled/ProfileBarButton.styled";

const ProfileBar = ({ profileFeed, setProfileFeed, setLoadingMessage }) => {
  return (
    <Flex>
      <ProfileBarButton
        onClick={() => {
          setProfileFeed("posts")
          setLoadingMessage('Loading...')}}
        id={profileFeed === "posts" ? "active" : ""}
      >
        Posts
      </ProfileBarButton>
      <ProfileBarButton
        onClick={() => {
          setProfileFeed("posts-replies")
          setLoadingMessage('Loading...')}}
        id={profileFeed === "posts-replies" ? "active" : ""}
      >
        Posts & replies
      </ProfileBarButton>
      <ProfileBarButton
        onClick={() => {
          setProfileFeed("media")
          setLoadingMessage('Loading...')}}
        id={profileFeed === "media" ? "active" : ""}
      >
        Media
      </ProfileBarButton>
      <ProfileBarButton
        onClick={() => {
          setProfileFeed("likes")
          setLoadingMessage('Loading...')}}
        id={profileFeed === "likes" ? "active" : ""}
      >
        Likes
      </ProfileBarButton>
    </Flex>
  );
};

export default ProfileBar;
