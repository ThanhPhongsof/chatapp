import CircularProgress from "@mui/material/CircularProgress";
import Image from "next/image";
import styled from "styled-components";
import WhatsAppLogo from "../../assets/whatsapplogo.png";

const StyledLoading = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const StyledImageWrapper = styled.div`
  margin-bottom: 50px;
`;

const Loading = () => {
  return (
    <StyledLoading>
      <StyledImageWrapper>
        <Image
          src={WhatsAppLogo}
          alt="Whatsapp Logo"
          height="200px"
          width="200px"
        />
      </StyledImageWrapper>

      <CircularProgress />
    </StyledLoading>
  );
};

export default Loading;
