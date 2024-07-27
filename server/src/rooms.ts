import type { ServerWebSocket } from "bun";
import type { player } from "./player";
import { messageType } from "./message";
import type { server } from "typescript";

type room = {
  players: player[];
};

const rooms = new Map<string, room>();

// generates new room code
// make sure not to make any room code duplicates
function generateRoomCode() {
  let roomCode: string;
  do {
    roomCode = Math.random().toString(36).substring(2, 7);
  } while (rooms.has(roomCode))
  rooms.set(roomCode, { players: [] });
  return roomCode;
}

function joinRoom(roomCode: string, player: player) {
  const room = rooms.get(roomCode);
  if (room) {
    room.players.push(player);
    player.ws.subscribe(roomCode);
  }
}

export function joinRandomRoom(player: player, server: any) {
  if (rooms.size === 0) {
    const roomCode = generateRoomCode();
    rooms.set(roomCode, { players: [] });
    joinRoom(roomCode, player);
    server.publish(roomCode, JSON.stringify(`Room Code: ${roomCode}`));

    return;
  }
  const roomCodes = Array.from(rooms.keys());
  const randomRoomCode = roomCodes[Math.floor(Math.random() * roomCodes.length)];
  joinRoom(randomRoomCode, player);

  server.publish(randomRoomCode, JSON.stringify({type: messageType.joinRandomRoom, roomCode: randomRoomCode}));
}

export function joinRoomCode(roomCode: string, player: player) {
  const room = rooms.get(roomCode);
  if (!room) {
    player.ws.send(JSON.stringify({
      type: messageType.roomCodeDoesNotExist,
    }));
    return null;
  }
}

export function createPrivateRoom() {
  const roomCode = generateRoomCode();
  const newRoom = {
    players: []
  }
  rooms.set(roomCode, newRoom);
  return roomCode;
}