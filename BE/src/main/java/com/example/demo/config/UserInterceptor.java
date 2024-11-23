package com.example.demo.config;

import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.simp.stomp.StompCommand; // Import StompCommand

public class UserInterceptor implements ChannelInterceptor {
    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {

        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);

        if (StompCommand.CONNECT.equals(accessor.getCommand())) {
            // Get the user ID from the headers
            String userId = accessor.getFirstNativeHeader("userId");
            if (userId != null) {
                // Set the principal with the user ID
                accessor.setUser(new StompPrincipal(userId));
            }
        }

        return message;
    }
}