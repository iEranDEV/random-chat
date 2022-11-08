const { WebSocket } = require('ws');

const server = new WebSocket.Server({
    port: 3000,
});

// List of all connected user
const clients = new Map();
let next = null;

// On connection to server event
server.on('connection', (connection) => {
    const id = uuidv4();
    clients.set(id, connection);
    connection.send(JSON.stringify({
        type: 'CONNECTION',
        id: id,
    }))

    //connection.send("ID = " + id);

    connection.on('message', (messageAsString) => {
        const message = JSON.parse(messageAsString);
        message.from = id;

        if(message.type === "MESSAGE") {
            // Sending message to receiver
            if(message.to != null) {
                clients.get(message.to).send(JSON.stringify({
                    type: 'MESSAGE',
                    from: id,
                    to: message.to,
                    content: message.content
                }))
            }
        } else if(message.type === 'REQUEST') {
            if(next != null) {
                clients.get(id).send(JSON.stringify({
                    type: 'USER_FOUND',
                    to: next, 
                }))
                clients.get(next).send(JSON.stringify({
                    type: 'USER_FOUND',
                    to: id
                }))
            } else {
                next = id;
            }
        }

    })

    connection.on('close', () => {
        clients.delete(connection);
        if(next == id) next = null;
    })
})

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }