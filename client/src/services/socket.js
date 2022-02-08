import socketio from 'socket.io-client'

// eslint-disable-next-line
const { REACT_APP_SERVER_URL: SERVER_URL } = process.env
const socket = socketio(SERVER_URL)

export default socket
