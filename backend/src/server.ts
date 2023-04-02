import * as dotenv from 'dotenv';
dotenv.config();
import * as express from 'express';
import * as cors from 'cors';
import * as http from 'http'
import * as WebSocket from 'ws'
import { initMessageEndpoints } from './rest/messages';
import { listenToNewPosts } from './util/program-watcher';


const app: express.Express = express()

const server = http.createServer(app)

const socket = new WebSocket.Server({server: server})

socket.on("connection", (event) => {
    console.log("CLIENTS:", socket.clients.size)
    //socket.clients.forEach((client: WebSocket) => client.send("HELLO FROM SERVER"))
})

app.use(cors())

const port = process.env.PORT
app.use(express.json())


//initialze the Rest endpoints
function initEndpoints() {
    initMessageEndpoints(app);
    listenToNewPosts(socket.clients);
}

initEndpoints();

server.listen(port, () => {
    console.log(`server started on port ${port}`)
})