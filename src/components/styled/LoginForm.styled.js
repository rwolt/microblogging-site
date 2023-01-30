import styled from "styled-components";

export const StyledLoginForm = styled.form`
  display: flex;
  flex-direction: column;
  z-index: 100;

  & > input {
    height: 50px;
    outline: none;
    font-size: 20px;
    border: none;
    border-radius: 5px;
    margin-bottom: 15px;
    padding: 10px;
  }
`;
