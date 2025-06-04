import { UserData, IdentifiableUserData, AnonymousUserData } from "@/types/user";

interface BackendUserData extends Omit<IdentifiableUserData, 'age' | 'name'> { // Removed 'name' from Omit
  age: number;
  username: string; // Added username property
}

type BackendRequestBody = Partial<BackendUserData> | AnonymousUserData;

export const userService = {
  saveUserData(data: UserData, onSaved: () => void, onError: (message: string) => void) {
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
          onSaved();
        } else {
          const errorJson = await res.json().catch(() => null);
          const errorMessage = errorJson?.message ?? "Unknown error";
          console.error("error when saving user:", errorJson ?? res);
          onError(errorMessage);
        }
      })
      .catch((err) => {
        console.error("error when saving user:", err);
        onError(err.message);
      });
  },
};
