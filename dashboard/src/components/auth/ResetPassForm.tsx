import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import data from "../../../../src/user.json";

export default function ResetPasswordForm() {
    const [email, setEmail] = useState("");
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [code, setCode] = useState(["", "", "", ""]);
    const [randomCode, setRandomCode] = useState("");
    const [isCodeVerified, setIsCodeVerified] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [rePassword, setRePassword] = useState("");
    const [message, setMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showRePassword, setShowRePassword] = useState(false);

    const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

    const sendVerificationCode = () => {
        if (!email) {
            setMessage("Please enter your email!");
            return;
        }

        const generatedCode = Math.floor(1000 + Math.random() * 9000).toString();
        setRandomCode(generatedCode);
        setIsCodeSent(true);
        setMessage(`Verification code sent to email: ${email}`);

        console.log(`Verification code is: ${generatedCode}`);
    };

    const handleCodeChange = (value: string, index: number) => {
        if (!/^\d?$/.test(value)) return;

        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        if (value && index < 3) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    const verifyCode = () => {
        const enteredCode = code.join("");
        if (enteredCode === randomCode) {
            setIsCodeVerified(true);
            setMessage("✅ Verification successful. Please enter your new password.");
        } else {
            setMessage("❌ Incorrect verification code.");
        }
    };

    const resetPassword = () => {
        if (!newPassword || !rePassword) {
            setMessage("Please fill in both password fields.");
            return;
        }
        if (newPassword !== rePassword) {
            setMessage("❌ Passwords do not match.");
            return;
        }

        console.log(`🔐 New password for ${email}: ${newPassword}`);
        setMessage("✅ Password changed successfully! You can now log in.");
    };

    return (
        <div className="flex flex-col min-h-screen px-4 py-8 sm:px-6 lg:px-8 bg-white">
            <div className="w-full max-w-md mx-auto">
                <Link to="/" className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 mb-4">
                    <i className="pi pi-chevron-left size-5 mr-1" />
                    Back to Home
                </Link>

                <div className="bg-white p-6 rounded-lg">
                    <h2 className="text-2xl font-bold mb-6 text-center">Forgot Password</h2>

                    {!isCodeSent && (
                        <div className="mb-6">
                            <Label htmlFor="email" className="">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={email}
                                onChange={(e: any) => setEmail(e.target.value)}
                                placeholder="Enter your email..."
                                hint="Please enter a valid email address."
                                min={0}
                                max={100}
                                step={1}
                            />
                            <Button onClick={sendVerificationCode} className="w-full mt-4" startIcon={null} endIcon={null}>
                                Send Verification Code
                            </Button>
                        </div>
                    )}

                    {isCodeSent && !isCodeVerified && (
                        <>
                            <p className="text-sm text-center text-green-600 mb-4">
                                Verification code sent to: <strong>{email}</strong>
                            </p>

                            <div className="mb-6">
                                <Label htmlFor="verificationCode" className="">Enter the 4-digit code</Label>
                                <div className="flex justify-center gap-3 mt-3">
                                    {code.map((digit, index) => (
                                        <input
                                            key={index}
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={1}
                                            className="w-12 h-12 sm:w-14 sm:h-14 text-center text-xl border border-gray-300 rounded-lg focus:outline-blue-500"
                                            value={digit}
                                            onChange={(e) => handleCodeChange(e.target.value, index)}
                                            ref={(el) => { inputsRef.current[index] = el; }}
                                        />
                                    ))}
                                </div>
                                <p className="text-sm text-gray-500 mt-2 text-center">Please enter the exact 4 digits.</p>
                            </div>

                            <Button onClick={verifyCode} className="w-full mb-2" startIcon={null} endIcon={null}>
                                Verify Code
                            </Button>
                            <Button variant="outline" onClick={sendVerificationCode} className="w-full text-sm" startIcon={null} endIcon={null}>
                                Resend Code
                            </Button>
                        </>
                    )}

                    {isCodeVerified && (
                        <>
                            <div className="mb-4">
                                <Label htmlFor="newPassword" className="">New Password</Label>
                                <div className="relative">
                                    <Input
                                        id="newPassword"
                                        name="newPassword"
                                        type={showPassword ? "text" : "password"}
                                        value={newPassword}
                                        onChange={(e: any) => setNewPassword(e.target.value)}
                                        placeholder="********"
                                        hint="Please enter your new password."
                                        min={0}
                                        max={100}
                                        step={1}
                                    />
                                    <span
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                                    >
                                        <i className={`pi ${showPassword ? "pi-eye" : "pi-eye-slash"}`} />
                                    </span>
                                </div>
                            </div>

                            <div className="mb-4">
                                <Label htmlFor="rePassword" className=''>Confirm Password</Label>
                                <div className="relative">
                                    <Input
                                        id="rePassword"
                                        name="rePassword"
                                        type={showRePassword ? "text" : "password"}
                                        value={rePassword}
                                        onChange={(e: any) => setRePassword(e.target.value)}
                                        placeholder="********"
                                        hint="Please confirm your new password."
                                        min={0}
                                        max={100}
                                        step={1}
                                    />
                                    <span
                                        onClick={() => setShowRePassword(!showRePassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                                    >
                                        <i className={`pi ${showRePassword ? "pi-eye" : "pi-eye-slash"}`} />
                                    </span>
                                </div>
                            </div>

                            <Button onClick={resetPassword} className="w-full" startIcon={null} endIcon={null}>
                                Confirm Password Change
                            </Button>
                        </>
                    )}

                    {message && (
                        <p className="mt-4 text-center text-sm text-blue-600">{message}</p>
                    )}

                    <div className="mt-6 text-center text-sm">
                        <Link to="/signin" className="text-blue-500 hover:underline">
                            Back to Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
