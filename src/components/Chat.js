import React, { useEffect, useState } from "react";
import { Avatar } from "@material-ui/core";
import "./Chat.css";
import db from "../firebase";
import { Link } from "react-router-dom";
import {
  collection,
  addDoc,
  orderBy,
  query,
  onSnapshot,
} from "firebase/firestore";
import BasicModal from "./Modal";

function Chat({ addNewChat, name, id, roomAvatar, selectedId, onSelect }) {
  const [messages, setMessages] = useState("");
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);

  const clickOutsideModal = () => {
    setOpen(false);
  };
  const handleClose = async (roomName) => {
    setOpen(false);
    if (!roomName || roomName.trim().length === 0) return;
    try {
      const newRoom = await addDoc(collection(db, "rooms"), {
        name: roomName,
        roomAvatar: `https://avatars.dicebear.com/api/human/${Math.floor(
          Math.random() * 5000
        )}.svg`,
        created: new Date(),
      });
      document.getElementById(newRoom.id).click();
      document
        .getElementById(newRoom.id)
        .scrollIntoView({ behavior: "smooth", block: "center" });
    } catch (err) {
      console.log(err);
    }
  };

  /*  useEffect(() => {
    setAvatarSeed(Math.floor(Math.random() * 5000));
  }, []);
 */
  useEffect(() => {
    if (id) {
      const messagesRef = collection(db, "rooms", id, "messages");
      const q = query(messagesRef, orderBy("timestamp", "desc"));
      onSnapshot(q, (snapshot) => {
        setMessages(snapshot.docs.map((doc) => doc.data()));
      });
    }
  }, [id]);

  if (open) {
    return (
      <>
        <div className="sidebarChat new_chat" onClick={handleOpen}>
          <h2>Add new chat</h2>
        </div>
        <BasicModal
          open
          handleClose={handleClose}
          onOutClick={clickOutsideModal}
        />
      </>
    );
  }

  return !addNewChat ? (
    <>
      <Link to={`/rooms/${id}`}>
        <div
          id={id}
          className={`sidebarChat ${selectedId === id ? "selected" : ""}`}
          onClick={() => onSelect(id)}
        >
          <Avatar src={roomAvatar} />
          <div className="sidebarChat_info">
            <h2>{name}</h2>
            <p>{messages[0]?.message}</p>
          </div>
        </div>
      </Link>
    </>
  ) : (
    <div className="sidebarChat new_chat" onClick={handleOpen}>
      <h2>Add new chat</h2>
    </div>
  );
}

export default Chat;
