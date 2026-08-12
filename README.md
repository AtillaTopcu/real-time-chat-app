# 💬 Real-Time Chat Application

A full-stack real-time chat web application built with **Spring Boot** and **React.js**.

The application provides secure user authentication, online user tracking, private conversations, persistent chat history, and real-time communication using **WebSocket, STOMP, and SockJS**.

---

## 🚀 Features

* 🔐 JWT-based authentication
* 📝 User registration and login
* 👥 Online user tracking
* 🟢 Online/offline user status
* 💬 Private one-to-one conversations
* 📡 Real-time communication with WebSocket
* 🔄 STOMP messaging
* 📜 Persistent chat history
* 🗄️ PostgreSQL database integration
* 🔒 WebSocket authentication
* 🌐 REST API
* ⚛️ React.js frontend

---

## 🛠️ Technologies

### Backend

* Java
* Spring Boot
* Spring Security
* Spring WebSocket
* STOMP
* SockJS
* JWT
* Spring Data JPA
* Hibernate
* PostgreSQL
* Maven

### Frontend

* React.js
* JavaScript
* Vite
* STOMP.js
* SockJS Client
* CSS

---

## 🏗️ Architecture

The application uses a full-stack architecture where **React.js** handles the user interface and **Spring Boot** provides the REST API, authentication, database operations, and WebSocket communication.

```text
                    ┌─────────────────────┐
                    │                     │
                    │      React.js       │
                    │      Frontend       │
                    │                     │
                    └──────────┬──────────┘
                               │
                    ┌──────────┴──────────┐
                    │                     │
                    │      REST API       │
                    │                     │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │                     │
                    │    Spring Boot      │
                    │      Backend        │
                    │                     │
                    ├─────────────────────┤
                    │ Spring Security     │
                    │ JWT Authentication  │
                    │ WebSocket / STOMP   │
                    │ Spring Data JPA     │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │                     │
                    │     PostgreSQL      │
                    │      Database       │
                    │                     │
                    └─────────────────────┘
```

---

## 🔐 Authentication

Authentication is implemented using **Spring Security and JWT**.

After a successful login, the backend generates a JWT token which is used by the frontend when accessing protected resources.

The WebSocket connection is also authenticated using the JWT token.

```text
User
 │
 │ Login
 ▼
Spring Boot
 │
 │ JWT
 ▼
React
 │
 │ JWT
 ▼
WebSocket Handshake
 │
 ▼
Authenticated Connection
```

---

## 📡 Real-Time Communication

The application uses **WebSocket with STOMP and SockJS** for real-time communication.

STOMP provides a messaging protocol on top of the WebSocket connection, allowing the application to publish and subscribe to destinations.

Example destinations include:

```text
/app/user.addUser
/topic/onlineUsers
```

Private messaging is handled through user-specific chat destinations.

---

## 👥 Online Users

When a user establishes a WebSocket connection, the backend tracks the user's online status.

The online user list is distributed through the WebSocket broker, allowing connected clients to receive updates without manually refreshing the page.

```text
Client
  │
  │ /app/user.addUser
  ▼
Spring Boot
  │
  │ Publish
  ▼
/topic/onlineUsers
  │
  ▼
Connected Clients
```

---

## 💬 Private Messaging

Users can select another online user and start a private conversation.

Messages are:

1. Sent from the React client.
2. Transmitted through the WebSocket connection.
3. Processed by the Spring Boot backend.
4. Stored in PostgreSQL.
5. Delivered to the appropriate recipient.

Previously stored messages can also be retrieved when opening a conversation.

---

## 🗄️ Database

The application uses **PostgreSQL** for persistent data storage.

The main entities include:

* `User`
* `ChatRoom`
* `ChatMessage`

Spring Data JPA and Hibernate are used for database interaction and entity management.

---

## 📂 Project Structure

```text
chat/
│
├── src/
│   ├── main/
│   │   ├── java/com/example/chat/
│   │   │
│   │   ├── auth/
│   │   │   ├── AuthController.java
│   │   │   ├── AuthService.java
│   │   │   └── dto/
│   │   │
│   │   ├── chat/
│   │   │   ├── ChatController.java
│   │   │   ├── ChatMessage.java
│   │   │   ├── ChatMessageRepository.java
│   │   │   └── ChatMessageService.java
│   │   │
│   │   ├── chatroom/
│   │   │
│   │   ├── config/
│   │   │
│   │   ├── security/
│   │   │
│   │   └── user/
│   │
│   └── resources/
│       ├── application.yml
│       └── static/
│           └── chat-frontend/
│               ├── src/
│               ├── public/
│               ├── package.json
│               └── vite.config.js
│
├── pom.xml
├── mvnw
└── mvnw.cmd
```

---

## ⚙️ Configuration

Sensitive configuration values are provided through environment variables instead of being stored directly in the source code.

The application requires the following environment variables:

```text
DB_URL=jdbc:postgresql://localhost:5432/chatdb
DB_USERNAME=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret
```

The JWT expiration can optionally be configured with:

```text
JWT_EXPIRATION=86400000
```

---

## ▶️ Running the Application

### 1. Clone the repository

```bash
git clone https://github.com/AtillaTopcu/real-time-chat-app.git
cd real-time-chat-app
```

### 2. Configure PostgreSQL

Create a PostgreSQL database:

```text
chatdb
```

Then configure the required environment variables.

### 3. Start the Spring Boot application

On Windows:

```bash
mvnw.cmd spring-boot:run
```

Or using Maven:

```bash
mvn spring-boot:run
```

### 4. Frontend

The React frontend is located at:

```text
src/main/resources/static/chat-frontend/
```

Install dependencies:

```bash
npm install
```

Start the Vite development server:

```bash
npm run dev
```

---

## 📸 Screenshots

Screenshots of the application will be added after the final UI improvements.

### Login

*Coming soon.*

### Chat Interface

*Coming soon.*

### Online Users

*Coming soon.*

---

## 🚧 Project Status

The core functionality of the application has been implemented, including authentication, WebSocket communication, online user tracking, private conversations, and persistent chat history.

The project is currently undergoing final UI improvements and refinements to the real-time messaging experience.

---

## 🔮 Future Improvements

* [ ] Improve real-time message synchronization
* [ ] Complete final UI/UX improvements
* [ ] Add typing indicators
* [ ] Add read/unread message status
* [ ] Add message notifications
* [ ] Add profile pictures
* [ ] Add group conversations
* [ ] Add message editing and deletion
* [ ] Deploy the application to a production environment

---

## 🎯 Purpose

This project was developed to gain hands-on experience with:

* Full-stack web application development
* Spring Boot REST APIs
* Spring Security and JWT authentication
* WebSocket communication
* STOMP messaging
* React.js
* PostgreSQL and JPA
* Real-time application architecture
* Client-server communication

This project is currently intended for educational and portfolio purposes.
