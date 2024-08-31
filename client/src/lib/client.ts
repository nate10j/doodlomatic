// have a websocket between svelte pages using svelte stores
import { goto } from "$app/navigation";
import { readable, writable, get } from "svelte/store";

export const playerData = writable<player>({
	username: ""
});

export const roomData = writable<room>({
	roomCode: "",
	players: [],
});

type room = {
	roomCode: string;
	players: player[];
}

type player = {
	username: string;
}

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
		const data = JSON.parse(event.data);
		switch (data.type) {
			case messageType.test:
				console.log("test");
				break;
			case messageType.joinedRandomRoom:
				roomData.set({ roomCode: data.roomCode, players: data.players });
				goto("/play")
				break;
			case messageType.joinedRandomRoomCreated:
				roomData.set({ roomCode: data.roomCode, players: [] });
				goto("/play")
				break;
			case messageType.joinRoomCode:
				roomData.set({ roomCode: data.roomCode, players: data.players });
				break;
			case messageType.leaveRoom:
				roomData.set({ roomCode: "", players: [] });
				break;
			case messageType.createRoom:
				roomData.set({ roomCode: data.roomCode, players: data.players });
				break;
		}
		set(event);
	});

	return () => { socket.close(); };
});

export enum messageType {
	test,
	joinRandomRoom,
	joinRoomCode,
	leaveRoom,
	createRoom,
	roomCodeDoesNotExist,
	newPlayerJoinedRoom,
	joinedRandomRoom,
	joinedRandomRoomCreated,
}

export function joinRandomRoom() {
	socket?.send(JSON.stringify({ type: messageType.joinRandomRoom, player: get(playerData)}));
}

export function joinRoomCode(roomCode: string) {
	socket?.send(JSON.stringify({ type: messageType.joinRoomCode, roomCode }));
}

export function createRoom() {
	socket?.send(JSON.stringify({ type: messageType.createRoom }));
}