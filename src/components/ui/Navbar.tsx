import { Settings, LogOut } from "lucide-react";
import logo from "@/assets/logo.png";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
    const navigate = useNavigate();

    const handleSettings = () => {
        navigate("/setting");
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/auth");
    };

    return (
        <nav className="bg-white shadow-md px-4 py-2 flex items-center justify-between">
            {/* Left - Logo */}
            <div className="flex items-center space-x-2" onClick={() => navigate("/")}>
                <img src={logo} alt="Logo" className="w-10 h-10 rounded-full" />
                <span className="font-bold text-lg">LoveAI</span>
            </div>

            {/* Right - Icons */}
            <div className="flex items-center space-x-4">
                <button
                    onClick={handleSettings}
                    className="p-2 rounded-full hover:bg-gray-100"
                    title="Settings"
                >
                    <Settings className="w-5 h-5 text-gray-700" />
                </button>
                <button
                    onClick={handleLogout}
                    className="p-2 rounded-full hover:bg-gray-100"
                    title="Logout"
                >
                    <LogOut className="w-5 h-5 text-gray-700" />
                </button>
            </div>
        </nav>
    );
}
