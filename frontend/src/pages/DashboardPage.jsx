// import { useEffect, useState } from "react";
// import { getCurrentUser } from "../api/auth";
// import { logoutUser } from "../api/auth";
// import { getUserVideos } from "../api/auth";
// import { getChannelProfile } from "../api/auth";
// import { useNavigate } from "react-router-dom";
// import UpdateAccountForm from "../components/UpdateAccount";
// import UpdateCoverImage from "../components/UpdateCoverImage";
// import UpdateAvatarForm from "../components/UpdateAvatar";
// import ChannelProfileView from "../components/getUserChannelProfile";
// import MyVideosSection from "../components/VideosSection";
// import ExploreSection from "./ExplorePage";
// import MyPlaylists from "../components/MyPlaylists";
// import WatchHistoryPage from "./WatchHistoryPage";
// import { motion } from "framer-motion";

// const DashboardPage = () => {
//   const [user, setUser] = useState(null);
//   const [count, setCount] = useState(0);
//   const [profile,setProfile] =  useState(null);
//   const [showSidebar, setShowSidebar] = useState(false);
//   const [activeSidebarView, setActiveSidebarView] = useState(null);
//   const [activeMainView, setActiveMainView] = useState("dashboard");
//   const navigate = useNavigate();

//   const fetchUser = async () => {
//     try {
//       const res = await getCurrentUser();
//       const userData = res.data.data;
//       setUser(res.data.data);

//       const response = await getUserVideos();
//       console.log("User videos response", response);
//       setCount(response.data.data);

//       const resp = await getChannelProfile(userData.username);
//       setProfile(resp.data.data);

//     } catch (err) {
//       console.error("User fetch failed", err);
//       navigate("/login");
//     }
//   };

//   useEffect(() => {
//     fetchUser();

//   }, [navigate]);

//   const handleLogout = async () => {
//     try {
//       await logoutUser();
//       alert("Logged out successfully");
//       navigate("/login");
//     } catch (err) {
//       console.error("Logout failed", err);
//       alert("Failed to log out");
//     }
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 0.6 }}
//       className="min-h-screen flex bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white"
//     >
//       {/* Sidebar */}
//       <aside className="w-64 bg-gray-900 shadow-lg p-5 hidden md:block">
//         <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
//         <nav className="space-y-4">
//           <button
//             onClick={() => setActiveMainView("dashboard")}
//             className="block text-left w-full text-gray-500 hover:text-blue-500"
//           >
//             Home
//           </button>
//           <button
//             onClick={() => setActiveMainView("myVideos")}
//             className="block text-left w-full text-gray-500 hover:text-blue-500"
//           >
//             My Videos
//           </button>
//           <button
//             onClick={() => setActiveMainView("myPlaylists")}
//             className="block text-left w-full text-gray-500 hover:text-blue-500"
//           >
//             My Playlists
//           </button>
//           <button
//             onClick={() => setActiveMainView("explore")}
//             className="block text-left w-full text-gray-500 hover:text-blue-500"
//           >
//             Explore
//           </button>
//           <a href="#" className="block text-gray-500 hover:text-blue-500">
//             Subscriptions
//           </a>
//           <button
//             onClick={handleLogout}
//             className="block text-left w-full text-red-800"
//           >
//             Logout
//           </button>
//         </nav>
//       </aside>

//       {/* Profile Slide-out Sidebar */}
//       <div
//         className={`fixed top-0 right-0 h-full w-[25%] backdrop-blur-md bg-gradient-to-br from-[#0e0e10]/70 to-[#1c1c20]/80 border-l border-white/10 shadow-2xl p-6 z-50 transform transition-transform duration-300 ease-in-out ${
//           showSidebar ? "translate-x-0" : "translate-x-full"
//         }`}
//       >
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-bold">
//             {activeSidebarView ? "Edit Profile" : "Account Options"}
//           </h2>
//           <button
//             onClick={() => {
//               setShowSidebar(false);
//               setActiveSidebarView(null);
//             }}
//             className="text-gray-500 hover:text-white text-lg"
//           >
//             ✕
//           </button>
//         </div>

