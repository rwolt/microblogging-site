import styled from "styled-components";
import { devices } from "./devices";

export const StyledProfileHeader = styled.div`
  position: relative;

  h2 {
    margin: 5px 0;
  }

  p {
    padding: 5px 0;
  }

  #calendar-icon {
    margin-right: 5px;
  }

  #user-bio {
    padding-left: 16px;
  }

  @media ${devices.mobileS} {
    #profile-image {
      width: 80px;
      height: 80px;
    }

    #user-bio {
      font-size: 0.9em;
    }

    #user-bio > h2 {
      font-size: 1.3em;
    }
  }

  @media ${devices.mobileL} {
    #profile-image {
      width: 100px;
      height: 100px;
    }

    #user-bio {
      font-size: 1em;
    }

    #user-bio > h2 {
      font-size: 1.4em;
    }
  }
`;
