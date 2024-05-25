import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Forgot from "./pages/forgot";
import Topiclist from "./pages/topiclist";
import VoiceChat from "./pages/voiceChat";
import Task from "./pages/task";
import Topic from "./pages/topic";
import Mark from "./pages/mark";
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/forgot" element={<Forgot />} />
          <Route path="/topiclist" element={<Topiclist />} />
          <Route path="/topic/:id" element={<Topic type="yet" />} />
          <Route path="/chat/:id" element={<VoiceChat />} />
          <Route path="/preview/:id" element={<Topic type="preview" />} />
          <Route path="/review/:id" element={<Topic type="done" />} />
          <Route path="/mark/:id" element={<Mark />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;


