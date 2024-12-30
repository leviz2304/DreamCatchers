import React, { useEffect, useState, useRef } from "react";
import { over } from "stompjs";
import SockJS from "sockjs-client";
import moment from "moment";
import avatarPlaceholder from "../../assets/images/Avatar.png";
import { useSelector } from "react-redux";
import { fetchInstructors, fetchStudents, getConversation } from "../../api/apiService/dataService";

let stompClient = null;

const Messages = () => {
  const currentUser = useSelector((state) => state.login.user);
  const [receiver, setReceiver] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [contacts, setContacts] = useState([]);
  const chatWindowRef = useRef(null);
  const [selectedCourseId, setSelectedCourseId] = useState(1); // Assuming this is a dynamic or pre-set course ID

  useEffect(() => {
    connectWebSocket();
    return () => {
      if (stompClient && stompClient.active) {
        stompClient.deactivate().then(() => console.log("Disconnected from WebSocket."));
      }
    };
  }, []);

  useEffect(() => {
    if (currentUser && currentUser.id) {
      const getContactsList = async () => {
        try {
          let data;
          if (currentUser.role === 'USER') {
            data = await fetchInstructors(currentUser.id); 
          } else if (currentUser.role === 'INSTRUCTOR' || currentUser.role === 'ADMIN') {
            data = await fetchStudents(currentUser.id);
          }
          setContacts(data.content);
        } catch (error) {
          console.error("Error fetching contacts:", error);
        }
      };
      getContactsList();
    }
  }, [currentUser]);

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchMessagesForContact = async (contactId) => {
    try {
      const data = await getConversation(currentUser.id, contactId, selectedCourseId);
      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const connectWebSocket = () => {
    if (stompClient && stompClient.connected) return;
    const Sock = new SockJS("http://localhost:8080/ws");
    stompClient = over(Sock);
    stompClient.connect(
      {
        userId: currentUser.id?.toString(),
        'Authorization': `Bearer ${sessionStorage.getItem("token")}`, 
      },
      onConnected,
      onError
    );
  };

  const onConnected = () => {
    console.log("Connected to WebSocket");
    if (stompClient && stompClient.connected) {
      stompClient.subscribe(`/user/${currentUser.id}/queue/messages`, onMessageReceived);
    }
  };

  const onError = (err) => {
    console.error("WebSocket connection error:", err);
    setTimeout(() => {
      connectWebSocket();
    }, 5000);
  };

  const onMessageReceived = (payload) => {
    const payloadData = JSON.parse(payload.body);
    console.log("WebSocket message received:", payloadData);
    if (
      receiver && 
      (
        (payloadData.senderId === receiver.id && payloadData.receiverId === currentUser.id) ||
        (payloadData.senderId === currentUser.id && payloadData.receiverId === receiver.id)
      )
    ) {
      setMessages((prev) => [...prev, payloadData]);
    }
  };

  const sendMessage = () => {
    if (stompClient && stompClient.connected && message.trim() !== "" && receiver) {
      const chatMessage = {
        courseId: selectedCourseId,
        receiverId: receiver.id,
        content: message,
      };

      stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
      setMessage("");

      // Optionally, show the message instantly in the UI.
      setMessages((prev) => [
        ...prev, 
        {
          senderId: currentUser.id,
          receiverId: receiver.id,
          courseId: selectedCourseId,
          content: message,
          timestamp: new Date(),
        }
      ]);
    } else {
      console.warn("WebSocket is not connected. Unable to send message.");
    }
  };

  useEffect(() => {
    if (receiver) {
      fetchMessagesForContact(receiver.id);
    }
  }, [receiver]);

  return (
    <div className="grid grid-cols-12 gap-4 h-full">
      <aside className="col-span-3 bg-gray-50 border rounded-lg p-4">
        <h2 className="font-bold text-lg mb-4">Messages</h2>
        <ul className="space-y-4">
          {contacts.map((contact) => (
            <li
              key={contact.id}
              className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
              onClick={() => {
                setReceiver(contact);
                fetchMessagesForContact(contact.id);
              }}
            >
              <img
                src={contact.avatar || avatarPlaceholder}
                alt="Contact Avatar"
                className="h-10 w-10 rounded-full"
              />
              <div className="flex-1">
                <h3 className="text-sm font-bold">
                  {contact.firstName} {contact.lastName}
                </h3>
                <p className="text-xs text-gray-500">Tap to chat</p>
              </div>
            </li>
          ))}
        </ul>
      </aside>

      {receiver ? (
        <section className="col-span-9 bg-white border rounded-lg flex flex-col">
          <div id="chatWindow" ref={chatWindowRef} className="p-4 overflow-y-auto h-96">
            {messages.map((msg, idx) => {
              const isCurrentUser = msg.senderId === currentUser.id;
              return (
                <div
                  key={idx}
                  className={`flex mb-2 ${isCurrentUser ? "justify-end" : "justify-start"}`}
                >
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
      ) : (
        <div className="col-span-9 flex items-center justify-center">
          <p>Select a contact to start chatting.</p>
        </div>
      )}
    </div>
  );
};

export default Messages;
