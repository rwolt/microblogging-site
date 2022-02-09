import styled from "styled-components";
import button from "../../images/btn_google_signin_light.png";

export const GoogleLoginButton = styled.button`
  border: none;
  background-color: transparent;
  outline: none;
  border-radius: 5px;
  background-image: url(${button});
  background-size: cover;
  background-repeat: no-repeat;
  margin: 0;
  width: 196px;
  height: 46px;
  cursor: pointer;
`;
