import IconButton from "@mui/material/IconButton";
import styled from "styled-components";
import { Conversation, IMessage } from "../../types";
import {
  convertFirestoreTimestampToString,
  generateQueryGetMessages,
  transformMessage,
} from "../../utils/getMessageInConversation";
import { useRecipient } from "../hooks/useRecipient";
import RecipientAvatar from "./RecipientAvatar";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../config/firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import Message from "./Message";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import SendIcon from "@mui/icons-material/Send";
import MicIcon from "@mui/icons-material/Mic";
import {
  KeyboardEventHandler,
  MouseEventHandler,
  useRef,
  useState,
} from "react";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

type ConversationScreenProps = {
  conversation: Conversation;
  messages: IMessage[];
};

const StyledRecipientHeader = styled.div`
  position: sticky;
  background: #fff;
  z-index: 100;
  top: 0;
  display: flex;
  align-items: center;
  padding: 11px;
  height: 80px;
  border-bottom: 1px solid whitesmoke;
`;

const StyledHeaderInfo = styled.div`
  flex-grow: 1;

  > h3 {
    margin-top: 0;
    margin-bottom: 3px;
  }
  > span {
    font-size: 14px;
    color: gray;
  }
`;

const StyledH3 = styled.h3`
  word-break: break-all;
`;

const StyledHeaderIcons = styled.div`
  display: flex;
`;

const StyledMessageContainer = styled.div`
  padding: 30px;
  background: #e5ded8;
  min-height: 90vh;
`;

const StyledInputContainer = styled.form`
  display: flex;
  align-items: center;
  padding: 10px;
  position: sticky;
  bottom: 0;
  background: #fff;
  z-index: 100;
`;

const StyledInput = styled.input`
  flex-grow: 1;
  outline: none;
  border: none;
  border-radius: 10px;
  background: whitesmoke;
  padding: 15px;
  margin-left: 15px;
  margin-right: 15px;
`;

const EndOfMessagesForAutoScroll = styled.div`
  margin-bottom: 30px;
`;

const ConversationScreen = ({
  conversation,
  messages,
}: ConversationScreenProps) => {
  const [newMessage, setNewMessage] = useState("");
  const [loggedInUser, _loading, _error] = useAuthState(auth);

  const conversationUsers = conversation.users;
  const { recipientEmail, recipient } = useRecipient(conversationUsers);

  const router = useRouter();
  const conversationId = router.query.id;

  // get all messages between logged in user and recipient in this conversation
  const queryGetMessages = generateQueryGetMessages(conversationId as string);
  const [messagesSnapshot, messagesLoading, __error] =
    useCollection(queryGetMessages);

  const handleShowMessages = () => {
    // if front-end is loading message behind the screen, display messages retrieved from Next SSR
    // (passed down from [id].tsx)
    if (messagesLoading) {
      return messages.map((mess, index) => (
        <Message key={mess.id} message={mess} />
      ));
    }

    // if front-end has finished loading messages, so now I have messagesSnapshot
    if (messagesSnapshot) {
      return messagesSnapshot.docs.map((mess, index) => (
        <Message key={mess.id} message={transformMessage(mess)} />
      ));
    }
    return null;
  };

  const addMessageToDbAndUpdateLastSeen = async () => {
    // update last seen in "users" collection
    try {
      await setDoc(
        doc(db, "users", loggedInUser?.email as string),
        {
          lastSeen: serverTimestamp(),
        },
        { merge: true }
      ); // just update what is changed

      // add new message to "messages" collection
      await addDoc(collection(db, "messages"), {
        conversation_id: conversationId,
        sent_at: serverTimestamp(),
        text: newMessage,
        user: loggedInUser?.email,
      });

      // reset input field
      setNewMessage("");

      // scroll to bottom
      scrollToBottom();
    } catch (err: any) {
      console.log("error", err);
    }
  };

  const handleSendMessageOnEnter: KeyboardEventHandler<HTMLInputElement> = (
    e
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (!newMessage) return;
      addMessageToDbAndUpdateLastSeen();
    }
  };

  const handleSendMessageOnClick: MouseEventHandler<HTMLButtonElement> = (
    e
  ) => {
    e.preventDefault();
    if (!newMessage) return;
    addMessageToDbAndUpdateLastSeen();
  };

  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <StyledRecipientHeader>
        <RecipientAvatar
          recipient={recipient}
          recipientEmail={recipientEmail}
        />
        <StyledHeaderInfo>
          <StyledH3>{recipient?.email}</StyledH3>
          {recipient && (
            <span>
              Last active:{" "}
              {convertFirestoreTimestampToString(recipient.lastSeen)}
            </span>
          )}
        </StyledHeaderInfo>

        <StyledHeaderIcons>
          <IconButton>
            <AttachFileIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </StyledHeaderIcons>
      </StyledRecipientHeader>

      <StyledMessageContainer>
        {handleShowMessages()}
        {/* for auto scroll to the end when a new  message is sent */}
        <EndOfMessagesForAutoScroll ref={endOfMessagesRef} />
      </StyledMessageContainer>

      {/* Enter new message */}
      <StyledInputContainer>
        <InsertEmoticonIcon />
        <StyledInput
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleSendMessageOnEnter}
        />
        <IconButton onClick={handleSendMessageOnClick} disabled={!newMessage}>
          <SendIcon />
        </IconButton>
        <IconButton>
          <MicIcon />
        </IconButton>
      </StyledInputContainer>
    </>
  );
};

export default ConversationScreen;
