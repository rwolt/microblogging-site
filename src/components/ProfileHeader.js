import React from "react";
import format from "date-fns/format";
import { FaCalendar } from "react-icons/fa";
import { Flex } from "./styled/Flex.styled";
import { StyledProfileHeader } from "./styled/StyledProfileHeader.styled";
import { ProfileHeaderImage } from "./styled/ProfileHeaderImage.styled";
import { ProfileImage } from "./styled/ProfileImage.styled";
import ProfileBar from "./ProfileBar";

const ProfileHeader = (props) => {
  return (
    <StyledProfileHeader>
      <ProfileHeaderImage />
      <ProfileImage
        src={props.user.photoURL}
        position="relative"
        width="100px"
        height="100px"
        margin="0 0 -60px 0"
      />
      <Flex
        alignItems="flex-start"
        justifyContent="flex-start"
        flexDirection="column"
      >
        <h2>{props.user.name}</h2>
        <Flex justifyContent="flex-start" padding="0">
          <FaCalendar />
          <p>{`Joined ${props.user.dateJoined}
          `}</p>
        </Flex>
      </Flex>
      <ProfileBar
        profileFeed={props.profileFeed}
        setProfileFeed={props.setProfileFeed}
        setLoadingMessage={props.setLoadingMessage}
      />
    </StyledProfileHeader>
  );
};

export default ProfileHeader;
