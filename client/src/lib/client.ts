// have a websocket between svelte pages using svelte stores
import { readable } from "svelte/store";

let ws: WebSocket;

export const socket = readable<WebSocket | null>(null, (set) => {
	if (typeof WebSocket !== "undefined") {
		// creates a new websocket in dev mode so it doesn't interfere
		// prevents development bugs
		if (import.meta.hot) {
			if (!import.meta.hot.data.wsocket) {
				ws = new WebSocket("ws://localhost:3000");
				import.meta.hot.data.wsocket = ws;
			} else {
				ws = import.meta.hot.data.wsocket;
			}
		} else if (!ws) {
			ws = new WebSocket("ws://localhost:3000");
		}

		ws.addEventListener("open", () => {
			set(ws);
		});
	}

	return () => { };
});


export enum messageType {
	test,
	joinRandomRoom,
	joinRoomCode,
	leaveRoom,
	createRoom
}

export function joinRandomRoom() {
	ws.send(JSON.stringify({ type: messageType.joinRandomRoom }));
}

export function joinRoomCode(roomCode: string) {
	ws.send(JSON.stringify({ type: messageType.joinRoomCode, roomCode }));
}

export function createRoom() {
	ws.send(JSON.stringify({ type: messageType.createRoom }));
}