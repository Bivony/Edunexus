import {
  createContext,
  useContext,
  useState,
  useEffect
} from "react";

import { Navigate } from "react-router-dom";

/* ================= CONTEXT ================= */
const AuthContext = createContext();

/* ================= PROVIDER ================= */
export function AuthProvider({ children }) {

  const [user, setUser] = useState(null);

  const [loading, setLoading] =
    useState(true);

  /* ================= LOAD USER ================= */
  useEffect(() => {

    try {

      const savedUser =
        localStorage.getItem("user");

      if (
        savedUser &&
        savedUser !== "undefined" &&
        savedUser !== "null"
      ) {

        const parsedUser =
          JSON.parse(savedUser);

        setUser(parsedUser);
      }

    } catch (error) {

      console.log(error);

      localStorage.removeItem("user");
    }

    setLoading(false);

  }, []);

  /* ================= LOGIN ================= */
  const login = async (form) => {

    try {

      const response = await fetch(
        "https://bivonys.alwaysdata.net/api/signin",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify(form)
        }
      );

      const data =
        await response.json();

      console.log(data);

      if (
        data.status === "success"
      ) {

        /* SAVE USER */
        localStorage.setItem(
          "user",
          JSON.stringify(data.data)
        );

        /* UPDATE STATE */
        setUser(data.data);

        return {
          success: true,
          user: data.data
        };
      }

      return {
        success: false,
        message:
          data.message ||
          "Login failed"
      };

    } catch (error) {

      console.log(error);

      return {
        success: false,
        message: "Server error"
      };
    }
  };

  /* ================= LOGOUT ================= */
  const logout = () => {

    localStorage.removeItem("user");

    setUser(null);

    window.location.href =
      "/signin";
  };

  /* ================= JOIN CLASS ================= */
  const joinClass = async (
    className
  ) => {

    try {

      if (!user) {

        return {
          success: false,
          message:
            "Please login first"
        };
      }

      const response = await fetch(
        "https://bivonys.alwaysdata.net/api/classes/join",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({
            class_name: className,
            student_id: user.id
          })
        }
      );

      const data =
        await response.json();

      if (
        data.status === "success"
      ) {

        return {
          success: true,
          message:
            data.message
        };
      }

      return {
        success: false,
        message:
          data.message
        };
    } catch (error) {

      console.log(error);

      return {
        success: false,
        message:
          "Server error"
      };
    }
  };

  /* ================= GET MY CLASSES ================= */
  const getMyClasses =
    async () => {

      try {

        if (!user) return [];

        const response =
          await fetch(
            `https://bivonys.alwaysdata.net/api/my-classes/${user.id}`
          );

        const data =
          await response.json();

        if (
          data.status === "success"
        ) {

          return data.data || [];
        }

        return [];

      } catch (error) {

        console.log(error);

        return [];
      }
    };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        loading,

        /* CLASS FEATURES */
        joinClass,
        getMyClasses,

        /* HELPERS */
        isAuthenticated:
          !!user,

        role:
          user?.role || null
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/* ================= USE AUTH ================= */
export function useAuth() {
  return useContext(AuthContext);
}

/* ================= PROTECTED ROUTE ================= */
export function ProtectedRoute({
  children
}) {

  const {
    user,
    loading
  } = useAuth();

  /* ================= LOADING ================= */
  if (loading) {

    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent:
            "center",
          alignItems:
            "center",
          background:
            "#f4f6f9",
          fontSize: "22px",
          fontWeight: "bold"
        }}
      >
        Loading...
      </div>
    );
  }

  /* ================= NOT LOGGED IN ================= */
  if (!user) {

    return (
      <Navigate
        to="/signin"
        replace
      />
    );
  }

  /* ================= ALLOWED ================= */
  return children;
}

export default AuthContext;