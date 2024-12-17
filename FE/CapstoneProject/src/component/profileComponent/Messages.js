// import React, { useEffect, useState, useRef } from "react";
// import { over } from "stompjs";
// import SockJS from "sockjs-client";
// import moment from "moment";
// import avatarPlaceholder from "../../assets/images/Avatar.png";
// import { useSelector } from "react-redux";
// import * as userApi from "../../api/apiService/authService";

// let stompClient = null;

// const Messages = () => {
//   const currentUser = useSelector((state) => state.login.user);
//   const [receiver, setReceiver] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [message, setMessage] = useState("");
//   const [contacts, setContacts] = useState([]);

//   const chatWindowRef = useRef(null);
//   console.log(currentUser)
//   useEffect(() => {
//     connect();
//     return () => {
//       if (stompClient) {
//         stompClient.disconnect();
//         console.log("Disconnected from WebSocket.");
//       }
//     };
//   }, []); // Empty dependency array to run once on mount
  
//   useEffect(() => {
//     if (currentUser && currentUser.id) {
//       const getContacts = async () => {
//         try {
//           console.log("Current User ID:", currentUser.id);
//           let data;
//           if (currentUser.role === 'USER') {
//             data = await userApi.fetchInstructors(currentUser.id);
//           } else if (currentUser.role === 'INSTRUCTOR' || currentUser.role === 'ADMIN') {
//             const response = await fetch(
//               `http://localhost:8080/students/${currentUser.id}`,
//               {
//                 headers: {
//                   'Authorization': `Bearer ${sessionStorage.getItem("token")}`,
//                   'Content-Type': 'application/json',
//                 },
//               }
//             );
//             if (!response.ok) {
//               throw new Error(`HTTP error! Status: ${response.status}`);
//             }
//             data = await response.json();
//             console.log("Test data:", data);
//           }
//           console.log(data);
//           setContacts(data);
//         } catch (error) {
//           console.error("Error fetching contacts:", error);
//         }
//       };

//       getContacts();
//     } else {
//       console.log("currentUser or currentUser.id is undefined");
//     }
//   }, [currentUser]);

//   useEffect(() => {
//     if (chatWindowRef.current) {
//       chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
//     }
//   }, [messages]);

//   const fetchMessages = async (contactId) => {
//     try {
//       const response = await fetch(
//         `http://localhost:8080/messages/${currentUser.id}/${contactId}`,
//         {
//           headers: {
//             'Authorization': `Bearer ${sessionStorage.getItem("token")}`,
//             'Content-Type': 'application/json',
//           },
//         }
//       );
//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(`HTTP error! Status: ${response.status}\n${errorText}`);
//       }
//       const data = await response.json();
//       setMessages(data);
//     } catch (error) {
//       console.error("Error fetching messages:", error);
//     }
//   };
  

//   const connect = () => {
//     const Sock = new SockJS("http://localhost:8080/ws");
//     stompClient = over(Sock);
//     stompClient.connect(
//       {
//         userId: currentUser.id.toString(),
//         'Authorization': `Bearer ${sessionStorage.getItem("token")}`, // If you need to pass authentication
//       },
//       onConnected,
//       onError
//     );
//   };
  

//   const onConnected = () => {
//     console.log("Connected to WebSocket");
//     stompClient.subscribe(
//       `/user/${currentUser.id}/queue/messages`,
//       onMessageReceived
//     );
//   };

//   const onError = (err) => {
//     console.error("WebSocket connection error:", err);
//     setTimeout(() => {
//       connect();
//     }, 5000); // Retry connection after 5 seconds
//   };

//   const onMessageReceived = (payload) => {
//     const payloadData = JSON.parse(payload.body);
//     console.log("WebSocket message received:", payloadData);
  
//     // Check if the message is related to the current conversation
//     if (receiver && (
//         (payloadData.senderId === receiver.id && payloadData.receiverId === currentUser.id) ||
//         (payloadData.senderId === currentUser.id && payloadData.receiverId === receiver.id)
//       )) {
//       setMessages((prev) => [...prev, payloadData]);
//     }
//   };
  

