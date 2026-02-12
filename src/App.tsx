import SecureWrapper from "./components/SecureWrapper";

const questions = [
  {
    id: 1,
    question: "What is the capital of India?",
    type: "text",
    placeholder: "Your answer...",
  },
  {
    id: 2,
    question:
      "Explain the difference between var, let, and const in JavaScript.",
    type: "textarea",
    placeholder: "Write your explanation...",
  },
  {
    id: 3,
    question: "What is React and why is it used?",
    type: "textarea",
    placeholder: "Your answer...",
  },
  {
    id: 4,
    question: "Which hook is used for side effects in React?",
    type: "text",
    placeholder: "Your answer...",
  },
  {
    id: 5,
    question: "What is the time complexity of binary search?",
    type: "text",
    placeholder: "Your answer...",
  },
];

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
      {/* Page Background */}
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg,#eef2ff,#f8fafc)",
          padding: "30px 20px",
          fontFamily: "Inter, sans-serif",
        }}
      >
        {/* Container */}
        <div
          style={{
            maxWidth: 900,
            margin: "0 auto",
          }}
        >
          {/* Header Card */}
          <div
            style={{
              background: "#ffffff",
              padding: 25,
              borderRadius: 12,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              marginBottom: 25,
            }}
          >
            <h1 style={{ margin: 0, color: "#111827" }}>
              Secure Assessment Environment
            </h1>

            <p style={{ color: "#6b7280", marginTop: 8 }}>
              Please read the instructions carefully before starting the
              assessment.
            </p>

            {/* Features Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
                gap: 10,
                marginTop: 15,
                fontSize: 14,
                color: "#374151",
              }}
            >
              <div>✅ Chrome browser enforcement</div>
              <div>✅ Fullscreen mode required</div>
              <div>✅ 30-minute timer</div>
              <div>✅ Activity logging enabled</div>
              <div>✅ Tab / focus monitoring</div>
              <div>✅ Copy / paste detection</div>
              <div>✅ Shortcut blocking</div>
              <div>✅ DevTools detection</div>
            </div>
          </div>

          {/* Instructions */}
          <div
            style={{
              background: "#ffffff",
              padding: 25,
              borderRadius: 12,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              marginBottom: 25,
            }}
          >
            <h2 style={{ marginTop: 0 }}>Instructions</h2>

            <ol style={{ color: "#374151", lineHeight: 1.8 }}>
              <li>Ensure you are using Google Chrome browser</li>
              <li>Allow fullscreen access when prompted</li>
              <li>Complete all questions within the time limit</li>
              <li>Click submit once you finish</li>
            </ol>
          </div>

          {/* Questions Section */}
          <div>
            <h2 style={{ marginBottom: 10 }}>Assessment Questions</h2>

            {questions.map((q, index) => (
              <div
                key={q.id}
                style={{
                  background: "#ffffff",
                  padding: 20,
                  borderRadius: 12,
                  marginTop: 20,
                  boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                  border: "1px solid #f1f5f9",
                }}
              >
                <h3
                  style={{
                    marginBottom: 15,
                    color: "#111827",
                    fontWeight: 600,
                  }}
                >
                  Q{index + 1}. {q.question}
                </h3>

                {q.type === "textarea" ? (
                  <textarea
                    placeholder={q.placeholder}
                    style={{
                      width: "100%",
                      padding: 12,
                      fontSize: 15,
                      borderRadius: 8,
                      border: "1px solid #d1d5db",
                      minHeight: 120,
                      resize: "vertical",
                      outline: "none",
                    }}
                    onFocus={(e) =>
                      (e.target.style.border =
                        "1px solid #6366f1")
                    }
                    onBlur={(e) =>
                      (e.target.style.border =
                        "1px solid #d1d5db")
                    }
                  />
                ) : (
                  <input
                    type="text"
                    placeholder={q.placeholder}
                    style={{
                      width: "100%",
                      padding: 12,
                      fontSize: 15,
                      borderRadius: 8,
                      border: "1px solid #d1d5db",
                      outline: "none",
                    }}
                    onFocus={(e) =>
                      (e.target.style.border =
                        "1px solid #6366f1")
                    }
                    onBlur={(e) =>
                      (e.target.style.border =
                        "1px solid #d1d5db")
                    }
                  />
                )}
              </div>
            ))}
          </div>

          {/* Security Note */}
          <div
            style={{
              background: "#fff7ed",
              padding: 18,
              borderRadius: 10,
              marginTop: 30,
              border: "1px solid #fdba74",
              color: "#9a3412",
              fontSize: 14,
            }}
          >
            <strong>Security Notice:</strong> Your activities such as tab
            switching, copy/paste attempts, and focus changes are monitored and
            logged.
          </div>

          {/* Submit Button */}
          <div style={{ textAlign: "center", marginTop: 30 }}>
            <button
              style={{
                background: "#6366f1",
                color: "#fff",
                padding: "14px 40px",
                fontSize: 16,
                borderRadius: 10,
                border: "none",
                cursor: "pointer",
                fontWeight: 600,
                boxShadow: "0 4px 14px rgba(99,102,241,0.4)",
              }}
            >
              Submit Assessment
            </button>
          </div>
        </div>
      </div>
    </SecureWrapper>
  );
}

export default App;
