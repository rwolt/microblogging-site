import styled from "styled-components";

export const StyledBigInteractionBar = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-around;
  padding: 10px 0;
  border-bottom: 1px solid #e5e5e5;

  .big-icon {
    width: 20px;
    height: 20px;
  }

  .liked {
    color: #289d8c;
  }

  svg:hover {
    cursor: pointer;
  }
`;
