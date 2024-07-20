// have a websocket between svelte pages using svelte stores
import { readable } from "svelte/store";

let ws: WebSocket;

export const socket = readable<WebSocket | null>(null, (set) => {
	ws = new WebSocket("ws://localhost:3000");
	ws.addEventListener("open", () => {
		set(ws);
	});
	
	return () => {
		ws.close();
	};
});

function sendMessage(type: messageType, message?: string) {
	ws.send(JSON.stringify({ type, message }));
}

export enum messageType {
	test = "test",
	joinRandomRoom = "joinRandomRoom",
	joinRoomCode = "joinRoom",
	leaveRoom = "leaveRoom",
	createRoom = "createRoom"
}

export function joinRandomRoom() {
	sendMessage(messageType.joinRandomRoom);
}

export function joinRoomCode(roomCode: string) {
	sendMessage(messageType.joinRoomCode, roomCode);
}

export function createRoom() {
	sendMessage(messageType.createRoom);
}