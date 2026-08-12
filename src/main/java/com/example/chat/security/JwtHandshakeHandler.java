package com.example.chat.security;

import lombok.RequiredArgsConstructor;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.support.DefaultHandshakeHandler;

import java.security.Principal;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class JwtHandshakeHandler extends DefaultHandshakeHandler {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @Override
    protected Principal determineUser(
            ServerHttpRequest request,
            WebSocketHandler wsHandler,
            Map<String, Object> attributes) {

        System.out.println("=== WebSocket Handshake ===");
        System.out.println("URI: " + request.getURI());
        System.out.println("Query: " + request.getURI().getQuery());

        String query = request.getURI().getQuery();

        if (query == null) {
            System.out.println("QUERY NULL!");
            return null;
        }

        String token = null;

        for (String param : query.split("&")) {
            if (param.startsWith("token=")) {
                token = param.substring("token=".length());
                break;
            }
        }

        System.out.println("Token bulundu: " + (token != null));

        if (token == null) {
            System.out.println("TOKEN NULL!");
            return null;
        }

        try {
            String username = jwtService.extractUsername(token);

            System.out.println("Username: " + username);

            var userDetails =
                    userDetailsService.loadUserByUsername(username);

            System.out.println("User bulundu: " + userDetails.getUsername());

            boolean valid =
                    jwtService.isTokenValid(token, userDetails);

            System.out.println("Token valid: " + valid);

            if (valid) {
                Principal principal =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities()
                        );

                System.out.println("Principal oluşturuldu: " + principal.getName());

                return principal;
            }

        } catch (Exception e) {
            System.out.println("JWT ERROR:");
            e.printStackTrace();
        }

        return null;
    }
}