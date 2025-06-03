import { UserData } from "@/types/user";

export const studentService = {
  saveStudentData(data: UserData) {
    localStorage.setItem("userData", JSON.stringify(data));
  },
  getStudentData(): UserData | null {
    const data = localStorage.getItem("userData");
    return data ? JSON.parse(data) : null;
  },
  clearStudentData() {
    localStorage.removeItem("userData");
  },
};