//   const sendMessage = () => {
//     if (stompClient && message.trim() !== "") {
//       const chatMessage = {
//         senderId: currentUser.id,
//         receiverId: receiver.id,
//         content: message,
//         timestamp: new Date(),
//       };
  
//       stompClient.send("/app/chat", {}, JSON.stringify(chatMessage));
//       setMessage("");
  
//       setMessages((prev) => [...prev, chatMessage]);
//     }
//   };
  
//   useEffect(() => {
//     if (receiver) {
//       fetchMessages(receiver.id);
//     }
//   }, [receiver]);
  
//   return (
//     <div className="grid grid-cols-12 gap-4 h-full">
//       {/* Sidebar */}
//       <aside className="col-span-3 bg-gray-50 border rounded-lg p-4">
//         <h2 className="font-bold text-lg mb-4">Messages</h2>
//         <ul className="space-y-4">
//           {contacts.map((contact) => (
//             <li
//               key={contact.id}
//               className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
//               onClick={() => {
//                 setReceiver(contact);
//                 fetchMessages(contact.id);
//               }}
//             >
//               <img
//                 src={contact.avatar || avatarPlaceholder}
//                 alt="Contact Avatar"
//                 className="h-10 w-10 rounded-full"
//               />
//               <div className="flex-1">
//                 <h3 className="text-sm font-bold">
//                   {contact.firstName} {contact.lastName}
//                 </h3>
//                 <p className="text-xs text-gray-500">Tap to chat</p>
//               </div>
//             </li>
//           ))}
//         </ul>
//       </aside>

//       {/* Chat Section or Placeholder */}
//       {receiver ? (
//         // Chat Section
//         <section className="col-span-9 bg-white border rounded-lg flex flex-col">
//           {/* Messages Display */}
//           <div
//             id="chatWindow"
//             ref={chatWindowRef}
//             className="p-4 overflow-y-auto h-96"
//           >
//             {messages.map((msg, idx) => {
//               const isCurrentUser = msg.senderId === currentUser.id;
//               return (
//                 <div
//                   key={idx}
//                   className={`flex mb-2 ${
//                     isCurrentUser ? "justify-end" : "justify-start"
//                   }`}
//                 >
//                   {!isCurrentUser && (
//                     <img
//                       src={receiver.avatar || avatarPlaceholder}
//                       alt="Receiver Avatar"
//                       className="w-8 h-8 rounded-full mr-2"
//                     />
//                   )}
//                   <div
//                     className={`rounded-lg p-2 max-w-xs ${
//                       isCurrentUser
//                         ? "bg-orange-100 text-right"
//                         : "bg-gray-100"
//                     }`}
//                   >
//                     <p className="text-sm">{msg.content}</p>
//                     <span className="text-xs text-gray-500">
//                       {moment(msg.timestamp).format("h:mm A")}
//                     </span>
//                   </div>
//                   {isCurrentUser && (
//                     <img
//                       src={currentUser.avatar || avatarPlaceholder}
//                       alt="Your Avatar"
//                       className="w-8 h-8 rounded-full ml-2"
//                     />
//                   )}
//                 </div>
//               );
//             })}
//           </div>

//           {/* Message Input */}
//           <footer className="p-4 border-t flex items-center space-x-4">
//             <input
//               type="text"
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//               placeholder="Type your message..."
//               className="flex-1 border rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-orange-500"
//               onKeyDown={(e) => {
//                 if (e.key === "Enter") sendMessage();
//               }}
//             />
//             <button
//               onClick={sendMessage}
//               className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
//             >
//               Send
//             </button>
//           </footer>
//         </section>
//       ) : (
//         // Placeholder when no contact is selected
//         <div className="col-span-9 flex items-center justify-center">
//           <p>Select a contact to start chatting.</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Messages;
