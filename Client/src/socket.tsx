import {io} from 'socket.io-client'

console.log("WS URL:", import.meta.env.VITE_WS_URL);
export const socket = io(import.meta.env.VITE_WS_URL, {
  withCredentials: true,
  transports:["websocket","polling"],
  autoConnect:true
});