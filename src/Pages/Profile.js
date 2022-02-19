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
  }, [params.uid]);

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
      <ProfileFeed
        getProfilePosts={props.getProfilePosts}
        profileFeed={profileFeed}
        user={user}
        posts={props.posts}
        setPosts={props.setPosts}
        checkLiked={props.checkLiked}
        handleLike={props.handleLike}
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
