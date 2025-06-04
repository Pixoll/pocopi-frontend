import { UserData } from "@/types/user";

export const userService = {
  async saveUserData(data: UserData) {
    // Guardar en localStorage
    localStorage.setItem("userData", JSON.stringify(data));

    // Enviar al backend
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: data.id,
          username: data.name,
          email: data.email,
          age: parseInt(data.age)
        })
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