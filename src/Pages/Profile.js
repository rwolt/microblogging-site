import React, { useEffect, useState } from "react";
import format from "date-fns/format";
import Header from "../components/Header";
import ProfileHeader from "../components/ProfileHeader";
import {
  UserPosts,
  UserPostsReplies,
  UserMedia,
  UserLikes,
} from "../components/ProfileFeeds";
import AuthPopup from "../components/AuthPopup";
import { Container } from "../components/styled/Container.styled";
import { useParams } from "react-router-dom";

const Profile = (props) => {
  const [user, setUser] = useState("");
  const [profileFeed, setProfileFeed] = useState("posts");
  const params = useParams();
  useEffect(() => {
    const getUserInfo = async (uid) => {
      // console.log(props.getUserInfo(params.uid));
      const userDoc = await props.getUserInfo(uid);
      setUser({
        ...userDoc,
        dateJoined: format(userDoc.dateJoined.toDate(), "MMMM yyyy"),
      });
    };
    getUserInfo(params.uid);
  }, []);

  const renderPageFeed = (profileFeed) => {
    switch (profileFeed) {
      case "posts":
        return (
          <UserPosts
            getProfilePosts={props.getProfilePosts}
            userId={user.uid}
          />
        );
      case "posts-replies":
        return (
          <UserPostsReplies
            posts={props.getProfilePosts(profileFeed, user.uid)}
          />
        );
      case "media":
        return (
          <UserMedia posts={props.getProfilePosts(profileFeed, user.uid)} />
        );
      case "likes":
        return (
          <UserLikes posts={props.getProfilePosts(profileFeed, user.uid)} />
        );
      default:
        return "";
    }
  };

  return (
    <Container>
      <Header
        pageTitle={user.name}
        setShowPopup={props.setShowPopup}
        setShowRegisterForm={props.setShowRegisterForm}
        handleLogout={props.handleLogout}
        user={props.user}
      />
      <ProfileHeader
        user={user}
        profileFeed={profileFeed}
        setProfileFeed={setProfileFeed}
      />
      {renderPageFeed(profileFeed)}
      {props.showPopup ? (
        <AuthPopup
          showRegisterForm={props.showRegisterForm}
          setShowRegisterForm={props.setShowRegisterForm}
          handleLogin={props.handleLogin}
          handleRegister={props.handleRegister}
          setShowPopup={props.setShowPopup}
        />
      ) : (
        ""
      )}
    </Container>
  );
};

export default Profile;
