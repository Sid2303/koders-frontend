import { Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import PublicRoutes from "./routes/PublicRoutes";
import ProtectedRoutes from "./routes/ProtectedRoutes";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {PublicRoutes()}
        {ProtectedRoutes()}
      </Routes>
    </>
  );
}

export default App;
