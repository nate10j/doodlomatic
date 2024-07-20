import type { ServerWebSocket } from "bun";

export enum messageType {
	test = "test",
	joinRandomRoom = "joinRandomRoom",
	joinRoomCode = "joinRoom",
	leaveRoom = "leaveRoom",
	createRoom = "createRoom"
}

export function handleMessages(ws: ServerWebSocket<unknown>, message: string | Buffer) {
	const data = JSON.parse(message.toString());
	switch (data.type) {
		case messageType.test:
			console.log(data.message);
			ws.send("Hi")
			break;
		case messageType.joinRoomCode:
			console.log("Joining room: " + data.message);
			break;
		case messageType.joinRandomRoom:
			console.log("Joining random room");
			break;
		case messageType.createRoom:
			console.log("Creating room");
			break;
	}
}