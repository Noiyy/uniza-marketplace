import { reactive } from "vue";
import { io } from "socket.io-client";

export const state = reactive({
  connected: false,
  onlineUsers: new Set(),
});

// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.NODE_ENV === "production" ? undefined : "http://localhost:4000";

export const socket = io(URL);

socket.on("connect", () => {
    console.log("connected");
    state.connected = true;
});

socket.on("userOnline", userId => state.onlineUsers.add(userId));
socket.on("userOffline", userId => state.onlineUsers.delete(userId));

socket.on("disconnect", () => {
    state.connected = false;
});