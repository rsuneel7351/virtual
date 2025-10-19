import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { BASE_URL } from "@/utils/constant";

export default function ForgotPassword() {
    const [step, setStep] = useState(1);
    const [form, setForm] = useState({ email: "", otp: "", newPassword: "" });
    const [resendTimer, setResendTimer] = useState(0);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (resendTimer > 0) {
            timer = setTimeout(() => setResendTimer((t) => t - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [resendTimer]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const sendOTP = async (isResend = false) => {
        const loadingToast = toast.loading(isResend ? "Resending OTP..." : "Sending OTP...");
        try {
            const res = await fetch(`${BASE_URL}/auth/forgot`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: form.email }),
            });
            const data = await res.json();

            toast.dismiss(loadingToast);
            if (!res.ok) throw new Error(data.message || "Error");

            toast.success(isResend ? "OTP resent successfully!" : data.message);
            setStep(2);
            setResendTimer(30);
        } catch (err: any) {
            toast.dismiss(loadingToast);
            toast.error(err.message || "Failed to send OTP");
        }
    };

    const resetPassword = async () => {
        const loadingToast = toast.loading("Resetting password...");
        try {
            const res = await fetch(`${BASE_URL}/auth/reset`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await res.json();

            toast.dismiss(loadingToast);
            if (!res.ok) throw new Error(data.message || "Error");

            toast.success("Password reset successful!");
            window.location.href = "/auth";
        } catch (err: any) {
            toast.dismiss(loadingToast);
            toast.error(err.message || "Failed to reset password");
        }
    };

    return (
        <div className="w-[400px] mx-auto p-6 h-screen flex items-center justify-center">
            <Card className="w-[380px]">
                <CardHeader>
                    <CardTitle>Forgot Password</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {step === 1 && (
                        <>
                            <Label>Email</Label>
                            <Input
                                name="email"
                                placeholder="Enter your email..."
                                value={form.email}
                                onChange={handleChange}
                            />
                            <Button onClick={() => sendOTP(false)} className="w-full">
                                Send OTP
                            </Button>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <Label>OTP</Label>
                            <Input
                                placeholder="Enter OTP..."
                                name="otp"
                                value={form.otp}
                                onChange={handleChange}
                            />

                            <div className="flex justify-between items-center">
                                <Button
                                    variant="outline"
                                    onClick={() => sendOTP(true)}
                                    disabled={resendTimer > 0}
                                >
                                    {resendTimer > 0
                                        ? `Resend OTP in ${resendTimer}s`
                                        : "Resend OTP"}
                                </Button>
                            </div>

                            <Label>New Password</Label>
                            <Input
                                placeholder="Enter new password..."
                                type="password"
                                name="newPassword"
                                value={form.newPassword}
                                onChange={handleChange}
                            />

                            <Button onClick={resetPassword} className="w-full">
                                Reset Password
                            </Button>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
