import styled from "styled-components";

export const UserInfo = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;

  & > a {
    text-decoration: none;
    color: black;
    font-weight: bold;
  }

  & > a:hover {
    text-decoration: underline;
    cursor: pointer;
  }

  p,
  & > a {
    margin: 0;
    padding: 5px;
  }

  & > span {
    display: flex;
    margin: 0;
    align-items: center;
    color: #555;
  }
`;
