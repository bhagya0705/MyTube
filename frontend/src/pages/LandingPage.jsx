import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { RocketIcon, VideoIcon, LockIcon } from "lucide-react";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white px-4 sm:px-6 py-10 flex flex-col justify-between">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-3xl mx-auto px-2"
      >
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
          Welcome to <span className="text-blue-500">MyTube</span>
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-8">
          Upload. Watch. Explore. MyTube is your personal video sharing platform
          built with power, speed, and style.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded text-lg w-full sm:w-auto"
            onClick={() => navigate("/register")}
          >
            Get Started
          </button>
          <button
            className="border border-white hover:bg-white hover:text-black text-white font-semibold px-6 py-3 rounded text-lg w-full sm:w-auto"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </div>
      </motion.div>

      {/* Features */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-center mt-20 max-w-6xl mx-auto w-full px-4"
      >
        <div className="bg-gray-800 p-6 rounded-2xl shadow-xl">
          <VideoIcon className="w-10 h-10 mx-auto text-blue-400 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Upload with Ease</h3>
          <p className="text-gray-400 text-sm">
            Seamlessly upload videos and manage your content in a secure dashboard.
          </p>
        </div>
        <div className="bg-gray-800 p-6 rounded-2xl shadow-xl">
          <RocketIcon className="w-10 h-10 mx-auto text-green-400 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Fast & Reliable</h3>
          <p className="text-gray-400 text-sm">
            Optimized performance to handle uploads, playback, and browsing smoothly.
          </p>
        </div>
        <div className="bg-gray-800 p-6 rounded-2xl shadow-xl">
          <LockIcon className="w-10 h-10 mx-auto text-red-400 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Secure Access</h3>
          <p className="text-gray-400 text-sm">
            Auth-protected system ensures your videos and data stay private and safe.
          </p>
        </div>
      </motion.div>

      {/* Footer */}
      <footer className="text-center mt-20 text-gray-500 text-sm px-4">
        © {new Date().getFullYear()} MyTube. Built with ❤️ using MERN stack.
      </footer>
    </div>
  );
};

export default LandingPage;
