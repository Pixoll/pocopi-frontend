import { UserData } from "@/types/user";

export const userService = {
  saveUserData(data: UserData) {
    console.log("user json:", data);

    fetch(`${import.meta.env.VITE_API_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then(async (res) => {
        if (res.status === 201) {
          console.log("user saved successfully.");
        } else {
          console.error("error when saving user:", await res.json().catch(() => res));
        }
      })
      .catch((err) => {
        console.error("error when saving user:", err);
      });
  },
};
