import type { Serve, ServerWebSocket } from "bun";
import type { player } from "./player";
import { messageType } from "./messageTypes";
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
    // send the room data to the client
    ws.send(JSON.stringify({
      type: messageType.joinedRandomRoomCreated,
      roomCode: roomCode,
    }));
    joinRoom(ws, roomCode, player);
    return;
  }
  const roomCodes = Array.from(rooms.keys());
  const randomRoomCode = roomCodes[Math.floor(Math.random() * roomCodes.length)];
  // send the room data to the client 
  ws.send(JSON.stringify({
    type: messageType.joinedRandomRoom,
    roomCode: randomRoomCode,
    players: rooms.get(randomRoomCode)?.players
  }));
  console.log(rooms.get(randomRoomCode)?.players);
  joinRoom(ws, randomRoomCode, player);

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