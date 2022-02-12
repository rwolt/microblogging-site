import React from "react";
import styled from "styled-components";

export const Container = styled.div`
  max-width: 700px;
  border-left: 1px solid #e5e5e5;
  border-right: 1px solid #e5e5e5;
  min-height: 100vh;
  height: 100%;
  margin: auto;
  position: relative;

  &:last-child {
    border-bottom: none;
  }
`;
