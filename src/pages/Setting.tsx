import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "@/utils/constant";

interface User {
    _id: string;
    username: string;
    email: string;
}

export default function Settings() {
    const [user, setUser] = useState<User | null>(null);
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [showConfirm, setShowConfirm] = useState(false);
    // Fetch user profile on mount
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) return navigate("/auth");

                const res = await fetch(`${BASE_URL}/auth/profile`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!res.ok) throw new Error("Failed to fetch profile");
                const data = await res.json();
                setUser(data);
                setName(data.username || "");
            } catch (err: any) {
                toast.error(err.message || "Failed to fetch profile");
            }
        };
        fetchProfile();
    }, [navigate]);

    const handleUpdate = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${BASE_URL}/auth/profile/${user._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ name }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to update profile");

            toast.success(data.message);
            setUser({ ...user, username: name });
        } catch (err: any) {
            toast.error(err.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };
    const handleDelete = () => setShowConfirm(true);

    const confirmDelete = async () => {
        if (!user) return;
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${BASE_URL}/auth/delete/${user._id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to delete account");

            toast.success(data.message);
            localStorage.removeItem("token");
            navigate("/auth");
        } catch (err: any) {
            toast.error(err.message || "Failed to delete account");
        } finally {
            setShowConfirm(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/auth");
    };

    if (!user) return <div className="text-center mt-20">Loading...</div>;

    return (
        <div className="max-w-md mx-auto mt-20">
            {showConfirm && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg w-80 text-center space-y-4">
                        <p>Are you sure you want to delete your account? This cannot be undone.</p>
                        <div className="flex justify-between space-x-2">
                            <Button variant="outline" onClick={() => setShowConfirm(false)}>Cancel</Button>
                            <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
                        </div>
                    </div>
                </div>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label>Name</Label>
                        <Input value={name} onChange={(e) => setName(e.target.value)} />
                        <Button className="mt-2 w-full" onClick={handleUpdate} disabled={loading}>
                            {loading ? "Updating..." : "Update Name"}
                        </Button>
                    </div>

                    <div>
                        <Label>Email</Label>
                        <Input value={user.email} disabled />
                    </div>

                    <div className="flex flex-col space-y-2 mt-4">
                        <Button variant="destructive" onClick={handleDelete}>
                            Delete Account
                        </Button>
                        <Button variant="outline" onClick={handleLogout}>
                            Logout
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
