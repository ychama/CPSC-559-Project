import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const WebSocket = require('ws');

const serverId = process.env.SERVER_ID;

const writeToServer = async () => {
    


    if("WRITE_PORT" in process.env){

        const address = 'ws://backend_a:' + process.env.WRITE_PORT;

        // Create WebSocket connection.
        const socket = new WebSocket(address);
        
        console.log('The address sending to is ' + address);
        

        // Connection opened
        socket.addEventListener('open', function (event) {
            socket.send('Hello from ' + serverId);
        });

        // Listen for messages
        socket.addEventListener('message', function (event) {
            console.log('Message from the other server: ', event.data);
        });

    } else {
        console.log("I am not a writer " + serverId);
    }
};

export default writeToServer;
