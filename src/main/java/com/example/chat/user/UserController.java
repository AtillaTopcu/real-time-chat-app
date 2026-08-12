package com.example.chat.user;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import java.security.Principal;
import java.util.List;

@RequiredArgsConstructor
@Controller
public class UserController {

    private final UserService service;

    @MessageMapping("/user.addUser")
    @SendTo("/topic/onlineUsers")
    public User addUser(
            @Payload User user,
            Principal principal
            ){
        user.setNickName(principal.getName());
        service.saveUser(user);
        return user;
    }

    @MessageMapping("/user.disconnectUser")
    @SendTo("/topic/onlineUsers")
    public User disconnect(
            @Payload User user,
            Principal principal
    ){
        user.setNickName(principal.getName());
        service.disconnect(user);
        return user;
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> findConnectedUsers(){
        return ResponseEntity.ok(service.findConnectedUsers());
    }
}
