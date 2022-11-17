import "./App.css";
import ChatConversation from "./components/ChatConversation";
import Sidebar from "./components/Sidebar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import { useStateValue } from "./StateProvider";

function App() {
  const [{ user }, dispatch] = useStateValue();

  return (
    <div className="app">
      {!user ? (
        <Login />
      ) : (
        <div className="app_body">
          <BrowserRouter>
            <Sidebar />
            <Routes>
              <Route path="/rooms/:roomId" element={<ChatConversation />} />
              <Route path="/" />
            </Routes>
          </BrowserRouter>
        </div>
      )}
    </div>
  );

  /*  return (
    <div className="app">
      <div className="app_body">
        <BrowserRouter>
          <Sidebar />
          <Routes>
            <Route path="/rooms/:roomId" element={<ChatConversation />} />
            <Route path="/" element />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  ); */
}

export default App;
