import { useEffect, useState } from "react";
import { getUsers } from "@/services/userService";
import { User } from "@/types/User";

/**
 * Hook para obtener y gestionar los datos de usuarios
 */
export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUsers()
      .then(setUsers)
      .finally(() => setLoading(false));
  }, []);

  return { users, loading };
};
