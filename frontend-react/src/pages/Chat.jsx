// import React, { useState, useEffect, useRef } from 'react'
// import { useSelector } from 'react-redux'
// import { socketService, SOCKET_EMIT_SEND_MSG, SOCKET_EVENT_ADD_MSG, SOCKET_EMIT_SET_TOPIC } from '../services/socket.service'

// export function ChatApp() {
//     const [msg, setMsg] = useState({ txt: '' })
//     const [msgs, setMsgs] = useState([])
//     const [topic, setTopic] = useState('Love')
//     const [isBotMode, setIsBotMode] = useState(false)
//     const messagesEndRef = useRef(null)

//     const loggedInUser = useSelector(storeState => storeState.userModule.user)

//     const botTimeoutRef = useRef()

//     useEffect(() => {
//         socketService.on(SOCKET_EVENT_ADD_MSG, addMsg)
//         return () => {
//             socketService.off(SOCKET_EVENT_ADD_MSG, addMsg)
//             botTimeoutRef.current && clearTimeout(botTimeoutRef.current)
//         }
//     }, [])

//     useEffect(() => {
//         socketService.emit(SOCKET_EMIT_SET_TOPIC, topic)
//     }, [topic])

//     useEffect(() => {
//         scrollToBottom()
//     }, [msgs])

//     const scrollToBottom = () => {
//         messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
//     }

//     function addMsg(newMsg) {
//         setMsgs(prevMsgs => [...prevMsgs, newMsg])
//     }

//     function sendBotResponse() {
//         botTimeoutRef.current && clearTimeout(botTimeoutRef.current)
//         botTimeoutRef.current = setTimeout(() => {
//             setMsgs(prevMsgs => ([...prevMsgs, { from: 'Bot', txt: 'You are amazing!' }]))
//         }, 1250)
//     }

//     function sendMsg(ev) {
//         ev.preventDefault()
//         if (!msg.txt.trim()) return

//         const from = loggedInUser?.fullname || 'Me'
//         const newMsg = { from, txt: msg.txt }
//         socketService.emit(SOCKET_EMIT_SEND_MSG, newMsg)
//         if (isBotMode) sendBotResponse()
//         addMsg(newMsg)
//         setMsg({ txt: '' })
//     }

//     function handleFormChange(ev) {
//         const { name, value } = ev.target
//         setMsg(prevMsg => ({ ...prevMsg, [name]: value }))
//     }

//     return (
//         <div className="chat-container">
//             <div className="chat-header">
//                 <h2>Chat with Host about {topic}</h2>

//                 <div className="chat-controls">
//                     <label>
//                         <input 
//                             type="checkbox" 
//                             name="isBotMode" 
//                             checked={isBotMode}
//                             onChange={({ target }) => setIsBotMode(target.checked)} 
//                         />
//                         Bot Mode
//                     </label>

//                     <div className="topic-selector">
//                         <label>
//                             <input 
//                                 type="radio" 
//                                 name="topic" 
//                                 value="Love"
//                                 checked={topic === 'Love'} 
//                                 onChange={({ target }) => setTopic(target.value)} 
//                             />
//                             Love
//                         </label>

//                         <label>
//                             <input
//                                 type="radio" 
//                                 name="topic" 
//                                 value="Politics"
//                                 checked={topic === 'Politics'} 
//                                 onChange={({ target }) => setTopic(target.value)} 
//                             />
//                             Politics
//                         </label>
//                     </div>
//                 </div>
//             </div>

//             <div className="messages-container">
//                 <ul>
//                     {msgs.map((msg, idx) => (
//                         <li 
//                             key={idx} 
//                             className={`message-animation ${msg.from === 'Me' ? 'message-from-me' : 'message-from-other'}`}
//                         >
//                             <div className="message-sender">{msg.from}</div>
//                             <div className="message-text">{msg.txt}</div>
//                         </li>
//                     ))}
//                     <div ref={messagesEndRef} />
//                 </ul>
//             </div>

//             <form onSubmit={sendMsg} className="chat-form">
//                 <input
//                     type="text" 
//                     value={msg.txt} 
//                     onChange={handleFormChange}
//                     name="txt" 
//                     autoComplete="off"
//                     placeholder="Type your message here..."
//                 />
//                 <button disabled={!msg.txt.trim()}>Send</button>
//             </form>
//         </div>
//     )
// }