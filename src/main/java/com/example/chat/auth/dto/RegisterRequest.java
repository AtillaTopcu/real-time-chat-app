package com.example.chat.auth.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegisterRequest {

    private String nickName;
    private String fullName;
    private String password;
}
