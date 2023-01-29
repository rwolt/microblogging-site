import styled from "styled-components";

export const InteractionIcon = styled.div`
  display: flex;
  width: 30%;
  justify-content: center;
  align-items: center;

  &:hover {
    color: #289d8c;
  }

  & > p {
    margin: 0 0 0 5px;
  }

  &#retweet {
    color: ${({ reposted }) => (reposted ? "#289d8c" : "#000")};
  }

  &#like {
    color: ${({ liked }) => (liked ? "#289d8c" : "#000")};
  }

  &#comment {
    color: ${({ commented }) => (commented ? "#289d8c" : "#000")};
  }

  &#add-photo-button {
    width: 24px;
    font-size: 24px;
    margin: 0 10px;
  }

  &#add-photo-button:hover {
    color: #289d8c;
    cursor: pointer;
  }
`;
