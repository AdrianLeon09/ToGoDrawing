🇪🇸 ¿Hablas español? [Ir a la documentacion](https://github.com/AdrianLeon09/ToGoDrawing/blob/master/readme_es.md)

🇵🇹 ¿Fala português? [Ir para a documentação](https://github.com/AdrianLeon09/ToGoDrawing/blob/master/readme_pt.md)

# ToGoDrawing

**ToGoDrawing** is a **real-time collaborative drawing web application**, developed as an **MVP** using **C#**, **JavaScript**, **ASP.NET 9**, and **SignalR**.

The application allows multiple users to draw simultaneously on a shared canvas, organized into **rooms**, with no registration or authentication required. The main focus of the project is **real-time communication**, **state synchronization**, and a clear and extensible architecture.

---

## 🎯 Use Cases

This project is a practice-oriented application focused on learning key concepts such as:

- Real-time communication with **SignalR**
- Management of multiple concurrent users
- Event synchronization between clients
- Separation of responsibilities between frontend and backend

The system simulates a real-world scenario where multiple users collaborate within the same drawing session, sharing strokes in real time through a room identifier.

---

## ✨ Features (MVP)

### 🎨 Drawing Area

- Draw strokes in real time
- Erase strokes (local/offline operation)
- Undo / Redo

### 👤 Users

- No registration or authentication required
- Users can create or join rooms
- Each user must provide a **name** for identification
- Each user is assigned a **unique stroke color**

### 🏠 Rooms

- Each room has a **unique RoomId (GUID)**
- The RoomId represents a drawing session
- Can be shared with other users
- Supports **2 or more concurrent users**

### 🔄 Real-Time Synchronization

- Strokes are sent to the server and distributed to other clients in the room
- New users receive the **complete drawing history** upon joining
- The client that sends a stroke does not receive it back, avoiding redundancy

---

## 🧠 Architecture and Design

- Architecture inspired by **Clean Architecture**
- Clear separation between client-side and server-side logic
- Use of a **SignalR Hub** as the central communication channel
- In-memory state management through temporary persistence

### Backend (C# / ASP.NET 9)

- **RoomStrokeHub**

  - `CreateRoom`
  - `JoinRoom`
  - `SendStrokesServer`
  - `ReceiveStrokesServer`

- **RoomPersistence (Interface)**

  - `CreatePersistence`
  - `AddToDictionary`
  - `GetRoomDictionary`

- **RoomPersistence (Implementation)**

  - Stores rooms in memory
  - Each room maintains users and their strokes

### Frontend (JavaScript)

- **RoomManager**

  - SignalR connection management
  - Room creation and joining
  - Sending and receiving strokes

- **Canvas**

  - Rendering local strokes
  - Drawing strokes received from the server

---

## 🔁 Application Flow

1. A user creates a room
2. The server generates a **RoomId (GUID)**
3. The RoomId is shared with other users
4. Users join the room
5. Each stroke is sent to the server via SignalR
6. The server broadcasts strokes to other clients
7. New users receive the full drawing history upon connecting

---

## 📦 Conceptual Model

### Stroke

Represents a drawing stroke:

- Points (x, y)
- Color

### Room (Infrastructure)

Does not represent a business domain; it is used to manage in-memory state:

- RoomId (GUID)
- Dictionary of connected users
- Internal dictionary of strokes associated with each user

The `RoomPersistence` class is responsible for creating and maintaining this in-memory dictionary, acting as a temporary persistence mechanism for real-time synchronization.

---

## 🎯 Project Objectives

1. Learn real-time communication with SignalR
2. Manage multiple concurrent clients
3. Design a clear and extensible architecture
4. Establish a foundation for future features
5. Create a functional collaborative drawing application

---

## 🚀 Future Improvements

- Local persistence
- Additional drawing tools
- Synchronization optimization

---

## 🛠️ Technologies Used

- .NET 9
- ASP.NET Core
- SignalR
- JavaScript (Vanilla)
- HTML5 Canvas
- Blazor

---

## 📌 Project Status

🚧 **In development (MVP)**

The application already supports real-time collaborative drawing with multiple users connected simultaneously.

---

## 🧑‍💻 Author

**Adrián León**  
Backend-focused developer with C#.

---

> Project developed for educational purposes, with a focus on architecture, real-time systems, and development best practices.

