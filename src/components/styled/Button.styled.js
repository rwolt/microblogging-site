import React from "react";
import styled from "styled-components";

export const Button = styled.button`
  border: none;
  border-radius: 50px;
  margin: 0px;
  width: ${({ width }) => width || "100px"};
  height: 35px;
  padding: 5px;
  background-color: mediumaquamarine;
  color: black;
  font-size: 20px;
  cursor: pointer;
  margin-left: 5px;
`;
