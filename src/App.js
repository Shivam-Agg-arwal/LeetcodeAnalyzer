import { Route, Routes } from "react-router-dom";
import "./App.css";
import Signup from "./components/authentication/Signup";
import Navbar from "./components/common/Navbar";
import { useSelector } from "react-redux";
import VerifyOtp from "./components/authentication/VerifyOtp";
import Login from "./components/authentication/Login";
import AnalysisPage from "./components/main/AnalysisPage";
import ManagePage from "./components/main/ManagePage";
import ForgotPassword from "./components/authentication/ForgotPassword";
import Mover from "./components/common/Mover";
import Footer from "./components/common/Footer";

function App() {
    const { user } = useSelector((state) => state.profile);

    return (
        <div className="App bg-white min-h-screen flex flex-col">
            {user && <Navbar />}
            <main className="flex-grow">
                <Routes>
                    {/* Routes for unauthenticated users */}
                    {!user && (
                        <>
                            <Route path="/signup" element={<Signup />} />
                            <Route path="/verifyotp" element={<VerifyOtp />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/forgotpassword" element={<ForgotPassword />} />
                        </>
                    )}

                    {/* Routes for authenticated users */}
                    {user && (
                        <>
                            {user.linkedto.length > 0 && <Route path="/stats" element={<AnalysisPage />} />}
                            <Route path="/manage" element={<ManagePage />} />
                        </>
                    )}

                    {/* Fallback route for unknown paths */}
                    <Route path="/*" element={<Mover />} />
                </Routes>
            </main>
            {user && <Footer />}
        </div>
    );
}

export default App;