//         {!activeSidebarView && (
//           <ul className="space-y-3">
//             <li>
//               <button
//                 onClick={() => setActiveSidebarView("account")}
//                 className="text-blue-600 hover:underline"
//               >
//                 Update Account Details
//               </button>
//             </li>
//             <li>
//               <button
//                 onClick={() => setActiveSidebarView("avatar")}
//                 className="text-blue-600 hover:underline"
//               >
//                 Update Avatar
//               </button>
//             </li>
//             <li>
//               <button
//                 onClick={() => setActiveSidebarView("cover")}
//                 className="text-blue-600 hover:underline"
//               >
//                 Update Cover Image
//               </button>
//             </li>
//             <li>
//               <button
//                 onClick={() => setActiveSidebarView("channelProfile")}
//                 className="text-blue-600 hover:underline"
//               >
//                 View Channel Profile
//               </button>
//             </li>
//             <li>
//               <button
//                 onClick={() => setActiveSidebarView("watchHistory")}
//                 className="text-blue-600 hover:underline"
//               >
//                 Watch History
//               </button>
//             </li>
//             <li>
//               <button
//                 onClick={() => setShowSidebar(false)}
//                 className="text-red-600 hover:underline"
//               >
//                 Close
//               </button>
//             </li>
//           </ul>
//         )}

//         {activeSidebarView === "account" && (
//           <UpdateAccountForm
//             currentName={user?.fullName}
//             currentEmail={user?.email}
//             onSuccess={() => {
//               setShowSidebar(false);
//               setActiveSidebarView(null);
//               fetchUser();
//             }}
//           />
//         )}

//         {activeSidebarView === "cover" && (
//           <UpdateCoverImage
//             onSuccess={() => {
//               setShowSidebar(false);
//               setActiveSidebarView(null);
//               fetchUser();
//             }}
//           />
//         )}

//         {activeSidebarView === "avatar" && (
//           <UpdateAvatarForm
//             onSuccess={() => {
//               setShowSidebar(false);
//               setActiveSidebarView(null);
//               fetchUser();
//             }}
//           />
//         )}

//         {activeSidebarView === "channelProfile" && (
//           <ChannelProfileView username={user?.username} />
//         )}

//         {activeSidebarView === "watchHistory" && <WatchHistoryPage />}
//       </div>

//       {/* Main Content */}
//       <main className="flex-1">
//         {user?.coverImage && (
//           <motion.div
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6 }}
//             className="relative w-full h-64 overflow-hidden"
//           >
//             <img
//               src={user.coverImage}
//               alt="Cover"
//               className="w-full h-full object-cover"
//             />
//             <div className="absolute bottom-[5px] left-6 flex items-center gap-4">
//               <img
//                 src={user.avatar}
//                 alt="Avatar"
//                 className="w-20 h-20 rounded-full border-4 border-white shadow-md hover:shadow-blue-400 transition"
//                 onClick={() => setShowSidebar(true)}
//               />
//               <div>
//                 <h2 className="text-xl font-bold text-white drop-shadow-sm">
//                   {user.fullName}
//                 </h2>
//                 <p className="text-sm text-white/80">@{user.username}</p>
//               </div>
//             </div>
//           </motion.div>
//         )}

//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//           className="mt-20 px-6"
//         >
//           {activeMainView === "dashboard" && (
//             <>
//               <h1 className="text-4xl font-extrabold tracking-tight">
//                 Welcome back{" "}
//                 <span className="text-blue-500">{user?.username}</span> 👋
//               </h1>
//               <p className="text-gray-500">Here's your dashboard overview.</p>
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
//                 <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl shadow-md hover:shadow-blue-400 transition-all">
//                   <h3 className="text-lg font-medium text-white">
//                     Total Videos
//                   </h3>
//                   <p className="text-2xl font-bold text-blue-400">{count}</p>
//                 </div>
//                 <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl shadow-md hover:shadow-blue-400 transition-all">
//                   <h3 className="text-lg font-medium text-white">
//                     Subscribers
//                   </h3>
//                   <p className="text-2xl font-bold text-blue-400">{profile?.subscribersCount??0}</p>
//                 </div>
//                 <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl shadow-md hover:shadow-blue-400 transition-all">
//                   <h3 className="text-lg font-medium text-white">Watch Time</h3>
//                   <p className="text-2xl font-bold text-blue-400">48Hrs</p>
//                 </div>
//               </div>
//             </>
//           )}

//           {activeMainView === "myVideos" && (
//             <MyVideosSection userId={user?._id} />
//           )}

//           {activeMainView === "myPlaylists" && <MyPlaylists />}

//           {activeMainView === "explore" && <ExploreSection />}
//         </motion.div>
//       </main>
//     </motion.div>
//   );
// };

