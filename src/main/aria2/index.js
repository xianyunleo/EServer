import Aria2 from "aria2";

const aria2 = new Aria2({ WebSocket: ws, fetch: nodefetch, ...options });
