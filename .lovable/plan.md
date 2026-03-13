

# FLock Brand Theme + Chat Input Enhancements

## Changes

### 1. Color Theme → FLock Light Mode (`src/index.css`)
Replace current warm cream palette with FLock brand colors:
- Background: `#F2F2F0` / `#F8F8F8`
- Foreground/text: `#282828`
- Primary (accent): `#3773FF` (Brand Blue) — replaces terracotta
- Secondary surfaces: `#E0E4F0` borders, white cards
- Muted text: `#8A8A8A`

### 2. Chat Input — Add File/Image Upload Button (`src/components/chat/ChatInput.tsx`)
- Add a `+` (Plus) or paperclip button on the left side of the input
- On click, show a small popover/action sheet with two options: "Upload File" and "Upload Image"
- Each triggers a hidden `<input type="file">` with appropriate `accept` attributes
- Show attached file names as small dismissible chips above the input
- Placeholder changes to "Chat with Nodum..."

### 3. Model Selector → "Gemini 3 Pro" (`src/components/chat/ChatView.tsx`)
- Change the model label from "Nodum 4o" to "Gemini 3 Pro"

### 4. Update Memory (`mem://index.md`)
- Record FLock brand colors and design tokens

## Files Modified
1. `src/index.css` — FLock color variables
2. `src/components/chat/ChatInput.tsx` — add attachment button + popover + file chips
3. `src/components/chat/ChatView.tsx` — model label to "Gemini 3 Pro"
4. `src/components/chat/ConversationList.tsx` — primary color auto-updates via CSS vars
5. `mem://index.md` — updated design preferences

