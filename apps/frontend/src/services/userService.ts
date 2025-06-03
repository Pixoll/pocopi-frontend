import { UserData } from "@/types/user";

export const userService = {
  saveUserData(data: UserData) {
    localStorage.setItem("userData", JSON.stringify(data));
  },
  getUserData(): UserData | null {
    const data = localStorage.getItem("userData");
    return data ? JSON.parse(data) : null;
  },
  clearUserData() {
    localStorage.removeItem("userData");
  },
};
