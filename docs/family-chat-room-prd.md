# Family Chat Room - Product Requirements Document

## Overview
A lightweight, fun web-based chat room for family members to communicate across the house in real-time. No authentication, no data persistence, just instant messaging for whoever's online.

## Purpose
Create a playful, ephemeral communication channel for family members to send quick messages to each other without leaving whatever room they're in.

---

## User Stories

**As a family member, I want to:**
- Visit the chat page and immediately start chatting by entering my name
- See who else is currently in the room
- Send and receive messages in real-time
- See when someone joins or leaves the room
- Have a fun, colorful interface that feels casual and inviting

---

## Functional Requirements

### Joining the Chat
- User lands on the page and sees a simple welcome screen
- User enters their name (required, 2-20 characters)
- User clicks "Join Chat" and immediately enters the room
- System announces "[Name] joined the chat" to all connected users

### Messaging
- Users can type messages in an input field
- Messages send on Enter key or clicking "Send"
- Messages display in a scrollable chat feed with:
  - Username
  - Message text
  - Timestamp (e.g., "2:34 PM")
- Chat auto-scrolls to newest message
- Empty messages cannot be sent

### Presence
- Display a live list of current users in the room
- Show count of active users (e.g., "3 people in the room")
- When a user disconnects:
  - Remove them from the active users list
  - Announce "[Name] left the chat"

### Session Behavior
- Messages exist only while users are connected
- No chat history loaded on join (you see only messages sent after you joined)
- Closing the browser tab/window disconnects the user
- Refreshing the page requires re-entering your name

---

## Technical Requirements

### Tech Stack
- **Frontend**: Next.js 14+ (App Router), React, TypeScript
- **Real-time Communication**: WebSocket Server (WSS) via Next.js API routes or separate WebSocket endpoint
- **Styling**: Tailwind CSS (or similar) for quick, responsive design
- **State Management**: React hooks (useState, useEffect, useRef)

### Architecture
```
┌─────────────────┐
│   Next.js App   │
│   (Client)      │
│                 │
│  - Chat UI      │
│  - WSS Client   │
└────────┬────────┘
         │
         │ WebSocket
         │ Connection
         │
┌────────┴────────┐
│  WebSocket      │
│  Server         │
│                 │
│  - Manage       │
│    connections  │
│  - Broadcast    │
│    messages     │
└─────────────────┘
```

### WebSocket Events
**Client → Server:**
- `join` - { username: string }
- `message` - { text: string }

**Server → Client:**
- `user-joined` - { username: string }
- `user-left` - { username: string }
- `message` - { username: string, text: string, timestamp: number }
- `users-list` - { users: string[] }

### Data Structures
```typescript
interface ChatMessage {
  id: string;
  username: string;
  text: string;
  timestamp: number;
}

interface User {
  id: string;
  username: string;
}
```

### No Persistence
- All data stored in memory only
- WebSocket server maintains:
  - Active connections
  - Current users list
- No database, no file storage, no logs

---

## Design Guidelines

### Visual Style
- **Bright and playful**: Use cheerful colors (pastels, primary colors)
- **Kid-friendly**: Large, clear text, rounded corners, fun fonts
- **Simple layout**: No clutter, easy to scan
- **Responsive**: Works on phones, tablets, desktops

### UI Components
1. **Welcome Screen**
   - Friendly heading ("Welcome to the Family Chat!")
   - Name input field
   - Big, inviting "Join Chat" button

2. **Chat Room**
   - Header: Room title + active user count
   - Sidebar or top bar: List of current users with fun icons/avatars
   - Main area: Message feed
   - Footer: Message input + Send button

3. **Messages**
   - Different subtle background colors per user (for visual distinction)
   - Clear sender name
   - Readable timestamp
   - System messages (joins/leaves) in italics or muted color

### Accessibility
- Keyboard navigation (Tab, Enter to send)
- Clear focus states
- Good color contrast for readability

---

## Out of Scope (V1)

**Not included in initial version:**
- Message persistence/history
- User authentication/accounts
- Private/direct messages
- Emoji picker (can type text emojis like :) or use device emoji keyboard)
- Image/file sharing
- Edit or delete messages
- Read receipts
- Typing indicators
- Push notifications

**Consider for V2:**
- Fun reactions to messages (emoji reactions)
- Sound effects for new messages
- Custom avatar selection
- Message timestamps that show "Just now" vs "5 min ago"

---

## Success Criteria

**The implementation is successful if:**
- Any family member can open the page, enter their name, and start chatting within 5 seconds
- Messages appear instantly (< 100ms) for all connected users
- The interface feels fun and inviting
- No errors when multiple people join/leave/send messages simultaneously
- Works smoothly on both desktop and mobile browsers
- Naomi can use it independently without help

---

## Development Notes

### Suggested File Structure
```
/app
  /page.tsx           # Welcome screen
  /chat/page.tsx      # Chat room
  /api/socket/route.ts # WebSocket endpoint
/components
  /WelcomeForm.tsx
  /ChatRoom.tsx
  /MessageList.tsx
  /MessageInput.tsx
  /UsersList.tsx
/lib
  /websocket.ts       # WebSocket client utilities
/types
  /chat.ts            # TypeScript interfaces
```

### Testing Checklist
- [ ] Multiple users can join and see each other
- [ ] Messages broadcast to all users
- [ ] User list updates on join/leave
- [ ] No crashes when users rapidly send messages
- [ ] Works on mobile (iPhone/Android)
- [ ] Works on desktop (Chrome, Safari, Firefox)
- [ ] Graceful handling of connection loss

---

## Questions for Implementation

1. Should we limit message length? (Suggest: 500 characters)
2. Should we prevent duplicate usernames? (Suggest: Allow for simplicity, or add number suffix)
3. Should we rate-limit messages to prevent spam? (Suggest: Yes, max 1 message per second per user)
4. What happens if no one is in the room? (Suggest: Show "You're alone! Send a message to whoever joins next")

---

**Priority**: Fun first, polish second. Get it working and playful, then iterate if needed!
