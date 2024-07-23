import type { ServerWebSocket } from "bun";

export type player = {
	ws: ServerWebSocket;
	name: string;
	profile: string;
}