import React from "react";
import styled from "styled-components";

export const Flex = styled.div`
  display: flex;
  width: ${({ width }) => width || "100%"};
  flex-direction: ${({ flexDirection }) => flexDirection || "row"};
  align-items: ${({ alignItems }) => alignItems || "center"};
  justify-content: ${({ justifyContent }) => justifyContent || "center"};
  padding: ${({ padding }) => padding || "10px"};
`;
