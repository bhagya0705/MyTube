import axios from 'axios';

const API = axios.create({
    baseURL: 'https://mytube-o0t3.onrender.com/api/v1/users', 
    withCredentials: true, 
});

export const registerUser = (formData) => API.post('/register', formData);
export const loginUser = (data) => API.post('/login', data);
export const getCurrentUser = () => API.get('/current-user');
export const logoutUser = () => API.post('/logout');
export const updateAccountDetails = (data)=> API.patch('/update-account',data);
export const updateCoverImage = (formdata)=> API.patch('/update-cover-image', formdata, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateAvatar = (formdata) => API.patch('/update-avatar', formdata, { headers: { 'Content-Type': 'multipart/form-data' } });
export const getChannelProfile = (username) => API.get(`/channel/${username}`);
export const uploadVideo = (formData) => API.post('/publish', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const getAllVideos = (params) =>  API.get('/videos', { params });
export const deleteVideoById = (videoId) => API.delete(`/video/${videoId}`);
export const updateVideoById = (videoId, data) => API.patch(`/video/${videoId}`, data);
export const getVideoById = (videoId) => API.get(`/video/${videoId}`);
export const toggleLike = (videoId) => API.post(`/video/${videoId}/like`);
export const toggleDisLike = (videoId) => API.post(`/video/${videoId}/dislike`);
export const getComments = (videoId) => API.get(`/video/${videoId}/comments`);
export const postComment = (videoId,content) => API.post(`/video/${videoId}/comments`,{content});
export const deleteComment = (commentId) => API.delete(`/video/${commentId}/comments`)
export const subscribeToChannel = (channelId) => API.post(`/subscribe/${channelId}`);
export const unsubscribeFromChannel = (channelId) => API.post(`/unsubscribe/${channelId}`);
export const getSubscribedChannels = () => API.get(`/subscriptions`);
export const getChannelSubscribers = (channelId) => API.get(`/subscribers/${channelId}`);
export const createPlaylist = (formData) => API.post(`/create-playlist`,formData, { headers: { 'Content-Type': 'multipart/form-data' }})
export const deletePlaylist = (playlistId) => API.delete(`/delete-playlist/${playlistId}`);
export const getUserPlaylists = (userId) => API.get(`/playlists/${userId}`);
export const addVideoToPlaylist = (playlistId,videoId) => API.post(`/add-to-playlist/${playlistId}`,{videoId});
export const summarizeVideo = (videoUrl) => API.post(`/summarize`,{videoUrl});
export const watchHistory = () => API.get(`/watch-history`);
export const addToWatchHistory =(videoId) => API.post(`/addVideo/${videoId}`);
export const removeFromWatchHistory = (videoId) => API.post(`/watch-history/remove/${videoId}`);
export const getUserVideos = () => API.get(`/user-videos`);
export const incrementView =(videoId) => API.patch(`/video/${videoId}/views`)
export default API;