// export default DashboardPage;

import { useEffect, useState } from "react";
import { getCurrentUser } from "../api/auth";
import { logoutUser } from "../api/auth";
import { getUserVideos } from "../api/auth";
import { getChannelProfile } from "../api/auth";
import { useNavigate } from "react-router-dom";
import UpdateAccountForm from "../components/UpdateAccount";
import UpdateCoverImage from "../components/UpdateCoverImage";
import UpdateAvatarForm from "../components/UpdateAvatar";
import ChannelProfileView from "../components/getUserChannelProfile";
import MyVideosSection from "../components/VideosSection";
import ExploreSection from "./ExplorePage";
import MyPlaylists from "../components/MyPlaylists";
import WatchHistoryPage from "./WatchHistoryPage";
import { motion } from "framer-motion";

const DashboardPage = () => {
  const [user, setUser] = useState(null);
  const [count, setCount] = useState(0);
  const [profile, setProfile] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [activeSidebarView, setActiveSidebarView] = useState(null);
  const [activeMainView, setActiveMainView] = useState("dashboard");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      const res = await getCurrentUser();
      const userData = res.data.data;
      setUser(userData);

      const response = await getUserVideos();
      setCount(response.data.data);

      const resp = await getChannelProfile(userData.username);
      setProfile(resp.data.data);
    } catch (err) {
      console.error("User fetch failed", err);
      navigate("/login");
    }
  };

  useEffect(() => {
    fetchUser();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await logoutUser();
      alert("Logged out successfully");
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
      alert("Failed to log out");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white"
    >
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 shadow-lg p-5 hidden md:block">
        <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
        <nav className="space-y-4">
          <button
            onClick={() => setActiveMainView("dashboard")}
            className="block text-left w-full text-gray-500 hover:text-blue-500"
          >
            Home
          </button>
          <button
            onClick={() => setActiveMainView("myVideos")}
            className="block text-left w-full text-gray-500 hover:text-blue-500"
          >
            My Videos
          </button>
          <button
            onClick={() => setActiveMainView("myPlaylists")}
            className="block text-left w-full text-gray-500 hover:text-blue-500"
          >
            My Playlists
          </button>
          <button
            onClick={() => setActiveMainView("explore")}
            className="block text-left w-full text-gray-500 hover:text-blue-500"
          >
            Explore
          </button>
          <a href="#" className="block text-gray-500 hover:text-blue-500">
            Subscriptions
          </a>
          <button
            onClick={handleLogout}
            className="block text-left w-full text-red-800"
          >
            Logout
          </button>
        </nav>
      </aside>
      <button
        className="fixed top-4 left-4 z-50 block md:hidden bg-gray-900 p-2 rounded"
        onClick={() => setShowMobileMenu(true)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gray-900 p-5 z-50 transition-transform duration-300 ease-in-out ${
          showMobileMenu ? "translate-x-0" : "-translate-x-full"
        } md:hidden`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Dashboard</h2>
          <button
            onClick={() => setShowMobileMenu(false)}
            className="text-white text-xl"
          >
            ✕
          </button>
        </div>
        <nav className="space-y-4">
          {/* Same nav buttons, but close mobile menu on click */}
          <button
            onClick={() => {
              setActiveMainView("dashboard");
              setShowMobileMenu(false);
            }}
            className="block w-full text-left text-gray-300 hover:text-blue-500"
          >
            Home
          </button>
          <button
            onClick={() => {
              setActiveMainView("myVideos");
              setShowMobileMenu(false);
            }}
            className="block w-full text-left text-gray-300 hover:text-blue-500"
          >
            My Videos
          </button>
          <button
            onClick={() => {
              setActiveMainView("myPlaylists");
              setShowMobileMenu(false);
            }}
            className="block w-full text-left text-gray-300 hover:text-blue-500"
          >
            My Playlists
          </button>
          <button
            onClick={() => {
              setActiveMainView("explore");
              setShowMobileMenu(false);
            }}
            className="block w-full text-left text-gray-300 hover:text-blue-500"
          >
            Explore
          </button>
          <button
            onClick={handleLogout}
            className="block w-full text-left text-red-500"
          >
            Logout
          </button>
        </nav>
      </div>

      {/* Profile Slide-out Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[80%] md:w-[25%] backdrop-blur-md bg-gradient-to-br from-[#0e0e10]/70 to-[#1c1c20]/80 border-l border-white/10 shadow-2xl p-6 z-50 transform transition-transform duration-300 ease-in-out ${
          showSidebar ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {activeSidebarView ? "Edit Profile" : "Account Options"}
          </h2>
          <button
            onClick={() => {
              setShowSidebar(false);
              setActiveSidebarView(null);
            }}
            className="text-gray-500 hover:text-white text-lg"
          >
            ✕
          </button>
        </div>

        {!activeSidebarView && (
          <ul className="space-y-3">
            <li>
              <button
                onClick={() => setActiveSidebarView("account")}
                className="text-blue-600 hover:underline"
              >
                Update Account Details
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveSidebarView("avatar")}
                className="text-blue-600 hover:underline"
              >
                Update Avatar
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveSidebarView("cover")}
                className="text-blue-600 hover:underline"
              >
                Update Cover Image
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveSidebarView("channelProfile")}
                className="text-blue-600 hover:underline"
              >
                View Channel Profile
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveSidebarView("watchHistory")}
                className="text-blue-600 hover:underline"
              >
                Watch History
              </button>
            </li>
            <li>
              <button
                onClick={() => setShowSidebar(false)}
                className="text-red-600 hover:underline"
              >
                Close
              </button>
            </li>
          </ul>
        )}

        {activeSidebarView === "account" && (
          <UpdateAccountForm
            currentName={user?.fullName}
            currentEmail={user?.email}
            onSuccess={() => {
              setShowSidebar(false);
              setActiveSidebarView(null);
              fetchUser();
            }}
          />
        )}

        {activeSidebarView === "cover" && (
          <UpdateCoverImage
            onSuccess={() => {
              setShowSidebar(false);
              setActiveSidebarView(null);
              fetchUser();
            }}
          />
        )}

        {activeSidebarView === "avatar" && (
          <UpdateAvatarForm
            onSuccess={() => {
              setShowSidebar(false);
              setActiveSidebarView(null);
              fetchUser();
            }}
          />
        )}

        {activeSidebarView === "channelProfile" && (
          <ChannelProfileView username={user?.username} />
        )}

        {activeSidebarView === "watchHistory" && <WatchHistoryPage />}
      </div>

      {/* Main Content */}
      <main className="flex-1">
        {user?.coverImage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative w-full h-52 md:h-64 lg:h-72 overflow-hidden rounded-b-2xl shadow"
          >
            <img
              src={user.coverImage}
              alt="Cover"
              className="absolute inset-0 w-full h-full object-cover object-center"
            />

            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <div className="absolute bottom-4 left-4 flex items-center space-x-4">
              <img
                src={user.avatar}
                alt="Avatar"
                className="w-20 h-20 rounded-full border-4 border-white shadow-lg hover:shadow-blue-400 transition-shadow duration-300 ease-in-out"
                onClick={() => setShowSidebar(true)}
              />
              <div className="text-white">
                <h2 className="text-xl md:text-2xl font-bold">
                  {user.fullName}
                </h2>
                <p className="text-sm text-gray-300">@{user.username}</p>
              </div>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-20 px-4 sm:px-6"
        >
          {activeMainView === "dashboard" && (
            <>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Welcome back{" "}
                <span className="text-blue-500">{user?.username}</span> 👋
              </h1>
              <p className="text-gray-500">Here's your dashboard overview.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl shadow-md hover:shadow-blue-400 transition-all">
                  <h3 className="text-lg font-medium text-white">
                    Total Videos
                  </h3>
                  <p className="text-2xl font-bold text-blue-400">{count}</p>
                </div>
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl shadow-md hover:shadow-blue-400 transition-all">
                  <h3 className="text-lg font-medium text-white">
                    Subscribers
                  </h3>
                  <p className="text-2xl font-bold text-blue-400">
                    {profile?.subscribersCount ?? 0}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl shadow-md hover:shadow-blue-400 transition-all">
                  <h3 className="text-lg font-medium text-white">Watch Time</h3>
                  <p className="text-2xl font-bold text-blue-400">48Hrs</p>
                </div>
              </div>
            </>
          )}

          {activeMainView === "myVideos" && (
            <MyVideosSection userId={user?._id} />
          )}

          {activeMainView === "myPlaylists" && <MyPlaylists />}

          {activeMainView === "explore" && <ExploreSection />}
        </motion.div>
      </main>
    </motion.div>
  );
};

export default DashboardPage;
