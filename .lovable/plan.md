

# Liquid Glass Redesign — FLock Chat

Transform the entire app into Apple's iOS 26 "liquid glass" aesthetic using CSS `backdrop-filter`, transparency, and frosted-glass surfaces. The `@callstack/liquid-glass` library is React Native only — we'll recreate the effect with pure CSS.

## Liquid Glass Design System

```text
┌─────────────────────────────────────────┐
│  LIQUID GLASS RECIPE                    │
│                                         │
│  background: rgba(255,255,255,0.45)     │
│  backdrop-filter: blur(40px) saturate(1.8)│
│  border: 1px solid rgba(255,255,255,0.5)│
│  box-shadow: inset highlight + outer    │
│  border-radius: generous (20-28px)      │
│                                         │
│  Background: gradient mesh or image     │
│  Text: dark with high contrast          │
└─────────────────────────────────────────┘
```

## Changes

### 1. `src/index.css` — Glass foundation + mesh gradient background
- Add a colorful gradient mesh background on `body` (soft blues, purples, pinks — like iOS 26 wallpaper)
- Define `.glass` utility class: `backdrop-filter: blur(40px) saturate(180%)`, semi-transparent white bg, inset highlight border
- Define `.glass-strong` (more opaque), `.glass-subtle` (more transparent) variants
- Update CSS variables: make `--background` transparent, `--card` translucent white

### 2. `src/pages/Index.tsx` — Full-bleed gradient background
- Set the root container to show the gradient wallpaper behind everything
- Remove solid `bg-background`, let glass panels float over the gradient

### 3. `src/components/chat/ConversationList.tsx` — Glass sidebar
- Apply glass effect to the sidebar panel (frosted translucent background)
- Nav items, starred projects, recents get subtle glass hover states
- "+" FAB button becomes a glass pill with primary tint
- Brand title gets a subtle text shadow for legibility

### 4. `src/components/chat/ChatView.tsx` — Glass header + content area
- Header bar becomes a glass strip with blur
- Model selector pill becomes a glass button
- Incognito toggle gets glass styling
- Empty state icon gets a glass container
- Chat scroll area remains transparent (messages float over wallpaper)

### 5. `src/components/chat/ChatBubble.tsx` — Glass chat bubbles
- User bubbles: tinted glass (primary color at ~30% opacity + blur)
- Assistant bubbles: white glass (rgba(255,255,255,0.5) + blur)
- Avatar indicator gets glass circle

### 6. `src/components/chat/ChatInput.tsx` — Glass input bar
- Input container becomes a frosted glass pill
- Toolbar buttons get glass hover states
- Attachment chips become glass pills

### 7. `src/components/chat/ModelSelectorDrawer.tsx` — Glass bottom sheet
- Drawer background becomes frosted glass (no solid white)
- Tab pills become glass buttons
- Model list items get glass hover/selected states
- Handle bar remains subtle

### 8. `src/components/chat/SettingsDrawer.tsx` — Glass settings sheet
- Same glass treatment as model drawer
- Toggle switch gets glass track
- Setting cards become glass containers

### 9. `src/components/chat/ActionsDrawer.tsx` — Glass actions sheet
- Same glass bottom sheet treatment
- Action rows get glass hover

### 10. `src/components/chat/TypingIndicator.tsx` — Glass indicator
- Dots container gets a subtle glass background

### 11. `src/pages/Profile.tsx` — Glass settings page
- Page background shows gradient
- All setting section cards become glass panels
- Email field becomes glass input
- Buttons get glass treatment

### 12. `src/pages/Subscription.tsx` — Glass subscription page
- Same gradient background
- Price card and feature list in glass containers
- Subscribe button becomes a glass-tinted primary button

### 13. `tailwind.config.ts` — Add glass utilities if needed

### 14. `mem://index.md` — Record liquid glass design system

## Technical Notes
- `backdrop-filter: blur()` works in all modern browsers
- Using `saturate(180%)` alongside blur gives the authentic Apple glass vibrancy
- Inset box-shadow with white creates the glass edge highlight
- The mesh gradient background is key — glass looks flat without a colorful backdrop
- All overlays switch from solid dim to a subtle blur overlay

