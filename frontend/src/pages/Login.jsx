import React, { useState } from "react";
import { loginUser } from "../service/api.js";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // ⬅️ usar login() del contexto
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser(form);
      // res.data debe traer { token, user:{ username, email, role } } desde el backend
      if (res.data?.token) {
        login({
          token: res.data.token,
          role: res.data.user?.role,
          name: res.data.user?.username, // 🔄 corregido: username, no name
          email: res.data.user?.email,
        });
        navigate("/");
      } else {
        setError("Respuesta inválida del servidor");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Error al iniciar sesión");
    }
  };

  return (
    <div
      className="h-screen overflow-hidden flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/stadium-bg.jpg')" }}
    >
      <div className="bg-white/70 backdrop-blur-md p-6 sm:p-8 rounded-xl shadow-xl w-full max-w-sm sm:max-w-md lg:max-w-lg">
        <h2 className="text-xl sm:text-2xl font-bold text-center mb-6 text-black">
          Iniciar Sesión
        </h2>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Correo electrónico"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full border p-2 rounded text-black text-sm sm:text-base"
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full border p-2 rounded text-black text-sm sm:text-base"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 text-sm sm:text-base"
          >
            Entrar
          </button>
        </form>

        <p className="text-sm text-center mt-4 text-black">
          ¿No tienes cuenta?{" "}
          <Link to="/register" className="font-semibold hover:underline text-black">
            Crear una cuenta
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

