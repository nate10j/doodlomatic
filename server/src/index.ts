import type { WebSocketHandler } from "bun";
import { handleMessages } from "./message";
import "./rooms"

type WebSocketData = {
	roomCode: string;
}

Bun.serve({
	fetch(req, server) {
		// upgrade the request to a WebSocket
		if (server.upgrade(req)) {
			return; // do not return a Response
		}
		return new Response("Upgrade failed", { status: 500 });
	},
	websocket: {
		message(ws, message) {
			handleMessages(ws, message);
		}
	},
	port: 3000,
}); 