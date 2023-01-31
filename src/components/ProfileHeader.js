import React from "react";
import format from "date-fns/format";
import { FaCalendar } from "react-icons/fa";
import { MdAddPhotoAlternate } from "react-icons/md";
import { Flex } from "./styled/Flex.styled";
import { StyledProfileHeader } from "./styled/StyledProfileHeader.styled";
import { ProfileHeaderImage } from "./styled/ProfileHeaderImage.styled";
import { ProfileImage } from "./styled/ProfileImage.styled";
import ProfileBar from "./ProfileBar";
import { resizeImage } from "../utils/resizeImage";

const ProfileHeader = (props) => {
  return (
    <StyledProfileHeader>
      <ProfileHeaderImage headerImage={props.user.headerImage}>
        {props.currentUser.uid === props.user.uid ? (
          <label className="custom-file-upload">
            <input
              type="file"
              onChange={(e) => {
                resizeImage(e.target.files[0], 600).then((resized) =>
                  props.handleImageChange("header", resized)
                );
              }}
            />
            <MdAddPhotoAlternate id="add-photo-icon" />
          </label>
        ) : (
          ""
        )}
      </ProfileHeaderImage>
      <ProfileImage
        id="profile-image"
        src={props.user.photoURL}
        position="relative"
        margin="0 0 -60px 0"
      />
      <Flex
        id="user-bio"
        alignItems="flex-start"
        justifyContent="flex-start"
        flexDirection="column"
      >
        <h2>{props.user.name}</h2>
        <p>{props.user.userHandle}</p>
        <Flex justifyContent="flex-start" padding="0">
          <FaCalendar id="calendar-icon" />
          <p>{`Joined ${props.user.dateJoined}
          `}</p>
        </Flex>
      </Flex>
      <ProfileBar
        profileFeed={props.profileFeed}
        setProfileFeed={props.setProfileFeed}
      />
    </StyledProfileHeader>
  );
};

export default ProfileHeader;
