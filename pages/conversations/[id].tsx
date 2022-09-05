import { doc, getDoc, getDocs } from "firebase/firestore";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components";
import ConversationScreen from "../../src/components/ConversationScreen";
import Sidebar from "../../src/components/Sidebar";
import { auth, db } from "../../src/config/firebase";
import { Conversation, IMessage } from "../../types";
import {
  generateQueryGetMessages,
  transformMessage,
} from "../../utils/getMessageInConversation";
import { getRecipientEmail } from "../../utils/getRecipientEmail";

const StyledContainer = styled.div`
  display: flex;
`;

const StyledConversationContainer = styled.div`
  flex-grow: 1;
  overflow: scroll;
  height: 100vh;
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

interface ConversationProps {
  conversation: Conversation;
  messages: IMessage[];
}

const Conversation = ({ conversation, messages }: ConversationProps) => {
  const [loggedInUser] = useAuthState(auth);

  return (
    <StyledContainer>
      <Head>
        <title>
          Conversation with{" "}
          {getRecipientEmail(conversation.users, loggedInUser)}
        </title>
      </Head>
      <Sidebar />

      <StyledConversationContainer>
        <ConversationScreen conversation={conversation} messages={messages} />
      </StyledConversationContainer>
      {/* {messages?.map((mess, index) => (
        <p key={index}>{JSON.stringify(mess)}</p>
      ))} */}
    </StyledContainer>
  );
};

export default Conversation;

export const getServerSideProps: GetServerSideProps<
  ConversationProps,
  { id: string }
> = async (context) => {
  const conversationId = context.params?.id;

  // get conversation, to know who we are chatting with
  const conversationRef = doc(db, "conversations", conversationId as string);
  const conversationSnapshot = await getDoc(conversationRef);

  // get all messages between logged in user and recipient in this conversation
  const queryMessages = generateQueryGetMessages(conversationId);
  const messagesSnapshot = await getDocs(queryMessages);

  const messages = messagesSnapshot.docs.map((messageDoc) =>
    transformMessage(messageDoc)
  );

  return {
    props: {
      conversation: conversationSnapshot.data() as Conversation,
      messages,
    },
  };
};
