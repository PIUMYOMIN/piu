import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async e => {
    e.preventDefault();
    const credentials = { name, email, phone, password, password_confirmation: confirmPassword };

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await fetch(
        "https://piueducation.org/api/v1/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(credentials)
        }
      );
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error);
      }
      navigate("/login");
    } catch (error) {
      setError("An error occurred while registering.");
    }
  };
  return <div className="w-full mx-auto flex flex-col justify-center items-center">
      <div className="lg:w-4/12 size-10/12 lg:my-20 my-4 mx-auto rounded-md">
        <div className="text-slate-800 text-xl text-center lg:py-8 py-4">
          Login Here!
        </div>
        <form className="bg-white shadow-md rounded px-8 lg:pt-6 pb-8 mb-4" onSubmit={handleRegister}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
              Username
            </label>
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 font-normal leading-tight focus:outline-none focus:shadow-outline text-normal" id="username" type="text" value={name} placeholder="Username" required onChange={e => setName(e.target.value)} />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 font-normal leading-tight focus:outline-none focus:shadow-outline text-normal" id="email" type="email" value={email} placeholder="Email" required onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
              Phone
            </label>
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 font-normal leading-tight focus:outline-none focus:shadow-outline text-normal" id="phone" type="number" value={phone} placeholder="Phone" required onChange={e => setPhone(e.target.value)} />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline text-normal" id="password" name="password" type="password" value={password} placeholder="password" required onChange={e => setPassword(e.target.value)} />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
              Re-type password
            </label>
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline text-normal" id="confirmPassword" name="confirmPassword" type="password" value={confirmPassword} placeholder="Confirm Password" required onChange={e => setConfirmPassword(e.target.value)} />
            {error && <p className="text-red-500 text-xs italic">
                {error}
              </p>}
          </div>
          <div className="flex items-center justify-between">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 text-sm px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
              Register
            </button>
            <a className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="#">
              Forgot Password?
            </a>
          </div>
        </form>
      </div>
    </div>;
}
