# Real-Time Drawing App

**Real-Time Drawing App** es una aplicación web de **dibujo colaborativo en tiempo real**, desarrollada como un **MVP** utilizando **C#**, **JavaScript**, **ASP.NET 9** y **SignalR**.

La aplicación permite que múltiples usuarios dibujen simultáneamente sobre un mismo canvas compartido, organizados en **salas (rooms)**, sin necesidad de registro ni autenticación. El foco principal del proyecto está en la **comunicación en tiempo real**, la **sincronización de estado** y una arquitectura clara y extensible.

---

## 🎯 Casos de Uso

Este proyecto es una aplicación de práctica orientada al aprendizaje de conceptos clave como:

- Comunicación en tiempo real con **SignalR**
- Manejo de múltiples usuarios concurrentes
- Sincronización de eventos entre clientes
- Separación de responsabilidades entre frontend y backend

El sistema simula un escenario real donde varios usuarios colaboran en una misma sesión de dibujo, compartiendo trazos en tiempo real mediante un identificador de sala.

---

## ✨ Funcionalidades (MVP)

### 🎨 Área de Dibujo

- Dibujar trazos en tiempo real
- Borrar trazos (operación local/offline)
- Deshacer / Rehacer

### 👤 Usuarios

- No requiere registro ni autenticación
- Los usuarios pueden crear o unirse a salas
- Cada usuario debe indicar un **nombre** para identificación
- Cada usuario recibe una **cor de trazo exclusiva**

### 🏠 Salas (Rooms)

- Cada sala posee un **RoomId único (GUID)**
- El RoomId representa una sesión de dibujo
- Puede ser compartido con otros usuarios
- Soporta **2 o más usuarios simultáneos**

### 🔄 Sincronización en Tiempo Real

- Los trazos se envían al servidor y se distribuyen a los demás clientes de la sala
- Los nuevos usuarios reciben el **historial completo de dibujos** al entrar
- El cliente que envía un trazo no lo recibe de vuelta, evitando redundancia

---

## 🧠 Arquitectura y Diseño

- Arquitectura inspirada en **Arquitectura Limpia (Clean Architecture)**, organizada en torno a **Rooms** y **Strokes**&#x20;
- Separación clara entre lógica de cliente y servidor
- Uso de **SignalR Hub** como canal central de comunicación
- Manejo de estado en memoria mediante persistencia temporal

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

- **RoomPersistence (Implementación)**

  - Almacena salas en memoria
  - Cada sala mantiene usuarios y sus trazos

### Frontend (JavaScript)

- **RoomManager**

  - Manejo de conexión SignalR
  - Creación y unión a salas
  - Envío y recepción de trazos

- **Canvas**

  - Renderizado de trazos locales
  - Dibujo de trazos recibidos desde el servidor

---

## 🔁 Flujo de Funcionamiento

1. Un usuario crea una sala
2. El servidor genera un **RoomId (GUID)**
3. El RoomId es compartido con otros usuarios
4. Los usuarios se unen a la sala
5. Cada trazo se envía al servidor mediante SignalR
6. El servidor retransmite los trazos al resto de clientes
7. Los nuevos usuarios reciben el historial completo al conectarse

---

## 📦 Modelo Conceptual

### Stroke

Representa un trazo de dibujo:

- &#x20;Puntos (x, y)

- Color



### Room (Infraestructura)

No representa un dominio de negocio. Es una **estructura técnica de infraestructura**, utilizada para gestionar el estado en memoria:

- RoomId (GUID)
- Diccionario de usuarios conectados
- Diccionario interno de trazos asociados a cada usuario

La clase `RoomPersistence` es responsable de crear y mantener este diccionario en memoria, actuando como un mecanismo de persistencia temporal para la sincronización en tiempo real.

---

## 🎯 Objetivos del Proyecto

1. Aprender comunicación en tiempo real con SignalR
2. Manejar múltiples clientes concurrentes
3. Diseñar una arquitectura clara y extensible
4. Sentar las bases para funcionalidades futuras
5. Crear una aplicacion funcional de dibujo colaborativo

---

## 🚀 Próximas Mejoras

- Persistencia local
- Más herramientas de dibujo
- Optimización de sincronización

---

## 🛠️ Tecnologías Utilizadas

- .NET 9
- ASP.NET Core
- SignalR
- JavaScript (Vanilla)
- HTML5 Canvas
- Blazor&#x20;



---

## 📌 Estado del Proyecto

🚧 **En desarrollo (MVP)**

La aplicación ya permite dibujo colaborativo en tiempo real con múltiples usuarios conectados simultáneamente.

---

## 🧑‍💻 Autor

**Adrián León**\
Desarrollador enfocado en Backend con C#

---

> Proyecto desarrollado con fines educativos, enfocado en arquitectura, tiempo real y buenas prácticas de desarrollo.


---