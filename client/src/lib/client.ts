// have a websocket between svelte pages using svelte stores
import { readable } from "svelte/store";
import { writable } from 'svelte/store';

export const roomData = writable({
	roomCode: "",
	players: []
});

let socket: WebSocket;

export const socketStore = readable<MessageEvent | null>(null, (set) => {
	// prevents development bugs of multiple websockets
	if (import.meta.hot) {
		if (!import.meta.hot.data.wsocket) {
			socket = new WebSocket("ws://localhost:3000");
			import.meta.hot.data.wsocket = socket;
		} else {
			socket = import.meta.hot.data.wsocket;
		}
	} else if (!socket) {
		socket = new WebSocket("ws://localhost:3000");
	}

	socket.addEventListener("message", function (event) {
		set(event);
	});

	return () => { socket.close(); };
});

export enum messageType {
	test,
	joinRandomRoom,
	joinRoomCode,
	leaveRoom,
	createRoom
}

export function joinRandomRoom() {
	socket?.send(JSON.stringify({ type: messageType.joinRandomRoom }));
}

export function joinRoomCode(roomCode: string) {
	socket?.send(JSON.stringify({ type: messageType.joinRoomCode, roomCode }));
}

export function createRoom() {
	socket?.send(JSON.stringify({ type: messageType.createRoom }));
}