const { WebSocket } = require('ws');

const server = new WebSocket.Server({
    port: 3000,
});

// List of all connected user
const clients = new Map();
// let next = null;

// On connection to server event
server.on('connection', (connection) => {
    const id = uuidv4();
    clients.set(id, connection);

    // Send initial connection setup message to user with ID
    connection.send(JSON.stringify({
        type: 'CONNECTION_SETUP',
        from: id,
    }))


    // On message from user event (user => server)
    connection.on('message', (message) => {
        const data = JSON.parse(message);
        data.from = id;

        switch(data.type) {
            // Request from user to create a chat
            case 'USER_REQUEST':
                break;

            // Send message to another user
            case 'MESSAGE':
                break;
        }
        
        /*if(message.type === "MESSAGE") {
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
        }*/

    });

    connection.on('close', () => {
        clients.delete(connection);
        //if(next == id) next = null;
    })
})

// Generating UUID for connection
function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}