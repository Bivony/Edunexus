import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "student",
    institution_id: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading("Creating account...");
      setError("");
      setSuccess("");

      const response = await axios.post(
        "https://bivonys.alwaysdata.net/api/signup",
        form
      );

      setLoading("");
      setSuccess(response.data.message);

      setTimeout(() => {
        navigate("/signin");
      }, 1500);

    } catch (err) {
      setLoading("");
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">

        <div className="col-md-6">
          <div
            className="card shadow-lg p-4"
            style={{ borderRadius: "15px" }}
          >

            <h3 className="text-center mb-3">
              Please Sign Up
            </h3>

            {loading && (
              <p className="text-primary text-center">
                {loading}
              </p>
            )}

            {success && (
              <p className="text-success text-center">
                {success}
              </p>
            )}

            {error && (
              <p className="text-danger text-center">
                {error}
              </p>
            )}

            <form onSubmit={handleSubmit}>

              <input
                type="text"
                name="name"
                className="form-control mb-2"
                placeholder="Name"
                value={form.name}
                onChange={handleChange}
                required
              />

              <input
                type="email"
                name="email"
                className="form-control mb-2"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
              />

              <input
                type="text"
                name="phone"
                className="form-control mb-2"
                placeholder="Phone"
                value={form.phone}
                onChange={handleChange}
                required
              />

              <input
                type="password"
                name="password"
                className="form-control mb-2"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
              />

              <select
                name="role"
                className="form-control mb-2"
                value={form.role}
                onChange={handleChange}
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="parent">Parent</option>
                <option value="admin">Admin</option>
                
              </select>

              <input
                type="text"
                name="institution_id"
                className="form-control mb-3"
                placeholder="Institution ID"
                value={form.institution_id}
                onChange={handleChange}
                required
              />

              <button
                type="submit"
                className="btn btn-primary w-100"
              >
                Sign Up
              </button>

            </form>

            <p className="text-center mt-3">
              Already have account?{" "}
              <Link to="/signin">
                Sign In
              </Link>
            </p>

          </div>
        </div>

      </div>
    </div>
  );
}