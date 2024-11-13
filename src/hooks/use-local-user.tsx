import { User, UserSchema } from "@/types/types";
import { useEffect, useState } from "react";

const key = "user";

export const useLocalUser = (
  defaultValue: User,
): [User, (newUser: User) => void] => {
  const [storedUser, setStoredUser] = useState(() => {
    try {
      const value = window.localStorage.getItem(key);

      if (value) {
        const user = JSON.parse(value);
        const result = UserSchema.safeParse(user);

        if (result?.success) {
          return result.data;
        } else {
          window.localStorage.setItem(key, JSON.stringify(defaultValue));
          return defaultValue;
        }
      }

      return defaultValue;
    } catch (err) {
      console.error(err);
      return defaultValue;
    }
  });

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        const user = JSON.parse(e.newValue);
        const result = UserSchema.safeParse(user);

        if (result.success) {
          setStoredUser(result.data);
        } else {
          console.error(result.error);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const setUser = (newUser: User) => {
    try {
      window.localStorage.setItem(key, JSON.stringify(newUser));
      setStoredUser(newUser);
    } catch (err) {
      console.error(err);
    }
    setStoredUser(newUser);
  };

  return [storedUser, setUser];
};
