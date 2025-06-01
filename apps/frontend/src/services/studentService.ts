import { StudentData } from "@/types/student";

export const studentService = {
  saveStudentData(data: StudentData) {
    localStorage.setItem("studentData", JSON.stringify(data));
  },
  getStudentData(): StudentData | null {
    const data = localStorage.getItem("studentData");
    return data ? JSON.parse(data) : null;
  },
  clearStudentData() {
    localStorage.removeItem("studentData");
  },
};
