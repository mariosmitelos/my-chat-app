import React from "react";
import EmojiPicker from "emoji-picker-react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import SearchIcon from "@mui/icons-material/Search";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import MicIcon from "@mui/icons-material/Mic";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import { useState, useEffect, useRef } from "react";
import { flushSync } from "react-dom";
import { Avatar, IconButton } from "@material-ui/core";
import { useParams, useNavigate } from "react-router-dom";

import {
  deleteDoc,
  doc,
  onSnapshot,
  collection,
  query,
  orderBy,
  addDoc,
} from "firebase/firestore";
import db from "../firebase";
import "./ChatConversation.css";
import { useStateValue } from "../StateProvider";

function ChatConversation() {
  const [roomAvatar, setAvatar] = useState("");
  const [input, setInput] = useState("");
  const [{ user }, dispatch] = useStateValue();
  const { roomId } = useParams();
  const [roomName, setRoomName] = useState("");
  const [messages, setMessages] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [emojiPicker, setEmojiPicker] = useState(false);
  const messageRef = useRef(null);
  const inputRef = useRef();
  const navigate = useNavigate();

  const myOptions = ["Delete", "Settings"];
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const open = Boolean(anchorEl);

  const handleClose = async (e) => {
    setAnchorEl(null);
    if (e.target.textContent === "Delete") {
      navigate("/");
      await deleteDoc(doc(db, "rooms", roomId));
    }
  };

  useEffect(() => {
    messageRef.current.lastChild?.scrollIntoView();
  });

  useEffect(() => {
    inputRef.current.focus();
    setEmojiPicker(false);
    setInput("");
  }, [roomId]);

  useEffect(() => {
    if (roomId !== "undefined") {
      onSnapshot(doc(db, "rooms", roomId), (snapshot) => {
        setRoomName(snapshot.data()?.name);
        setAvatar(snapshot.data()?.roomAvatar);
      });
      const messagesRef = collection(db, "rooms", roomId, "messages");
      const q = query(messagesRef, orderBy("timestamp", "asc"));

      onSnapshot(q, (snapshot) => {
        setMessages(snapshot.docs.map((doc) => doc.data()));
      });
    }
  }, [roomId]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (input.trim().length !== 0) {
      const messagesRef = collection(db, "rooms", roomId, "messages");
      await addDoc(messagesRef, {
        message: input,
        name: user.displayName,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
    }

    flushSync(() => setInput(""));

    messageRef.current.lastChild.scrollIntoView({
      behaviour: "smooth",
      block: "nearest",
    });
  };

  return (
    <div className="chat_conversation">
      <div className="chat_header">
        <Avatar src={roomAvatar} />
        <div className="chat_headerInfo">
          <h3>{roomName}</h3>
          <p>
            {`Last seen at
            ${new Date(
              messages[messages.length - 1]?.timestamp?.toDate()
            ).toLocaleTimeString()}`}
          </p>
        </div>
        <div className="chat_headerRight">
          <IconButton>
            <SearchIcon />
          </IconButton>
          <IconButton>
            <AttachFileIcon />
          </IconButton>
          <IconButton onClick={handleClick}>
            <MoreVertIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            keepMounted
            onClose={handleClose}
            open={open}
          >
            {myOptions.map((option) => (
              <MenuItem key={option} onClick={handleClose}>
                {option}
              </MenuItem>
            ))}
          </Menu>
        </div>
      </div>
      <div
        onClick={() => setEmojiPicker(false)}
        ref={messageRef}
        className="chat_body"
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`chat_message ${
              message.name === user.displayName ? "chat_sender" : ""
            }`}
          >
            <span className="chat_name">{message.name}</span>
            <div className="chat_text_container">
              <span className="chat_text">{message.message}</span>
              <span className="chat_timestamp">
                {new Date(message.timestamp?.toDate()).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="chat_footer">
        {!emojiPicker ? (
          <InsertEmoticonIcon onClick={() => setEmojiPicker((prev) => !prev)} />
        ) : (
          <>
            <InsertEmoticonIcon
              onClick={() => setEmojiPicker((prev) => !prev)}
            />
            <EmojiPicker
              searchDisabled="true"
              previewConfig={{ showPreview: false }}
              emojiStyle="google"
              onEmojiClick={(e) => setInput((input) => input + e.emoji)}
              height={400}
              width="40%"
            />
          </>
        )}
        <form>
          <input
            ref={inputRef}
            onFocus={() => setEmojiPicker(false)}
            onChange={(e) => setInput(e.target.value)}
            value={input}
            type="text"
            className="message"
            placeholder="Type a message"
          />
          <button onClick={sendMessage} type="submit">
            Send message
          </button>
        </form>
        <MicIcon></MicIcon>
      </div>
    </div>
  );
}

export default ChatConversation;
