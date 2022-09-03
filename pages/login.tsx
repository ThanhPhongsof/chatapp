import Button from "@mui/material/Button";
import Head from "next/head";
import Image from "next/image";
import styled from "styled-components";
import WhatsAppLogo from "../assets/whatsapplogo.png";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { auth } from "../src/config/firebase";

const StyledContainer = styled.div`
  height: 100vh;
  display: grid;
  place-items: center;
  background: whitesmoke;
`;

const StyledLoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 100px;
  background: #fff;
  border-radius: 5px;
  box-shadow: 0 10px 15px -3px rgba(0 0 0 / 0.1),
    0 4px 6px -4px rgb(0 0 0 / 0.1);
`;

const StyledImageWrapper = styled.div`
  margin-bottom: 50px;
`;

const Login = () => {
  const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth);
  const handlerLoginWithGoogle = () => {
    signInWithGoogle();
  };

  return (
    <StyledContainer>
      <Head>
        <title>Login</title>
      </Head>

      <StyledLoginContainer>
        <StyledImageWrapper>
          <Image
            src={WhatsAppLogo}
            alt="Whatsapp Logo"
            height="200px"
            width="200px"
          />
        </StyledImageWrapper>
        <Button variant="outlined" onClick={handlerLoginWithGoogle}>
          Sign in with Google
        </Button>
      </StyledLoginContainer>
    </StyledContainer>
  );
};

export default Login;
