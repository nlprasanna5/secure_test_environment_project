# 🔐 Secure Test Environment

A **Secure Test Environment** built with React (Vite + TypeScript) that enforces a locked‑down, time‑bound, and auditable assessment experience. This system is designed for high‑stakes online tests where integrity, monitoring, and restriction enforcement are critical.

---

## 📌 Objective

Ensure candidates complete assessments in a **controlled and secure browser environment** by:

* Restricting unauthorized actions
* Enforcing fullscreen mode
* Preventing tab switching & copy misuse
* Tracking violations
* Auto‑submitting on rule breaches or timer expiry

---

## 🚀 Features

### 🔒 Browser Restrictions

* Disables right‑click context menu
* Blocks copy / cut / paste actions
* Prevents text selection
* Disables developer tools shortcuts

### 🖥 Fullscreen Enforcement

* Forces fullscreen on assessment start
* Detects exit from fullscreen
* Logs violations
* Can auto‑submit after repeated exits

### ⏱ Timer Enforcement

* Configurable assessment duration
* Real‑time countdown
* Auto‑submission on expiry

### 🔁 Tab / Window Monitoring

* Detects tab switching
* Detects window blur events
* Tracks suspicious activity count

### 📊 Violation Tracking

* Logs all violations
* Supports configurable violation limits
* Triggers auto‑submission when threshold exceeds

### 📝 Auto Submission

* On timer expiry
* On violation limit breach
* On manual submission

---

## 🏗 Tech Stack

* **Frontend:** React + Vite + TypeScript
* **State Management:** React Hooks / Redux (optional)
* **Styling:** CSS / Tailwind / Custom Styles
* **Build Tool:** Vite

---

## 📂 Project Structure

```bash
secure-test-environment/
│
├── src/
│   ├── components/
│   │   ├── SecureWrapper.tsx
│   │   ├── Timer.tsx
│   │   ├── ViolationLogger.tsx
│   │   └── FullscreenHandler.tsx
│   │
│   ├── hooks/
│   │   ├── useFullscreen.ts
│   │   ├── useTimer.ts
│   │   └── useViolationTracker.ts
│   │
│   ├── utils/
│   │   └── securityHandlers.ts
│   │
│   ├── App.tsx
│   └── main.tsx
│
├── public/
├── package.json
└── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Create Project (Vite + React + TS)

```bash
npm create vite@latest secure-test-environment -- --template react-ts
cd secure-test-environment
npm install
```

### 2️⃣ Start Development Server

```bash
npm run dev
```

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
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <h1>Secure Assessment Environment</h1>
      </div>
    </SecureWrapper>
  );
}

export default App;
```

---

## 🚨 Security Events Handled

| Event           | Action              |
| --------------- | ------------------- |
| Right Click     | Blocked             |
| Copy / Paste    | Blocked             |
| Tab Switch      | Logged              |
| Fullscreen Exit | Warning / Violation |
| DevTools Open   | Block Attempt       |
| Timer Expiry    | Auto Submit         |

---

## 🔧 Configuration Options

| Prop                 | Type     | Description            |
| -------------------- | -------- | ---------------------- |
| enableFullscreen     | boolean  | Forces fullscreen mode |
| timerDurationMinutes | number   | Assessment duration    |
| violationLimit       | number   | Max allowed violations |
| onTimerExpire        | function | Called on timer end    |
| onSubmit             | function | Submission handler     |

---


