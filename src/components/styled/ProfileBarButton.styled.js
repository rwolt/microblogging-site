import styled from "styled-components";

export const ProfileBarButton = styled.div`
  color: #555;
  width: 25%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 10px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  border-bottom: 3px solid transparent;

  &#active {
    color: black;
    border-bottom: 3px solid mediumaquamarine;
  }
`;
