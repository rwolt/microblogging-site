import React from "react";
import styled from "styled-components";

export const Container = styled.div`
  max-width: 50%;
  border-left: 1px solid #333;
  border-right: 1px solid #333;
  height: 100vh;
  margin: auto;
  position: relative;

  & > div {
    border-bottom: 1px solid black;
  }

  & > div:last-child {
    border-bottom: none;
  }
`;
