import { React, useState, useEffect } from "react";
import { Container } from "../components/styled/Container.styled";
import Header from "../components/Header";
import { getDoc } from "firebase/firestore";
import { db } from "../utils/firebase";
import { useParams } from "react-router-dom";

const Tweet = (props) => {
  const params = useParams();
  const [post, setPost] = useState();

  const getPost = async (id) => {
    const doc = await getDoc(db, "posts", id).then((doc) => doc.data());
    console.log(doc);
    return doc;
  };

  useEffect(() => {
    setPost(getPost(params.postId));
  }, []);

  return (
    <Container>
      <Header pageTitle="Tweet" />
    </Container>
  );
};

export default Tweet;
