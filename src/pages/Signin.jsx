import { useState } from "react";
import { useAuth } from "../auth/AuthSystem";
import { useNavigate, Link } from "react-router-dom";

export default function Signin() {

  const { login } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [error, setError] =
    useState("");

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]:
        e.target.value
    });
  };

  /* ================= HANDLE SUBMIT ================= */
  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      setLoading("Logging in...");
      setError("");
      setSuccess("");

      const result =
        await login(form);

      /* LOGIN SUCCESS */
      if (result.success) {

        setLoading("");
        setSuccess(
          "Login successful"
        );

        setTimeout(() => {

          navigate("/dashboard");

        }, 1000);

      } else {

        /* LOGIN FAILED */
        setLoading("");

        setError(
          result.message ||
          "Invalid email or password"
        );
      }

    } catch (err) {

      console.log(err);

      setLoading("");

      setError(
        "Signin failed"
      );
    }
  };

  return (

    <div className="container mt-5">

      <div className="row justify-content-center">

        <div className="col-md-5">

          <div
            className="card shadow-lg p-4"
            style={{
              borderRadius: "15px"
            }}
          >

            <h3 className="text-center mb-3">
              Please Signin
            </h3>

            {/* LOADING */}
            {loading && (

              <p className="text-primary text-center">
                {loading}
              </p>
            )}

            {/* SUCCESS */}
            {success && (

              <p className="text-success text-center">
                {success}
              </p>
            )}

            {/* ERROR */}
            {error && (

              <p className="text-danger text-center">
                {error}
              </p>
            )}

            <form onSubmit={handleSubmit}>

              {/* EMAIL */}
              <input
                type="email"
                name="email"
                className="form-control mb-3"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
              />

              {/* PASSWORD */}
              <input
                type="password"
                name="password"
                className="form-control mb-3"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
              />

              {/* BUTTON */}
              <button
                type="submit"
                className="btn btn-primary w-100"
              >
                Signin
              </button>

            </form>

            <p className="text-center mt-3">

              Don't have account?{" "}

              <Link to="/signup">
                Signup
              </Link>

            </p>

          </div>
        </div>
      </div>
    </div>
  );
}
