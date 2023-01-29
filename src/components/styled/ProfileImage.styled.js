import React from "react";
import styled from "styled-components";

export const ProfileImage = styled.img`
  width: ${({ width }) => width || "60px"};
  height: ${({ height }) => height || "60px"};
  background-color: white;
  border: 2px solid white;
  border-radius: 20%;
  padding: ${({ padding }) => padding || "5px"};
  position: ${({ position }) => position || "static"};
  margin: ${({ margin }) => margin || "0"};
  left: 50px;
  bottom: 50px;

  :hover {
    cursor: pointer;
  }
`;
