import { Route, Routes } from "react-router-dom";
import "./App.css";
import Signup from "./components/authentication/Signup";
import Navbar from "./components/common/Navbar";
import { useSelector } from "react-redux";
import VerifyOtp from "./components/authentication/VerifyOtp";
import Login from "./components/authentication/Login";
import AnalysisPage from "./components/main/AnalysisPage";
import ManagePage from "./components/main/ManagePage";

function App() {
    const {user}=useSelector((state)=>state.profile);

    return (
        <div className="App">
            {user && <Navbar />}
            <Routes>
                <Route path="/signup" element={<Signup />} />
                <Route path="/verifyotp" element={<VerifyOtp />} />
                <Route path="/login" element={<Login />} />
                {user && <Route path="/stats" element={<AnalysisPage />} />}
                {user && <Route path="/manage" element={<ManagePage />} />}
                
            </Routes>
        </div>
    );
}

export default App;
