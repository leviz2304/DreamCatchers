import React, { useEffect, useState } from "react";
import stompClient from "../../utils/WebSocket";

const Messages = ({ currentUser, receiver }) => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        stompClient.onConnect = () => {
            console.log("Connected to WebSocket");

            stompClient.subscribe("/topic/messages", (msg) => {
                const receivedMessage = JSON.parse(msg.body);
                setMessages((prev) => [...prev, receivedMessage]);
            });
        };

        stompClient.activate();

        return () => stompClient.deactivate();
    }, []);

    const sendMessage = () => {
        const chatMessage = {
            sender: currentUser.email,
            receiver: receiver.email,
            content: message,
        };

        stompClient.publish({
            destination: "/app/chat",
            body: JSON.stringify(chatMessage),
        });

        setMessage("");
    };

    return (
        <div className="grid grid-cols-12 gap-4">
            <aside className="col-span-3 bg-gray-50 border rounded-lg p-4">
                <h2 className="font-bold text-lg mb-4">Message</h2>
                <ul className="space-y-4">
                    <li className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
                        <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
                        <div className="flex-1">
                            <h3 className="text-sm font-bold">Chat with {receiver.name}</h3>
                        </div>
                    </li>
                </ul>
            </aside>
            <section className="col-span-9 bg-white border rounded-lg flex flex-col">
                <div className="flex-1 p-4 overflow-y-auto">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex items-${msg.sender === currentUser.email ? "end" : "start"}`}>
                            <div className={`bg-${msg.sender === currentUser.email ? "orange" : "gray"}-100 rounded-lg p-3 max-w-xs`}>
                                <p className="text-sm">{msg.content}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <footer className="p-4 border-t flex items-center space-x-4">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 border rounded-lg p-2"
                    />
                    <button
                        onClick={sendMessage}
                        className="bg-orange-500 text-white px-4 py-2 rounded-lg"
                    >
                        Send
                    </button>
                </footer>
            </section>
        </div>
    );
};

export default Messages;
