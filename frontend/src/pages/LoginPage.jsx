// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { loginUser } from "../api/auth";
// import { motion } from "framer-motion";
// import toast from "react-hot-toast";

// const LoginPage = () => {
//   const navigate = useNavigate();
//   const [form, setForm] = useState({
//     emailOrUsername: "",
//     password: "",
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm({ ...form, [name]: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const res = await loginUser({
//         email: form.emailOrUsername,
//         username: form.emailOrUsername,
//         password: form.password,
//       });

//       localStorage.setItem("user",JSON.stringify(res.data.data));
//       console.log(res);

//       toast.success(res.data.message || 'Logged in successfully');
//       navigate("/dashboard");
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Login failed');
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black px-4">
//       <motion.div
//         initial={{ opacity: 0, y: 40 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6 }}
//         className="w-full max-w-md bg-gray-800 p-8 rounded-2xl shadow-2xl text-white"
//       >
//         <h2 className="text-3xl font-extrabold text-center mb-6">
//           Welcome Back
//         </h2>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <input
//             type="text"
//             name="emailOrUsername"
//             placeholder="Email or Username"
//             value={form.emailOrUsername}
//             onChange={handleChange}
//             required
//             className="w-full p-3 bg-gray-900 text-white border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             value={form.password}
//             onChange={handleChange}
//             required
//             className="w-full p-3 bg-gray-900 text-white border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//           <button
//             type="submit"
//             className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition duration-200 font-semibold"
//           >
//             Login
//           </button>

//           <p className="text-sm text-center text-gray-300 mt-4">
//             New user?{" "}
//             <span
//               onClick={() => navigate("/register")}
//               className="text-blue-400 hover:underline cursor-pointer"
//             >
//               Register
//             </span>
//           </p>
//         </form>
//       </motion.div>
//     </div>
//   );
// };

// export default LoginPage;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const LoginPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    emailOrUsername: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await loginUser({
        email: form.emailOrUsername,
        username: form.emailOrUsername,
        password: form.password,
      });

      localStorage.setItem("user", JSON.stringify(res.data.data));
      toast.success(res.data.message || "Logged in successfully");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-2xl text-white"
      >
        <h2 className="text-2xl sm:text-3xl font-extrabold text-center mb-6">
          Welcome Back
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="emailOrUsername"
            placeholder="Email or Username"
            value={form.emailOrUsername}
            onChange={handleChange}
            required
            className="w-full p-3 bg-gray-900 text-white border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full p-3 bg-gray-900 text-white border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition duration-200 font-semibold"
          >
            Login
          </button>

          <p className="text-sm text-center text-gray-300 mt-4">
            New user?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-blue-400 hover:underline cursor-pointer"
            >
              Register
            </span>
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default LoginPage;
