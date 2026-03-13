

# Redesign: Claude-style Light Theme iOS Chat App

Redesign the current dark glassmorphic chat app into a warm, light-themed iOS chat interface matching the Claude app screenshots.

## Key Design Changes

**Color Palette** — Warm beige/cream tones replacing the dark theme:
- Background: warm off-white `#FAF6F1` (Claude's signature cream)
- Cards/surfaces: white with subtle warm shadows
- Text: dark brown/charcoal instead of white
- Accent: warm terracotta/orange `#C4704B` for the new chat button
- Muted text: warm gray `#8E8A85`

**Layout — Two Views**

1. **Sidebar/List View** (image 1):
   - Large "Nodum" brand title top-left
   - Navigation items: Chats, Projects, Artifacts, Code (with icons)
   - "Starred" section with project items (bold name + briefcase icon)
   - "Recents" section with conversation titles
   - Bottom bar: user avatar + name, floating orange "+" FAB button

2. **Empty Chat View** (image 2):
   - Top bar: hamburger menu left, model selector center ("Nodum 4o" + "Extended"), avatar right
   - Center: decorative icon + "How can I help you this evening?" greeting
   - Bottom: pill-shaped input "Chat with Nodum..." + mic + audio button

## Files to Modify

1. **`src/index.css`** — Replace all CSS variables with light/warm theme tokens
2. **`src/pages/Index.tsx`** — Restructure for sidebar drawer pattern + empty state
3. **`src/components/chat/ConversationList.tsx`** — Redesign as full sidebar with nav sections (Chats, Projects, Artifacts, Code), Starred projects, Recents list, user profile bar
4. **`src/components/chat/ChatView.tsx`** — Add empty state with greeting, update header to match (hamburger, model selector, avatar)
5. **`src/components/chat/ChatBubble.tsx`** — Restyle for light theme (no glass effects, clean rounded bubbles)
6. **`src/components/chat/ChatInput.tsx`** — Pill-shaped light input bar matching Claude's "Chat with Claude" style
7. **`src/components/chat/TypingIndicator.tsx`** — Update colors for light theme
8. **`tailwind.config.ts`** — Update font and color references if needed

## Technical Approach

- Use a slide-over drawer pattern for the sidebar (CSS transform, no extra library)
- The sidebar overlays the chat view from the left, matching iOS Claude behavior
- Empty chat state shows centered greeting; once user sends a message, switches to conversation mode
- Keep framer-motion for transitions
- All glassmorphic effects replaced with clean white surfaces + subtle warm shadows

