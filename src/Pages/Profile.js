import React, { useEffect, useState } from "react";
import format from "date-fns/format";
import Header from "../components/Header";
import ProfileHeader from "../components/ProfileHeader";
import ProfileFeed from "../components/ProfileFeed";
import AuthPopup from "../components/AuthPopup";
import { Container } from "../components/styled/Container.styled";
import { useParams } from "react-router-dom";

const Profile = (props) => {
  const [user, setUser] = useState("");
  const [profileFeed, setProfileFeed] = useState("");
  const params = useParams();
  useEffect(() => {
    const getUserInfo = async (uid) => {
      const userDoc = await props.getUserInfo(uid);
      setUser({
        ...userDoc,
        dateJoined: format(userDoc.dateJoined.toDate(), "MMMM yyyy"),
      });
    };
    getUserInfo(params.uid);
  }, [params.uid, props.currentUser.headerImage]);

  return (
    <Container>
      <Header
        pageTitle={user.name}
        setShowPopup={props.setShowPopup}
        setShowRegisterForm={props.setShowRegisterForm}
        handleLogout={props.handleLogout}
        user={props.currentUser}
      />
      <ProfileHeader
        handleImageChange={props.handleImageChange}
        currentUser={props.currentUser}
        user={user}
        profileFeed={profileFeed}
        setProfileFeed={setProfileFeed}
      />
      <ProfileFeed
        getProfilePosts={props.getProfilePosts}
        profileFeed={profileFeed}
        setProfileFeed={setProfileFeed}
        user={user}
        posts={props.posts}
        setPosts={props.setPosts}
        checkLiked={props.checkLiked}
        checkReposted={props.checkReposted}
        checkCommented={props.checkCommented}
        handleLike={props.handleLike}
        handleReply={props.handleReply}
      />
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
