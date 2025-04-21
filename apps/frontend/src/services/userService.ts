import api from "@/services/api";
import { User } from "@/types/User";

export const getUsers = async (): Promise<User[]> => {
  const response = await api.get<User[]>("/users");
  return response.data;
};
