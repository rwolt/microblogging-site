import React from "react";
import styled from "styled-components";

export const Flex = styled.div`
  display: flex;
  width: ${({ width }) => width || "100%"};
  height: ${({ height }) => height || "100%"};
  flex-direction: ${({ flexDirection }) => flexDirection || "row"};
  align-items: ${({ alignItems }) => alignItems || "center"};
  justify-content: ${({ justifyContent }) => justifyContent || "center"};
  padding: ${({ padding }) => padding || "10px"};
  margin: ${({ margin }) => margin || "0"};

  & > p {
    padding: 5px;
    margin: 0px;
  }
`;
