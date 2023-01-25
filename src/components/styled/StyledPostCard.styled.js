import styled from "styled-components";
import { devices } from "./devices";

export const StyledPostCard = styled.div`
  display: flex;
  padding: 10px;
  align-items: flex-start;
  border-bottom: 1px solid #e5e5e5;

  &:hover {
    cursor: pointer;
    background-color: #f5f5f5;
  }
`;
