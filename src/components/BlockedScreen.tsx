import React from "react";

const BlockedScreen: React.FC<{ browser: string }> = ({ browser }) => {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "#111",
        color: "#fff",
        textAlign: "center",
        padding: 20,
      }}
    >
      <h1>Unsupported Browser</h1>

      <p>
        You are using <b>{browser}</b>.
      </p>

      <p>
        This assessment is restricted to <b>Google Chrome</b> for security
        reasons.
      </p>

      <ol style={{ textAlign: "left" }}>
        <li>Close this browser</li>
        <li>Open Google Chrome</li>
        <li>Revisit the assessment link</li>
      </ol>
    </div>
  );
};

export default BlockedScreen;
