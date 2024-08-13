import type { ServerWebSocket } from "bun";
import type { WebSocketData } from "./index";
import { createPrivateRoom, joinRoomCode, joinRandomRoom } from "./rooms";

// for sake of convenience and performance since using an enum
// will default go to 1s and 2s and 3s so they dont have to send strings
// and it will still be readable
// and less data is sent, which is better performance
// copy and paste this enum into client so they can use the enum
export enum messageType {
	test,
	joinRandomRoom,
	joinRoomCode,
	leaveRoom,
	createRoom,
	roomCodeDoesNotExist,
}

export function handleMessages(server: any, ws: ServerWebSocket<WebSocketData>, message: string | Buffer) {
	const data = JSON.parse(message.toString());
	switch (data.type) {
		case messageType.test:
			console.log(data.message);
			ws.send("Hi")
			break;
		case messageType.joinRoomCode:
			joinRoomCode(ws, data.message.roomCode, data.player);
			break;
		case messageType.joinRandomRoom:
			joinRandomRoom(ws, server, data.player);
			break;
		case messageType.createRoom:
			console.log("Creating room");
			break;
	}
}