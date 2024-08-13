import type { Serve, ServerWebSocket } from "bun";
import type { player } from "./player";
import { messageType } from "./message";
import type { WebSocketData } from "./index";

type room = {
  players: Map<string, player>;
};

const rooms = new Map<string, room>();

// generates new room code
// make sure not to make any room code duplicates
function generateRoom() {
  let roomCode: string;
  do {
    roomCode = Math.random().toString(36).substring(2, 7);
  } while (rooms.has(roomCode))
  rooms.set(roomCode, { players: new Map() });
  return roomCode;
}

function joinRoom(ws: ServerWebSocket<WebSocketData>, roomCode: string, player: player) {
  const room = rooms.get(roomCode);
  if (room) {
    room.players.set(ws.data.sessionId, player);
    ws.subscribe(roomCode);
  }
}

export function joinRandomRoom(ws: ServerWebSocket<WebSocketData>, server: ServerWebSocket<WebSocketData>, player: player) {
  // if there are no rooms, create a new room and join it
  if (rooms.size === 0) {
    const roomCode = generateRoom();
    joinRoom(ws, roomCode, player);
    ws.send(JSON.stringify({
      type: messageType.joinRandomRoom,
      roomCode,
    }));

    return;
  }
  const roomCodes = Array.from(rooms.keys());
  const randomRoomCode = roomCodes[Math.floor(Math.random() * roomCodes.length)];
  joinRoom(ws, randomRoomCode, player);

  server.publish(randomRoomCode, JSON.stringify({type: messageType.joinRandomRoom, roomCode: randomRoomCode}));
}

export function joinRoomCode(ws: ServerWebSocket<WebSocketData>, roomCode: string, player: player) {
  const room = rooms.get(roomCode);
  if (!room) {
    ws.send(JSON.stringify({
      type: messageType.roomCodeDoesNotExist,
    }));
    return null;
  }
}

export function createPrivateRoom() {
  const roomCode = generateRoom();
  const newRoom: room = {
    players: new Map(),
  }
  rooms.set(roomCode, newRoom);
  return roomCode;
}