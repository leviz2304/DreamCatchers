// src/context/StompContext.js
import React, { createContext, useEffect } from "react";
import stompClient from "../utils/WebSocket";
import { useSelector } from "react-redux";
import { toast } from "sonner";

export const StompContext = createContext();

export const StompProvider = ({ children }) => {
    const currentUser = useSelector((state) => state.login.user);

    useEffect(() => {
        if (!currentUser || !currentUser.id) return;

        // Cập nhật connectHeaders trước khi kết nối
        stompClient.configure({
            connectHeaders: {
                userId: currentUser.id.toString(),
                Authorization: `Bearer ${currentUser.token}`, // Giả sử bạn lưu token trong state
            },
        });

        // Kết nối khi provider được mount
        stompClient.activate();

        // Xử lý khi kết nối thành công
        stompClient.onConnect = () => {
            console.log("Stomp Client Connected");
            // Bạn có thể thêm logic nào đó khi kết nối thành công
        };

        // Xử lý khi ngắt kết nối
        stompClient.onDisconnect = () => {
            console.log("Stomp Client Disconnected");
        };

        // Xử lý lỗi kết nối
        stompClient.onStompError = (frame) => {
            console.error("Broker reported error: " + frame.headers["message"]);
            console.error("Additional details: " + frame.body);
            toast.error("WebSocket encountered an error. Please try again.");
        };

        return () => {
            // Ngắt kết nối khi provider bị unmount
            stompClient.deactivate();
        };
    }, [currentUser]);

    return (
        <StompContext.Provider value={stompClient}>
            {children}
        </StompContext.Provider>
    );
};
