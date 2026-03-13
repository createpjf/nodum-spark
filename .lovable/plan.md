

# Changes

## 1. Right-top button → Incognito/Privacy mode toggle (`ChatView.tsx`)
- Replace the avatar circle with an incognito toggle button (X icon when incognito is on, ghost/eye-off icon otherwise)
- When incognito mode is active, show a subtle label under the model name: "Incognito chat"
- Add a centered notice in the empty state when incognito: ghost icon + "Incognito chats can't access memory. They aren't saved to history, added to memory, or used to train models."

## 2. Redesign Settings/Profile page → Claude-style Settings (`Profile.tsx`)
Restructure to match the uploaded screenshot layout:
- Header: X (close) button left, "Settings" title center, info icon right
- Email displayed in a rounded input-like field
- **Section 1**: Profile, Billing (shows "Max plan" or "Free"), Usage — each row with icon, label, chevron
- **Section 2**: Capabilities
- **Section 3**: Appearance (with "System" selector), Speech language (shows "EN"), Notifications, Privacy
- **Section 4**: Haptic feedback (toggle switch)
- Separator then Log out at the bottom
- Remove: Connectors, Shared links, Permissions (per user request)

## Files Modified
1. `src/components/chat/ChatView.tsx` — incognito mode state + header button + empty state notice
2. `src/pages/Profile.tsx` — full redesign to Claude-style Settings page

