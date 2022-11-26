const { WebSocket } = require('ws');

const server = new WebSocket.Server({
    port: 3000,
});

// List of all connected user
const clients = new Map();
const pairs = new Map();
let next = null;

// On connection to server event
server.on('connection', (connection) => {
    const id = uuidv4();
    clients.set(id, connection);

    // Send initial connection setup message to user with ID
    connection.send(JSON.stringify({
        type: 'CONNECTION_SETUP',
        from: id,
    }));

    // On message from user event (user => server)
    connection.on('message', (message) => {
        const data = JSON.parse(message);

        switch(data.type) {
            // Request from user to create a chat
            case 'USER_REQUEST':
                if(next == null) {
                    // If there is no next user, set up the queue with ID
                    next = id;
                } else {
                    // Send USER_FOUND message to current user
                    connection.send(JSON.stringify({
                        type: 'USER_RESPONSE',
                        to: next
                    }));

                    // Send USER_FOUND message to first user in queue
                    clients.get(next).send(JSON.stringify({
                        type: 'USER_RESPONSE',
                        to: id,
                    }))

                    pairs.set(next, id);
                    pairs.set(id, next);

                    // Clear the queue
                    next = null;
                }
                break;

            // Send message to another user
            case 'MESSAGE':
                clients.get(data.to).send(JSON.stringify({
                    type: 'MESSAGE',
                    from: id,
                    to: data.to,
                    content: data.content,
                }))
                break;
            

            // User disconnected
            case 'DISCONNECTED':
                pairs.delete(data.from);
                pairs.delete(data.to);
                clients.get(data.to).send(JSON.stringify({
                    type: 'DISCONNECTED',
                    from: data.from,
                    to: data.to
                }))
                break;
        }

    });

    // Connection close handler
    connection.on('close', () => {
        // Remove user connection from users map
        let val = pairs.get(id);
        if(val) {
            pairs.delete(val);
            pairs.delete(id);
            clients.get(val).send(JSON.stringify({
                type: 'DISCONNECTED',
                from: id,
                to: val
            }))
        }
        clients.delete(id);

        // Check if user was in queue
        if(next == id) {
            next = null;
        }
    })
})

// Generating UUID for connection
function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}