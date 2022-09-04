import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import styled from "styled-components";
import ChatIcon from "@mui/icons-material/Chat";
import MoreVerticalIcon from "@mui/icons-material/MoreVert";
import LogoutIcon from "@mui/icons-material/Logout";
import SearchIcon from "@mui/icons-material/Search";
import Button from "@mui/material/Button";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";

const StyledContainer = styled.div`
  height: 100vh;
  min-width: 300px;
  max-width: 350px;
  overflow-y: scroll;
  border-right: 1px solid whitesmoke;
`;

const StyledHeader = styled.div`
  position: sticky;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  height: 80px;
  border-bottom: 1px solid whitesmoke;
  top: 0;
  background: #fff;
  z-index: 1;
`;

const StyledSearch = styled.div`
  display: flex;
  align-items: center;
  padding: 15px;
  border-radius: 12px;
`;

const StyledSearchInput = styled.input`
  outline: none;
  border: none;
  flex: 1;
`;

const StyledUserAvatar = styled(Avatar)`
  cursor: pointer;
  :hover {
    opacity: 0.8;
  }
`;

const StyledSidebarButton = styled(Button)`
  width: 100%;
  border-top: 1px solid whitesmoke;
  border-bottom: 1px solid whitesmoke;
`;

const Sidebar = () => {
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.log("ERROR LOGGING OUT", error);
    }
  };

  return (
    <StyledContainer>
      <StyledHeader>
        <Tooltip title="USER EMAIL" placement="right">
          <StyledUserAvatar src="" />
        </Tooltip>
        <div>
          <IconButton>
            <ChatIcon />
          </IconButton>
          <IconButton>
            <MoreVerticalIcon />
          </IconButton>
          <IconButton onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </div>
      </StyledHeader>
      <StyledSearch>
        <SearchIcon />
        <StyledSearchInput placeholder="Search in conversation" />
      </StyledSearch>
      <StyledSidebarButton>Start a new conversation</StyledSidebarButton>

      {/* List of conversation */}
    </StyledContainer>
  );
};

export default Sidebar;
