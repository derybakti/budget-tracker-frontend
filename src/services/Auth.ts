import api from "@/api";
import { LoginData, RegisterData } from "@/interfaces/IAuth";
import { handleApiError } from "@/utils/handleApiError";

export const login = async (userDataLogin: LoginData) => {
	try {
		const res = await api.post("/auth/login", userDataLogin);
		return res.data;
	} catch (error) {
		handleApiError(error, "Login Failed!");
	}
};

export const register = async (userDataRegister: RegisterData) => {
	try {
		const res = await api.post("/auth/register", userDataRegister);
		return res.data;
	} catch (error) {
		handleApiError(error, "Register Failed!");
	}
};

export const profile = async (token: string) => {
	try {
		const res = await api.get("/auth/profile", {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return res.data;
	} catch (error) {
		handleApiError(error, "Get Profile Failed!");
	}
};

export const logout = () => {
	localStorage.removeItem("token");
};
