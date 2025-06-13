/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import Image from "next/image";
import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { login, register } from "@/services/Auth";
import { toast } from "react-hot-toast";
import LoadingSpinnerButton from "@/ui/LoadingSpinnerButton";
import Modal from "@/ui/Modal";

const AuthPage = () => {
	//variabel untuk switch antara login dan register
	const [type, setType] = useState<"login" | "register">("login");
	const [showPassword, setShowPassword] = useState(false);
	const termsCheckBoxRef = React.useRef<HTMLInputElement>(null);
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [loading, setLoading] = useState(false);
	const [showModal, setShowModal] = useState(false);

	const router = useRouter();
	const isLogin = type === "login";

	const [formData, setFormData] = useState({
		name: "",
		number: "",
		email: "",
		password: "",
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setErrors({});
		setLoading(true);

		try {
			let response;
			console.log(isLogin);
			//kalo dia dalam keadaan login maka ambil yang email dan password saja atau jalanin if ini
			if (isLogin) {
				response = await login({
					email: formData.email,
					password: formData.password,
				});
			} else {
				if (!termsCheckBoxRef.current?.checked) {
					setErrors({
						terms: "Please accept the terms and conditions",
					});
					console.log("Please accept the terms and conditions");

					toast.error("Please accept the terms and conditions");
					return;
				}
				response = await register({
					...formData,
					number: `+62${formData.number}`,
				});
			}

			const token = response.data.token;

			localStorage.setItem("token", token);

			//console.log(response, token);

			toast.success(response.message);
			console.log(response, token);
			router.push("/dashboard");
		} catch (error) {
			if (error instanceof Error) {
				setErrors({ general: error.message });
				toast.error(error.message);
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
			<div className="grid w-full max-w-5xl grid-cols-1 overflow-hidden rounded-2xl bg-white shadow-lg md:grid-cols-2">
				{/* Kolom Form (Kiri) */}
				<div className="flex flex-col justify-center p-4 sm:p-6">
					<div className="w-full">
						<div className="text-center">
							<h1 className="text-3xl font-bold tracking-tight text-slate-900">
								{isLogin ? "Welcome Back!" : "Create an Account"}
							</h1>
							<p className="mt-2 text-sm text-slate-600">
								{isLogin
									? "Don't have an account?"
									: "Already have an account?"}{" "}
								<button
									onClick={() => setType(isLogin ? "register" : "login")}
									className="font-medium text-blue-600 hover:underline"
								>
									{isLogin ? "Sign up" : "Sign in"}
								</button>
							</p>
						</div>

						{/* Form */}
						<form
							onSubmit={handleSubmit}
							className="mt-4 space-y-2"
						>
							{!isLogin && (
								<div>
									<div>
										<label
											htmlFor="name"
											className="block text-sm font-medium text-slate-700"
										>
											Full Name
										</label>
										<input
											id="name"
											type="text"
											value={formData.name}
											onChange={(e) => {
												setFormData({ ...formData, name: e.target.value });
											}}
											placeholder="John Doe"
											className="mt-1 block w-full rounded-lg border-gray-300 bg-slate-50 px-4 py-2.5 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
										/>
									</div>
									<div>
										<label
											htmlFor="number"
											className="block text-sm font-medium text-slate-700"
										>
											Phone Number
										</label>
										<input
											id="number"
											type="text"
											value={formData.number}
											onChange={(e) =>
												setFormData({ ...formData, number: e.target.value })
											}
											placeholder="you@example.com"
											className="mt-1 block w-full rounded-lg border-gray-300 bg-slate-50 px-4 py-2.5 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
										/>
									</div>
								</div>
							)}

							<div>
								<label
									htmlFor="email"
									className="block text-sm font-medium text-slate-700"
								>
									Email Address
								</label>
								<input
									id="email"
									type="email"
									value={formData.email}
									onChange={(e) =>
										setFormData({ ...formData, email: e.target.value })
									}
									placeholder="you@example.com"
									className="mt-1 block w-full rounded-lg border-gray-300 bg-slate-50 px-4 py-2.5 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
								/>
							</div>
							<div>
								<label
									htmlFor="password"
									className="block text-sm font-medium text-slate-700"
								>
									Password
								</label>
								<div className="relative mt-1">
									<input
										id="password"
										type={showPassword ? "text" : "password"}
										value={formData.password}
										onChange={(e) =>
											setFormData({ ...formData, password: e.target.value })
										}
										placeholder="••••••••"
										className="block w-full rounded-lg border-gray-300 bg-slate-50 px-4 py-2.5 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
									/>
									<button
										type="button"
										onClick={() => setShowPassword(!showPassword)}
										className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 hover:text-slate-800"
									>
										{showPassword ? (
											<AiOutlineEyeInvisible size={20} />
										) : (
											<AiOutlineEye size={20} />
										)}
									</button>
								</div>
							</div>

							{/* Tombol Submit */}
							<div>
								<button
									type="submit"
									disabled={loading}
									className="w-full flex justify-center rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
								>
									<span>
										{loading
											? "Processing..."
											: isLogin
											? "Sign In"
											: "Sign Up"}
									</span>
								</button>
							</div>
						</form>

						{/* Pemisah "Or" */}
						<div className="relative my-6">
							<div
								className="absolute inset-0 flex items-center"
								aria-hidden="true"
							>
								<div className="w-full border-t border-gray-300" />
							</div>
							<div className="relative flex justify-center text-sm">
								<span className="bg-white px-2 text-slate-500">
									Or continue with
								</span>
							</div>
						</div>

						{/* Tombol Social Login */}
						<div className="grid grid-cols-1 gap-3">
							<button
								type="button"
								className="inline-flex w-full items-center justify-center gap-3 rounded-lg border border-slate-300 bg-white px-5 py-3 font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
							>
								{/* SVG Ikon Google */}
								<svg
									className="h-5 w-5"
									viewBox="0 0 24 24"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
										fill="#4285F4"
									></path>
									<path
										d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
										fill="#34A853"
									></path>
									<path
										d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
										fill="#FBBC05"
									></path>
									<path
										d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
										fill="#EA4335"
									></path>
								</svg>
								<span>Google</span>
							</button>
						</div>
					</div>
				</div>

				{/* Kolom Gambar (Kanan) */}
				<div className="relative hidden md:block">
					<Image
						src="/images/auth-img.png"
						alt="Financial planning"
						fill
						sizes="(max-width: 768px) 100vw, 50vw"
						priority
						className="object-cover"
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent"></div>
					<div className="absolute bottom-0 left-0 p-12">
						<h2 className="text-3xl font-bold leading-tight text-white">
							Track Your Finances, Shape Your Future.
						</h2>
						<p className="mt-2 text-slate-200">
							Start making smart decisions with your money today.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AuthPage;
