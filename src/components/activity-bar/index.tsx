import styled from "styled-components";
import { ACTIVITY_BAR_WIDTH } from "../../configs";

const StyledBar = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: ${ACTIVITY_BAR_WIDTH}px;
  height: 100vh;
  border: 1px solid #eee;
  background: #eee;
`;

const ActivityBar = () => {
  return <StyledBar />;
}

export default ActivityBar;
