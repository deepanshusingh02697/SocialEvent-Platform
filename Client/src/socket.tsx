import {io} from 'socket.io-client'

// export const socket = io("http://localhost:4003", {
export const socket = io("https://socialevent-platform-snhu.onrender.com/graphql", {
  withCredentials: true,
  transports:["websocket","polling"],
  autoConnect:true//socket.connect()
});