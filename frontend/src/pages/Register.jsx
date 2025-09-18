import React, { useState } from "react";
import { registerUser } from "../service/api.js";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser(form);
      setSuccess("Usuario registrado con éxito 🎉");
      setError("");
      // ✅ redirigimos al login, no al endpoint
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setError(err?.response?.data?.message || "Error al registrarse");
    }
  };

  return (
    <div
      className="h-screen overflow-hidden flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/stadium-bg.jpg')" }}
    >
      <div className="bg-white/70 backdrop-blur-md p-6 sm:p-8 rounded-xl shadow-xl w-full max-w-sm sm:max-w-md lg:max-w-lg">
        <h2 className="text-xl sm:text-2xl font-bold text-center mb-6 text-black">
          Crear Cuenta
        </h2>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        {success && <p className="text-green-500 text-sm mb-3">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Nombre"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            className="w-full border p-2 rounded text-black text-sm sm:text-base"
            required
          />
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
            Registrarse
          </button>
        </form>

        <p className="text-sm text-center mt-4 text-black">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="font-semibold hover:underline text-black">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
