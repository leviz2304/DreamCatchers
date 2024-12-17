// src/utils/stompClient.js
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const socketUrl = "http://localhost:8080/ws";

const stompClient = new Client({
    // Không sử dụng brokerURL khi đã định nghĩa webSocketFactory
    webSocketFactory: () => new SockJS(socketUrl),
    reconnectDelay: 5000,
    debug: (str) => console.log(str),
    // Thêm các header cần thiết khi kết nối
    connectHeaders: {
        // Sẽ được cập nhật trong StompProvider dựa trên userId và token
    },
});

export default stompClient;
