import type { ServerWebSocket } from "bun";

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
	createRoom
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