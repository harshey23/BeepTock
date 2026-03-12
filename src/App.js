import { useState, useEffect, useRef } from "react";





export default function App() {
  const [seconds, setSeconds] = useState(10);
  const [running, setRunning] = useState(false);
  const wakeLock = useRef(null);

  useEffect(() => {
    if (!running) return;

    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          beep(600); // long beep
          setRunning(false);
          return 0;
        }

        beep(100); // short beep
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [running]);

  async function enableWakeLock() {
  try {
    wakeLock = await navigator.wakeLock.request("screen");
  } catch (err) {
    console.log(err);
  }
}

  function beep(duration) {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    audioCtx.resume();

    const oscillator = audioCtx.createOscillator();
    oscillator.connect(audioCtx.destination);
    oscillator.start();

    setTimeout(() => oscillator.stop(), duration);
  }

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>{seconds}</h1>

      <input
        type="number"
        value={seconds}
        onChange={(e) => setSeconds(Number(e.target.value))}
      />

      <br /><br />

      <button
        onClick={() => {
          enableWakeLock();
          setRunning(true);
        }}
      >
        Start
      </button>

      <button onClick={() => setRunning(false)}>Stop</button>
    </div>
  );
}