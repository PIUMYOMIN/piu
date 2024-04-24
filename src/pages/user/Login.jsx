import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { setIsAuthenticated } = useAuth();
  const handleSubmit = async e => {
    e.preventDefault();

    const credentials = {
      email: email,
      password: password
    };

    console.log(credentials);

    try {
      const response = await fetch("https://piueducation.org/api/v1/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(credentials)
      });

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        localStorage.setItem("token", data.token);
        setIsAuthenticated(true); // Update isAuthenticated state
        console.log("Token set:", data.token);
        navigate("/admin");
        console.log("Navigated to /admin");
      } else {
        console.error("Login failed:", data.error);
        navigate("/login");
        setError(data.error || "Login Failed");
      }
    } catch (err) {
      console.error("An error occurred while logging in:", err);
      setError("An error occurred while logging in.");
    }
  };
  return (
    <div className="w-full mx-auto flex flex-col justify-center items-center">
      <div className="lg:w-4/12 size-10/12 lg:my-20 my-4 mx-auto rounded-md">
        <div className="text-slate-800 text-xl text-center lg:py-8 py-4">
          Login Here!
        </div>
        <form
          className="bg-white shadow-md rounded px-8 lg:pt-6 pb-8 mb-4"
          onSubmit={handleSubmit}
        >
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="username"
            >
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 font-normal leading-tight focus:outline-none focus:shadow-outline text-normal"
              id="username"
              type="email"
              value={email}
              placeholder="email"
              required
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline text-normal"
              id="password"
              type="password"
              value={password}
              placeholder="password"
              onChange={e => setPassword(e.target.value)}
            />
            {error &&
              <p className="text-red-500 text-xs italic">
                {error}
              </p>}
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 text-sm px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Sign In
            </button>
            <a
              className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
              href="#"
            >
              Forgot Password?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
