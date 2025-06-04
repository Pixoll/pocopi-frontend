import { UserData, IdentifiableUserData, AnonymousUserData } from "@/types/user";

interface BackendUserData extends Omit<IdentifiableUserData, 'age' | 'name'> { // Removed 'name' from Omit
  age: number;
  username: string; // Added username property
}

type BackendRequestBody = Partial<BackendUserData> | AnonymousUserData;

export const userService = {
  async saveUserData(data: UserData) {
    // Guardar en localStorage
    localStorage.setItem("userData", JSON.stringify(data));

    // Enviar al backend
    try {
      let requestBody: BackendRequestBody;
      if (!data.anonymous) {
        requestBody = {
          id: data.id,
          username: data.name,
          email: data.email,
          age: parseInt(data.age)
        };
      } else {
        requestBody = {
          id: data.id,
          anonymous: true
        };
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        console.error("Error guardando usuario en el backend:", await response.text());
      } else {
        console.log("Usuario guardado exitosamente en el backend");
      }
    } catch (error) {
      console.error("Error al conectar con el backend:", error);
    }
  },

  getUserData(): UserData | null {
    const data = localStorage.getItem("userData");
    return data ? JSON.parse(data) : null;
  },

  clearUserData() {
    localStorage.removeItem("userData");
  },
};