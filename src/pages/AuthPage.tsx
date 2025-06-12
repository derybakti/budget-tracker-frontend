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
		<div className="min-h-screen flex items-center justify-center bg-gray-100 px-14 py-8 md:py-0">
			<div className="grid grid-cols-1 md:grid-cols-2 w-full min-h-[60vh] md:min-h-[80vh] bg-white rounded-lg shadow-2xl overflow-hidden `">
				<div className="p-8 md:p-8 lg:p-24 flex flex-col max-h-[90vh] md:max-h-[80vh] justify-center">
					<h2 className="text-3xl font-bold mb-2 text-gray-800">
						{isLogin ? "Sign In" : "Sign Up"}
					</h2>
					<p className="text-gray-600 mb-4">
						{isLogin ? "Welcome back!" : "Create an account"}
					</p>
					<form
						onSubmit={handleSubmit}
						className="space-y-2"
					>
						{/* keadaan untuk login atau register */}
						{!isLogin && (
							<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
								<div>
									<label
										htmlFor="name"
										className="block text-sm text-gray-700"
									>
										Full Name
									</label>
									<input
										type="text"
										value={formData.name}
										onChange={(e) =>
											setFormData({ ...formData, name: e.target.value })
										}
										placeholder="John Doe"
										className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-gray-600 border-gray-300"
									/>
								</div>
								<div>
									<label
										htmlFor="number"
										className="block text-sm  text-gray-700"
									>
										Phone Number
									</label>
									<div className="relative">
										<div className="absolute inset-y-0 left-0 flex items-center pl-3 pt-2 pointer-events-none">
											<span className="text-gray-500 sm:text-sm">+62</span>
										</div>
										<input
											type="text"
											value={formData.number}
											onChange={(e) =>
												setFormData({ ...formData, number: e.target.value })
											}
											placeholder="8xxxxxx"
											className="w-full px-4 pl-10 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-gray-600 border-gray-300"
										/>
									</div>
								</div>
							</div>
						)}
						<div>
							<label
								htmlFor="email"
								className="block text-sm font-medium text-gray-700"
							>
								Email
							</label>
							<input
								type="email"
								value={formData.email}
								onChange={(e) =>
									setFormData({ ...formData, email: e.target.value })
								}
								placeholder="jhondoe@gmail"
								className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-gray-600 border-gray-300"
							/>
						</div>
						<div>
							<label
								htmlFor="password"
								className="block text-sm font-medium text-gray-700"
							>
								Password
							</label>
							<div className="relative">
								<input
									type={showPassword ? "text" : "password"}
									placeholder="password"
									value={formData.password}
									onChange={(e) =>
										setFormData({ ...formData, password: e.target.value })
									}
									className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-gray-600 border-gray-300"
								/>
								<button
									type="button"
									className="absolute inset-y-0 right-0 pr-3 flex items-center text-xl leading-5 mt-2"
									onClick={() => setShowPassword(!showPassword)}
								>
									{showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
								</button>
							</div>
						</div>

						{!isLogin && (
							<div className="flex items-center gap-2">
								<input
									ref={termsCheckBoxRef}
									id="terms"
									type="checkbox"
									className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded dark:ring-offset-gray-800  dark:bg-gray-700 dark:border-gray-600"
								/>
								<label
									htmlFor="terms"
									className="ml-2 text-sm  text-gray-900"
								>
									I accept{" "}
									<button
										type="button"
										onClick={() => setShowModal(!showModal)}
										className="text-indigo-600 hover:underline cursor-pointer"
									>
										the terms and privacy policy
									</button>
								</label>
							</div>
						)}

						{/* {errors.terms && <p className="text-red-500">{errors.terms}</p>} */}

						<button
							type="submit"
							disabled={loading}
							className={`w-full  py-2 rounded-md bg-indigo-600 text-white ${
								loading
									? "opacity-50 cursor-not-allowed"
									: "hover:bg-indigo-700 transition duration-300 cursor-pointer"
							}`}
						>
							{loading ? (
								<>
									<LoadingSpinnerButton />
									Processing...
								</>
							) : isLogin ? (
								"Sign In"
							) : (
								"Sign Up"
							)}
						</button>

						<p className="text-sm text-gray-600">
							{isLogin
								? "Don't have an account? "
								: "Already have an account? "}
							<button
								type="button"
								className="text-indigo-600 hover:underline cursor-pointer"
								onClick={() => setType(isLogin ? "register" : "login")}
							>
								{isLogin ? "Sign Up" : "Sign In"}
							</button>
						</p>
					</form>
				</div>
				<div className="hidden md:block bg-indigo-600 relative max-h-[80vh] w-full">
					<Image
						src="/images/auth-img.png"
						alt="Auth Image"
						layout="fill"
						objectFit="cover"
						className="object-cover"
						priority
					></Image>
				</div>
			</div>

			<div>
				{showModal && (
					<Modal
						type="information"
						message="Terms and Privacy Policy
						By using our service, you acknowledge that you have read, understand, and agree to be bound by our Terms of Service and Privacy Policy. We do not collect any personal information from you. If you do not agree to these terms, please do not use our service."
						onOk={() => {
							setShowModal(false);
							if (termsCheckBoxRef.current)
								termsCheckBoxRef.current.checked = true;
						}}
						onCancel={() => setShowModal(false)}
					/>
				)}
			</div>
		</div>
	);
};

export default AuthPage;
