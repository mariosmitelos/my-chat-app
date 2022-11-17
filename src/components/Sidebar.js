import React, { useEffect, useMemo, useState } from "react";
import Chat from "./Chat";
import { Avatar, IconButton } from "@material-ui/core";
import SearchIcon from "@mui/icons-material/Search";
import DonutLargeIcon from "@mui/icons-material/DonutLarge";
import ChatIcon from "@mui/icons-material/Chat";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import "./Sidebar.css";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import db from "../firebase";
import { useStateValue } from "../StateProvider";

function Sidebar(props) {
  const [rooms, setRooms] = useState([]);
  const [{ user }, dispatch] = useStateValue();
  const [selectedId, setSelectedId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const displayedChats = useMemo(() => {
    console.log("RUN");
    return rooms.filter((chat) => {
      return chat.data.name.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [rooms, searchQuery]);

  useEffect(() => {
    const q = query(collection(db, "rooms"), orderBy("name", "desc"));
    onSnapshot(q, (snapshot) => {
      setRooms(
        snapshot.docs.map((doc) => {
          return {
            id: doc.id,
            data: doc.data(),
          };
        })
      );
    });
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="sidebar">
      <div className="sidebar_header">
        <Avatar src={user?.photoURL} />
        <div className="sidebar_headerRight">
          <IconButton>
            <DonutLargeIcon />
          </IconButton>
          <IconButton>
            <ChatIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </div>
      </div>
      <div className="sidebar_search">
        <div className="sidebar_searchContainer">
          <SearchIcon />
          <input
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search for a chat"
            type="text"
          />
        </div>
      </div>
      <div className="sidebar_chats">
        <Chat addNewChat />
        {displayedChats.map((room) => (
          <Chat
            key={room.id}
            id={room.id}
            roomAvatar={room.data.roomAvatar}
            name={room.data.name}
            onSelect={(id) => setSelectedId(id)}
            selectedId={selectedId}
          />
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
