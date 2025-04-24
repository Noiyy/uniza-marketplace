import { reactive } from "vue";
import { io } from "socket.io-client";

export const state = reactive({
	connected: false,
	onlineUsers: new Set(),
});

// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.NODE_ENV === "production" ? undefined : "http://localhost:4000";

// export const socket = io(URL, {
// 	autoConnect: false,
// 	reconnection: false
// });
export const socket = io(URL);

socket.on("connect", () => {
    console.log("connected");
    state.connected = true;
});

socket.on("userOnline", userId => {
	state.onlineUsers.add(userId);
	socket.emit("updateOnlineUsers");
});
socket.on("userOffline", userId => {
	state.onlineUsers.delete(userId);
	socket.emit("updateOnlineUsers");
});

socket.on("disconnect", () => {
	console.log("disconnected");
    state.connected = false;
});

export const forceDisconnect = () => {
	if (socket.connected) {
		socket.disconnect();
	}
};