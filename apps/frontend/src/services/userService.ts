import { UserData } from "@/types/user";

export const userService = {
  saveUserData(data: UserData) {
    const jsonToSend = userService.prepareUserDataForSend(data);
    if (!jsonToSend) return;
    console.log("json de usuario:", jsonToSend);
    
    fetch("http://127.0.0.1:3000/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: jsonToSend,
    })
    .then((res) => {
      if (res.status === 201) {
        console.log("Usuario guardado con éxito.");
      } else {
        console.error("Error al guardar usuario:", res.status);
      }
    })
    .catch((err) => {
      console.error("Error en la solicitud:", err);
    });
  },
  
  getUserData(): UserData | null {
    const data = localStorage.getItem("userData");
    return data ? JSON.parse(data) : null;
  },
  
  clearUserData() {
    localStorage.removeItem("userData");
  },
  
  prepareUserDataForSend(data: UserData): string | null {
    if (data.anonymous) {
      return JSON.stringify({
        anonymous: true,
        id: data.id,
      });
    } else {
      return JSON.stringify({
        anonymous: false,
        id: data.id,
        username: data.name,
        email: data.email,
        age: Number(data.age),
      });
    }
  },
};
