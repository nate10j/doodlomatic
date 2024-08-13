import type { WebSocketHandler } from "bun";
import { handleMessages } from "./message";
import "cookie";
import "./rooms"

export type WebSocketData = {
	roomCode: string;
	sessionId: string;
}

// in the future we use redis
const sessionIds = new Set<string>();

function generateSessionId() {
	// generate a random session id of characters, numbers etc
	// make sure when generting session id it dont generate duplicates
	let sessionId: string;
	do {
		sessionId = Date.now().toString(36) + Math.random().toString(36).substring(2, 7);
	} while (sessionIds.has(sessionId))
	sessionIds.add(sessionId);
	return sessionId;
}

const server = Bun.serve<WebSocketData>({
	fetch(req, server) {
		// upgrade the request to a WebSocket
		server.upgrade(req, {
			data: {
				roomCode: "",
				sessionId: generateSessionId()
			}
		})
		return new Response("Upgrade failed", { status: 500 });
	},
	websocket: {
		open(ws) {
			// nothing rn
		},
		message(ws, message) {
			handleMessages(server, ws, message);
		},
		close(ws) {
			sessionIds.delete(ws.data.sessionId);
		}
	},
	port: 3000,
}); 