
# ToGoDrawing

**Real-Time Drawing App** é uma aplicação web de **desenho colaborativo em tempo real**, desenvolvida como um **MVP** utilizando **C#**, **JavaScript**, **ASP.NET 9** e **SignalR**.

A aplicação permite que múltiplos usuários desenhem simultaneamente sobre um mesmo canvas compartilhado, organizados em **salas (rooms)**, sem necessidade de registro ou autenticação. O foco principal do projeto está na **comunicação em tempo real**, na **sincronização de estado** e em uma arquitetura clara e extensível.

---

## 🎯 Casos de Uso

Este projeto é uma aplicação de prática voltada ao aprendizado de conceitos-chave como:

- Comunicação em tempo real com **SignalR**
- Gerenciamento de múltiplos usuários concorrentes
- Sincronização de eventos entre clientes
- Separação de responsabilidades entre frontend e backend

O sistema simula um cenário real onde vários usuários colaboram em uma mesma sessão de desenho, compartilhando traços em tempo real por meio de um identificador de sala.

---

## ✨ Funcionalidades (MVP)

### 🎨 Área de Desenho

- Desenhar traços em tempo real
- Apagar traços (operação local/offline)
- Desfazer / Refazer

### 👤 Usuários

- Não requer registro ou autenticação
- Os usuários podem criar ou entrar em salas
- Cada usuário deve informar um **nome** para identificação
- Cada usuário recebe uma **cor de traço exclusiva**

### 🏠 Salas (Rooms)

- Cada sala possui um **RoomId único (GUID)**
- O RoomId representa uma sessão de desenho
- Pode ser compartilhado com outros usuários
- Suporta **2 ou mais usuários simultâneos**

### 🔄 Sincronização em Tempo Real

- Os traços são enviados ao servidor e distribuídos aos demais clientes da sala
- Novos usuários recebem o **histórico completo dos desenhos** ao entrar
- O cliente que envia um traço não o recebe de volta, evitando redundância

---

## 🧠 Arquitetura e Design

- Arquitetura inspirada em **Arquitetura Limpa (Clean Architecture)**
- Separação clara entre a lógica do cliente e do servidor
- Uso de **SignalR Hub** como canal central de comunicação
- Gerenciamento de estado em memória por meio de persistência temporária

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

- **RoomPersistence (Implementação)**

  - Armazena salas em memória
  - Cada sala mantém os usuários e seus traços

### Frontend (JavaScript)

- **RoomManager**

  - Gerenciamento da conexão SignalR
  - Criação e entrada em salas
  - Envio e recebimento de traços

- **Canvas**

  - Renderização de traços locais
  - Desenho de traços recebidos do servidor

---

## 🔁 Fluxo de Funcionamento

1. Um usuário cria uma sala
2. O servidor gera um **RoomId (GUID)**
3. O RoomId é compartilhado com outros usuários
4. Os usuários entram na sala
5. Cada traço é enviado ao servidor via SignalR
6. O servidor retransmite os traços aos demais clientes
7. Novos usuários recebem o histórico completo ao se conectar

---

## 📦 Modelo Conceitual

### Stroke

Representa um traço de desenho:

- Pontos (x, y)
- Cor

### Room (Infraestrutura)

Não representa um domínio de negócio, utilizada para gerenciar o estado em memória:

- RoomId (GUID)
- Dicionário de usuários conectados
- Dicionário interno de traços associados a cada usuário

A classe `RoomPersistence` é responsável por criar e manter esse dicionário em memória, atuando como um mecanismo de persistência temporária para a sincronização em tempo real.

---

## 🎯 Objetivos do Projeto

1. Aprender comunicação em tempo real com SignalR
2. Gerenciar múltiplos clientes concorrentes
3. Projetar uma arquitetura clara e extensível
4. Estabelecer as bases para funcionalidades futuras
5. Criar uma aplicação funcional de desenho colaborativo

---

## 🛠️ Tecnologias Utilizadas

- .NET 9
- ASP.NET Core
- SignalR
- JavaScript (Vanilla)
- HTML5 Canvas
- Blazor

---

## 📌 Status do Projeto

🚧 **Em desenvolvimento (MVP)**

A aplicação já permite desenho colaborativo em tempo real com múltiplos usuários conectados simultaneamente.

---

## 📌 Como executar

Clone o repositório e execute.

---

## 🧑‍💻 Autor

**Adrián León**  
Desenvolvedor focado em Backend com C#.

---

> Projeto desenvolvido com fins educacionais, com foco em arquitetura, tempo real e boas práticas de desenvolvimento.
