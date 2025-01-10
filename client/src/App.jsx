import { Box } from "@chakra-ui/react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CodeEditor from "./components/CodeEditor";
import ProblemList from "./components/Problems/ProblemList";
import ProblemDetail from "./components/Problems/ProblemDetail";
import Navbar from "./components/Navbar";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Leaderboard from "./components/Leaderboard.jsx";

function App() {
  return (
    <BrowserRouter>
      <Box minH="100vh" bg="#0f0a19" color="gray.500">
        <Navbar />
        <Box px={6} py={8}>
          <Routes>
            <Route path="/" element={<ProblemList />} />
            <Route path="/playground" element={<CodeEditor />} />
            <Route path="/problem/:id" element={<ProblemDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
          </Routes>
        </Box>
      </Box>
    </BrowserRouter>
  );
}

export default App;
