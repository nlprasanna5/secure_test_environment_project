# 🔐 Secure Test Environment

A **Secure Test Environment** built with **React (Vite + TypeScript)** that enforces a locked-down, time-bound, and auditable assessment experience. This system is designed for high-stakes online tests where integrity, monitoring, and restriction enforcement are critical.

---

## 📌 Objective

Ensure candidates complete assessments in a **controlled and secure browser environment** by:

- Restricting unauthorized actions  
- Enforcing fullscreen mode  
- Preventing tab switching & copy misuse  
- Tracking violations  
- Auto-submitting on rule breaches or timer expiry  

---

## 🚀 Features

### 🔒 Browser Restrictions

- Disables right-click context menu  
- Blocks copy / cut / paste actions  
- Prevents text selection  
- Disables developer tools shortcuts  

---

### 🖥 Fullscreen Enforcement

- Forces fullscreen on assessment start  
- Detects exit from fullscreen  
- Logs violations  
- Can auto-submit after repeated exits  

---

### ⏱ Timer Enforcement

- Configurable assessment duration  
- Real-time countdown  
- Auto-submission on expiry  

---

### 🔁 Tab / Window Monitoring

- Detects tab switching  
- Detects window blur events  
- Tracks suspicious activity count  

---

### 📊 Violation Tracking

- Logs all violations  
- Supports configurable violation limits  
- Triggers auto-submission when threshold exceeds  

---

### 📝 Auto Submission

- On timer expiry  
- On violation limit breach  
- On manual submission  

---

## 🗄 Log Storage (LocalStorage)

All security events and violations are stored locally in the browser using **LocalStorage**.

### What Gets Stored

- Tab switch events  
- Fullscreen exit events  
- Copy / paste attempts  
- Right-click attempts  
- DevTools detection  
- Timer events  
- Submission logs  

### Storage Structure

Logs are stored as structured JSON objects for audit and export purposes.

Example:

```json
{
  "sessionId": "SESSION_12345",
  "events": [
    {
      "type": "TAB_SWITCH",
      "timestamp": "2026-02-12T10:15:30Z"
    },
    {
      "type": "COPY_ATTEMPT",
      "timestamp": "2026-02-12T10:18:11Z"
    }
  ]
}
```

### Benefits

- No backend required  
- Works in offline environments  
- Fast event logging  
- Easy export for review  

> Logs can later be exported or sent to a server using the `logExporter.ts` module.

---

## 🏗 Tech Stack

- **Frontend:** React + Vite + TypeScript  
- **Security Handling:** Custom Hooks & Event Listeners  
- **Logging Storage:** Browser LocalStorage  
- **Build Tool:** Vite  

---

## 📂 Project Structure

```bash
SECURE_TEST_ENVIRONEMENT_PROJECT/
│
├── node_modules/
├── public/
│
├── src/
│   ├── assets/
│   │
│   ├── components/
│   │   ├── BlockedScreen.tsx
│   │   └── SecureWrapper.tsx
│   │
│   ├── security/
│   │   ├── browserCheck.ts
│   │   ├── eventLogger.ts
│   │   ├── eventTypes.ts
│   │   ├── logBatcher.ts
│   │   ├── logExporter.ts
│   │   ├── sessionManager.ts
│   │   ├── useFullscreenEnforcement.ts
│   │   ├── useSecurityEvents.ts
│   │   └── useTimer.ts
│   │
│   ├── App.tsx
│   ├── App.css
│   ├── index.css
│   └── main.tsx
│
├── package.json
└── README.md
```

---

## 🧠 Architecture Overview

### Components

| Component | Responsibility |
|----------|----------------|
| `SecureWrapper` | Core enforcement wrapper handling all restrictions |
| `BlockedScreen` | Blocks UI when violations exceed limits |

---

### Security Modules

| File | Purpose |
|------|---------|
| `browserCheck.ts` | Ensures Chrome browser usage |
| `eventLogger.ts` | Logs violations & stores in LocalStorage |
| `eventTypes.ts` | Defines security event types |
| `logBatcher.ts` | Batches logs efficiently |
| `logExporter.ts` | Exports logs from LocalStorage |
| `sessionManager.ts` | Manages assessment session |
| `useFullscreenEnforcement.ts` | Handles fullscreen enforcement |
| `useSecurityEvents.ts` | Handles keyboard/mouse restrictions |
| `useTimer.ts` | Countdown & expiry handling |

---

## ⚙️ Installation & Setup

### 1️⃣ Create Project

```bash
npm create vite@latest secure-test-environment -- --template react-ts
cd secure-test-environment
npm install
```

---

### 2️⃣ Start Development Server

```bash
npm run dev
```

---

### 3️⃣ Build for Production

```bash
npm run build
```

---

## 🧩 Usage Example

```tsx
import SecureWrapper from "./components/SecureWrapper";

function App() {
  return (
    <SecureWrapper
      enableFullscreen={true}
      timerDurationMinutes={30}
      onTimerExpire={() => {
        console.log("Timer expired - auto-submitting");
      }}
      onSubmit={() => {
        console.log("Assessment submitted");
      }}
    >
      <h1>Secure Assessment Environment</h1>
    </SecureWrapper>
  );
}

export default App;
```

---

## 🚨 Security Events Handled

| Event | Action |
|------|--------|
| Right Click | Blocked |
| Copy / Paste | Blocked |
| Tab Switch | Logged (LocalStorage) |
| Fullscreen Exit | Warning / Violation |
| DevTools Open | Detected |
| Timer Expiry | Auto Submit |

---

## 🔧 Configuration Options

| Prop | Type | Description |
|------|------|-------------|
| `enableFullscreen` | boolean | Forces fullscreen mode |
| `timerDurationMinutes` | number | Assessment duration |
| `violationLimit` | number | Max allowed violations |
| `onTimerExpire` | function | Called when timer ends |
| `onSubmit` | function | Submission handler |

---

