import socketio from 'socket.io-client'

// eslint-disable-next-line
const { serverUrl } = CONFIG

const socket = socketio(serverUrl)

export default socket
