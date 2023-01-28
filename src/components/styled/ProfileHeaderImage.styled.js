import styled from "styled-components";

export const ProfileHeaderImage = styled.div`
  width: 100%;
  height: 200px;
  background: center url(${({ headerImage }) => headerImage});
  position: relative;

  input[type="file"] {
    display: none;
  }

  .custom-file-upload {
    display: none;
  }

  &:hover > .custom-file-upload {
    display: block;
    cursor: pointer;
    position: absolute;
    bottom: 0;
    right: 0;
    font-size: 32px;
    margin: 5px;
    color: lightgreen;
  }
`;
