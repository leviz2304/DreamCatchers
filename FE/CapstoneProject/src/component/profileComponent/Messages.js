// Messages.js
import React, { useEffect, useState } from "react";
import { over } from "stompjs";
import SockJS from "sockjs-client";
import moment from "moment";
import avatarPlaceholder from "../../assets/images/Avatar.png";
import { useSelector } from "react-redux";
import clsx from "clsx";

let stompClient = null;

const Messages = ({ receiver }) => {
  const currentUser = useSelector((state) => state.login.user);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    connect();

    fetchMessages();

    return () => {
      if (stompClient) {
        stompClient.disconnect();
        console.log("Disconnected from WebSocket.");
      }
    };
  }, [receiver.email]);

  const connect = () => {
    const Sock = new SockJS("http://localhost:8080/ws");
    stompClient = over(Sock);
    stompClient.connect({}, onConnected, onError);
  };

  const onConnected = () => {
    console.log("Connected to WebSocket");
    // Subscribe to the private chat channel between the two users
    const chatRoomId = getChatRoomId(currentUser.email, receiver.email);
    stompClient.subscribe(`/user/${currentUser.email}/queue/messages`, onMessageReceived);

    // Send a connection message to the backend if needed
  };

  const onError = (err) => {
    console.log("WebSocket connection error:", err);
  };

  const fetchMessages = async () => {
    try {
      // Implement an API call to fetch previous messages between the users
      const response = await fetch(`/api/messages?sender=${currentUser.email}&receiver=${receiver.email}`);
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const onMessageReceived = (payload) => {
    const payloadData = JSON.parse(payload.body);
    console.log("WebSocket message received:", payloadData);
    setMessages((prev) => [...prev, payloadData]);
  };

  const sendMessage = () => {
    if (stompClient && message.trim() !== "") {
      const chatMessage = {
        sender: currentUser.email,
        receiver: receiver.email,
        content: message,
        timestamp: new Date(),
      };

      stompClient.send(`/app/chat`, {}, JSON.stringify(chatMessage));
      setMessage("");
    }
  };

  const getChatRoomId = (userEmail1, userEmail2) => {
    // Generate a unique chat room ID based on the two user emails
    return [userEmail1, userEmail2].sort().join("_");
  };

  return (
    <div className="grid grid-cols-12 gap-4 h-full">
      {/* Sidebar */}
      <aside className="col-span-3 bg-gray-50 border rounded-lg p-4">
        <h2 className="font-bold text-lg mb-4">Messages</h2>
        <ul className="space-y-4">
          {/* You can implement a list of conversations here */}
          <li className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
            <img
              src={receiver.avatar || avatarPlaceholder}
              alt="Receiver Avatar"
              className="h-10 w-10 rounded-full"
            />
            <div className="flex-1">
              <h3 className="text-sm font-bold">{receiver.name}</h3>
              <p className="text-xs text-gray-500">Tap to chat</p>
            </div>
          </li>
        </ul>
      </aside>

      {/* Chat Section */}
      <section className="col-span-9 bg-white border rounded-lg flex flex-col">
        {/* Messages Display */}
        <div className="flex-1 p-4 overflow-y-auto">
          {messages.map((msg, idx) => {
            const isCurrentUser = msg.sender === currentUser.email;
            const timeElapsed = moment(msg.timestamp).fromNow();

            return (
              <div key={idx} className={`flex mb-2 ${isCurrentUser ? "justify-end" : "justify-start"}`}>
                {!isCurrentUser && (
                  <img
                    src={receiver.avatar || avatarPlaceholder}
                    alt="Receiver Avatar"
                    className="w-8 h-8 rounded-full mr-2"
                  />
                )}
                <div
                  className={`rounded-lg p-2 max-w-xs ${
                    isCurrentUser ? "bg-orange-100 text-right" : "bg-gray-100"
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                  <span className="text-xs text-gray-500">
                    {moment(msg.timestamp).format("h:mm A")}
                  </span>
                </div>
                {isCurrentUser && (
                  <img
                    src={currentUser.avatar || avatarPlaceholder}
                    alt="Your Avatar"
                    className="w-8 h-8 rounded-full ml-2"
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Message Input */}
        <footer className="p-4 border-t flex items-center space-x-4">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 border rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-orange-500"
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
          />
          <button
            onClick={sendMessage}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
          >
            Send
          </button>
        </footer>
      </section>
    </div>
  );
};

export default Messages;
