

## Plan: TopBar guest cleanup, microphone fix, suggestion chips, "Powered by BrainBox" footer, and Profile page upgrades

### 1. TopBar — Guest mode: show "Create an Account" instead of "Sign In"
- When `!user`, replace the "Sign In" button with a "Create an Account" button that navigates to `/join`
- Remove any "Log In" references for guests; keep "Sign Out" only for authenticated users

### 2. Profile Page — Guest mode: show "Create an Account" instead of "Sign In"
- Replace the bottom "Sign In for Enhanced Mode" button with "Create an Account" navigating to `/join`
- Remove Notifications option
- Make "Edit Profile" functional: open an inline editable form (name, purpose) that calls `updateProfile` from `useAuth`
- Make "Preferences" navigate to `/settings` (already works) and add a description subtitle

### 3. Fix Microphone — Replace Web Speech API with MediaRecorder + backend transcription
The `SpeechRecognition` API fails in many browsers/environments ("service-not-allowed"). The fix:
- Use `navigator.mediaDevices.getUserMedia` + `MediaRecorder` to record audio
- Send the audio blob to a new Edge Function `supabase/functions/transcribe/index.ts` that calls the Lovable AI gateway (Gemini model) for speech-to-text
- Return transcript text and populate the input bar
- This approach works in all browsers that support `getUserMedia`

### 4. Question Suggestion Chips in ChatPage
- Add 4 suggestion buttons above the input area, visible only when `messages.length === 1` (just the welcome message)
- Use a rotating daily set based on `new Date().toDateString()` as a seed to pick from a pool of ~20 suggestions
- On click, call `sendMessage(suggestionText)` and hide the chips
- Examples: "What's trending in tech today?", "Help me write a professional email", "Explain quantum computing simply", "Give me 5 creative project ideas"

### 5. "Powered by BrainBox" persistent footer
- Add a small fixed-bottom text `Powered by BrainBox` on all main app pages (Home, Chat, History, Profile, Settings) — rendered in `Index.tsx` for routes that have TopBar/BottomNav
- Also show on WelcomePage (but not during the 4 onboarding steps)
- Styled as a subtle, centered text at the very bottom edge

### 6. Profile Page — Edit Profile functionality
- Clicking "Edit Profile" opens an inline editing state with input fields for Name and a Purpose selector
- On save, calls `updateProfile({ name, purpose })` and shows a success toast
- "Preferences" navigates to `/settings` (already implemented)

### Technical Details
- **New Edge Function**: `supabase/functions/transcribe/index.ts` — accepts audio blob, uses Lovable AI gateway for transcription
- **Files modified**: `TopBar.tsx`, `ProfilePage.tsx`, `ChatPage.tsx`, `Index.tsx`, `WelcomePage.tsx`
- **Files created**: `supabase/functions/transcribe/index.ts`

