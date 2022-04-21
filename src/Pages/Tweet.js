import React from "react";
import { useParams } from "react-router-dom";

function Tweet() {
  const params = useParams();
  return <div>{params.postId}</div>;
}

export default Tweet;
