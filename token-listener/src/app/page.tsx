"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// ── Types ──────────────────────────────────────────────────────────────────
type LogType = "match" | "alert" | "number" | "nearby" | "";

interface LogEntry {
  id: number;
  time: string;
  msg: string;
  type: LogType;
}

interface ApproachData {
  current: string;
  away: number;
  target: string;
}

// ── Letter / number word mappings ──────────────────────────────────────────
const LETTER_MAP: Record<string, string> = {
  alpha: "A", bravo: "B", charlie: "C", delta: "D", echo: "E", foxtrot: "F",
  golf: "G", hotel: "H", india: "I", juliet: "J", kilo: "K", lima: "L",
  mike: "M", november: "N", oscar: "O", papa: "P", quebec: "Q", romeo: "R",
  sierra: "S", tango: "T", uniform: "U", victor: "V", whiskey: "W",
  "x-ray": "X", xray: "X", yankee: "Y", zulu: "Z",
  ay: "A", a: "A", bee: "B", b: "B", see: "C", sea: "C", c: "C",
  dee: "D", d: "D", ee: "E", e: "E", eff: "F", f: "F",
  gee: "G", g: "G", aitch: "H", h: "H", eye: "I", i: "I",
  jay: "J", j: "J", kay: "K", k: "K", el: "L", l: "L",
  em: "M", m: "M", en: "N", n: "N", oh: "O", o: "O",
  pee: "P", p: "P", queue: "Q", q: "Q", are: "R", r: "R",
  ess: "S", s: "S", tee: "T", t: "T", you: "U", u: "U",
  vee: "V", v: "V", "double-u": "W", w: "W", ex: "X", x: "X",
  why: "Y", y: "Y", zee: "Z", zed: "Z", z: "Z",
};

const WORD_TO_NUM: Record<string, string> = {
  zero: "0", oh: "0", one: "1", two: "2", too: "2", to: "2",
  three: "3", four: "4", for: "4", five: "5", six: "6",
  seven: "7", eight: "8", nine: "9",
};

// ── Pure helpers ───────────────────────────────────────────────────────────
function getTimestamp(): string {
  return new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

function normalizeToToken(text: string): string {
  const lower = text.toLowerCase().trim();
  const parts = lower.split(/[\s,.\-]+/);
  let token = "";

  for (const part of parts) {
    if (!part) continue;
    if (/^[a-z0-9]+$/.test(part) && part.length > 1) {
      for (const ch of part) {
        if (/[a-z]/.test(ch)) token += ch.toUpperCase();
        else if (/[0-9]/.test(ch)) token += ch;
      }
      continue;
    }
    if (LETTER_MAP[part]) { token += LETTER_MAP[part]; continue; }
    if (WORD_TO_NUM[part] !== undefined) { token += WORD_TO_NUM[part]; continue; }
    if (/^[a-z]$/.test(part)) { token += part.toUpperCase(); continue; }
    if (/^\d+$/.test(part)) { token += part; continue; }
  }

  return token;
}

function extractTokenCandidates(text: string): string[] {
  const lower = text.toLowerCase();
  const candidates: string[] = [];

  const contextPatterns = [
    /(?:token|number|no\.?|serving|called|announcing)\s+([a-z0-9\s]{2,12})/gi,
  ];
  for (const pat of contextPatterns) {
    let m: RegExpExecArray | null;
    pat.lastIndex = 0;
    while ((m = pat.exec(lower)) !== null) {
      const normalized = normalizeToToken(m[1]);
      if (normalized.length >= 2 && normalized.length <= 6) candidates.push(normalized);
    }
  }

  const directPattern = /\b([A-Za-z]{1,2}\d{2,3})\b/g;
  let dm: RegExpExecArray | null;
  while ((dm = directPattern.exec(text)) !== null) {
    const tok = dm[1].toUpperCase();
    if (!candidates.includes(tok)) candidates.push(tok);
  }

  const fullPatterns = [/(?:token|number|serving)\s+(.+)/gi];
  for (const pat of fullPatterns) {
    let m: RegExpExecArray | null;
    pat.lastIndex = 0;
    while ((m = pat.exec(lower)) !== null) {
      const normalized = normalizeToToken(m[1]);
      if (normalized.length >= 2 && normalized.length <= 6 && !candidates.includes(normalized)) {
        candidates.push(normalized);
      }
    }
  }

  return candidates;
}

function splitToken(token: string): { prefix: string; num: number } | null {
  const match = token.match(/^([A-Z]*)(\d+)$/);
  if (!match) return null;
  return { prefix: match[1], num: parseInt(match[2], 10) };
}

function tokenDistance(candidate: string, target: string): number | null {
  const c = splitToken(candidate);
  const t = splitToken(target);
  if (!c || !t || c.prefix !== t.prefix) return null;
  return t.num - c.num;
}

type AudioCtxWindow = Window & { webkitAudioContext?: typeof AudioContext };

function playApproachSound() {
  try {
    const Ctx = window.AudioContext ?? (window as AudioCtxWindow).webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const beep = (freq: number, start: number, dur: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      osc.type = "sine";
      gain.gain.setValueAtTime(0.2, ctx.currentTime + start);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur);
      osc.start(ctx.currentTime + start);
      osc.stop(ctx.currentTime + start + dur);
    };
    beep(660, 0, 0.15);
    beep(880, 0.2, 0.15);
  } catch { /* audio unavailable */ }
}

function playAlertSound() {
  try {
    const Ctx = window.AudioContext ?? (window as AudioCtxWindow).webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const beep = (freq: number, start: number, dur: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      osc.type = "sine";
      gain.gain.setValueAtTime(0.3, ctx.currentTime + start);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur);
      osc.start(ctx.currentTime + start);
      osc.stop(ctx.currentTime + start + dur);
    };
    beep(880, 0, 0.2);
    beep(1100, 0.25, 0.2);
    beep(880, 0.5, 0.2);
    beep(1100, 0.75, 0.2);
    beep(1320, 1.0, 0.4);
  } catch { /* audio unavailable */ }
}

// ── Component ──────────────────────────────────────────────────────────────
export default function TokenListenerPage() {
  const [targetToken, setTargetToken] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [logIdCounter, setLogIdCounter] = useState(0);
  const [threshold, setThreshold] = useState(5);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [twilioEnabled, setTwilioEnabled] = useState(false);
  const [twilioSid, setTwilioSid] = useState("");
  const [twilioAuth, setTwilioAuth] = useState("");
  const [twilioFrom, setTwilioFrom] = useState("");
  const [matchOverlay, setMatchOverlay] = useState<string | null>(null);
  const [approachOverlay, setApproachOverlay] = useState<ApproachData | null>(null);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const isListeningRef = useRef(false);
  const approachAlertedRef = useRef<Set<string>>(new Set());
  const thresholdRef = useRef(threshold);
  const targetTokenRef = useRef(targetToken);

  useEffect(() => { thresholdRef.current = threshold; }, [threshold]);
  useEffect(() => { targetTokenRef.current = targetToken; }, [targetToken]);

  useEffect(() => {
    const SR =
      window.SpeechRecognition ??
      (window as Window & { webkitSpeechRecognition?: typeof SpeechRecognition })
        .webkitSpeechRecognition;
    if (!SR) setIsSupported(false);
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  const addLog = useCallback((msg: string, type: LogType = "") => {
    setLogIdCounter((prev) => {
      const id = prev + 1;
      setLogs((entries) => {
        const entry: LogEntry = { id, time: getTimestamp(), msg, type };
        return [entry, ...entries].slice(0, 50);
      });
      return id;
    });
  }, []);

  const sendSMS = useCallback(
    async (token: string) => {
      if (!twilioEnabled) return;
      if (!twilioSid || !twilioAuth || !twilioFrom || !phoneNumber) {
        addLog("SMS skipped — missing Twilio credentials or phone number", "alert");
        return;
      }
      try {
        const body = new URLSearchParams({
          To: phoneNumber,
          From: twilioFrom,
          Body: `🎯 TOKEN ALERT: Now serving token ${token}. Your number has been called!`,
        });
        const resp = await fetch(
          `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`,
          {
            method: "POST",
            headers: {
              Authorization: "Basic " + btoa(`${twilioSid}:${twilioAuth}`),
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body,
          }
        );
        if (resp.ok) {
          addLog(`SMS sent to ${phoneNumber}`, "match");
        } else {
          const err = (await resp.json()) as { message?: string };
          addLog(`SMS failed: ${err.message ?? resp.status}`, "alert");
        }
      } catch (e) {
        addLog(`SMS error: ${(e as Error).message}`, "alert");
      }
    },
    [twilioEnabled, twilioSid, twilioAuth, twilioFrom, phoneNumber, addLog]
  );

  const triggerMatch = useCallback(
    (token: string) => {
      setMatchOverlay(token);
      playAlertSound();
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("🎯 Your Token Is Up!", {
          body: `Now serving token ${token}`,
          requireInteraction: true,
        });
      }
      if (navigator.vibrate) navigator.vibrate([300, 100, 300, 100, 500]);
      sendSMS(token);
      addLog(`TOKEN ${token} MATCHED — Your number is being served!`, "match");
    },
    [sendSMS, addLog]
  );

  const triggerApproach = useCallback(
    (candidate: string, target: string, distance: number) => {
      setApproachOverlay({ current: candidate, away: distance, target });
      playApproachSound();
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("⏳ Almost Your Turn!", {
          body: `Now serving ${candidate} — ${distance} away from your token ${target}`,
        });
      }
      if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
      addLog(
        `⏳ Token ${candidate} announced — <strong>${distance} away</strong> from ${target}`,
        "nearby"
      );
    },
    [addLog]
  );

  const processResult = useCallback(
    (text: string) => {
      const target = targetTokenRef.current;
      const thresh = thresholdRef.current;
      const candidates = extractTokenCandidates(text);

      for (const candidate of candidates) {
        if (candidate === target) {
          triggerMatch(candidate);
        } else {
          const dist = tokenDistance(candidate, target);
          if (dist !== null && dist > 0 && dist <= thresh && !approachAlertedRef.current.has(candidate)) {
            approachAlertedRef.current.add(candidate);
            triggerApproach(candidate, target, dist);
          } else {
            const distInfo =
              dist !== null
                ? ` (${dist > 0 ? `${dist} away` : dist === 0 ? "MATCH" : "past yours"})`
                : "";
            addLog(`Heard token: <strong>${candidate}</strong>${distInfo}`, "number");
          }
        }
      }
    },
    [triggerMatch, triggerApproach, addLog]
  );

  const startListening = useCallback(() => {
    const target = targetToken.trim().toUpperCase();
    if (!target || target.length < 2) {
      addLog("Please enter your token (e.g. A123, BC45)", "alert");
      return;
    }

    const SR =
      window.SpeechRecognition ??
      (window as Window & { webkitSpeechRecognition?: typeof SpeechRecognition })
        .webkitSpeechRecognition;
    if (!SR) return;

    const recognition = new SR();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognition.maxAlternatives = 3;
    approachAlertedRef.current.clear();

    recognition.onstart = () => {
      isListeningRef.current = true;
      setIsListening(true);
      addLog(`Listening for token <strong>${target}</strong>…`);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interimText = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const text = result[0].transcript;
        if (result.isFinal) {
          setTranscript(text);
          setInterimTranscript("");
          processResult(text);
          for (let alt = 1; alt < result.length; alt++) {
            const altCandidates = extractTokenCandidates(result[alt].transcript);
            for (const c of altCandidates) {
              if (c === targetTokenRef.current) triggerMatch(c);
            }
          }
        } else {
          interimText += text;
        }
      }
      if (interimText) setInterimTranscript(interimText);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error === "no-speech") return;
      const fatalErrors = ["not-allowed", "service-not-allowed"];
      if (fatalErrors.includes(event.error)) {
        isListeningRef.current = false;
        setIsListening(false);
        addLog(
          "Microphone access denied or speech service unavailable. Please allow microphone access in your browser and try again.",
          "alert"
        );
      } else {
        addLog(`Recognition error: ${event.error}`, "alert");
      }
    };

    recognition.onend = () => {
      if (isListeningRef.current) {
        try { recognition.start(); } catch {
          setTimeout(() => { if (isListeningRef.current) recognition.start(); }, 500);
        }
      }
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch (e) {
      addLog(`Failed to start: ${(e as Error).message}`, "alert");
    }
  }, [targetToken, addLog, processResult, triggerMatch]);

  const stopListening = useCallback(() => {
    isListeningRef.current = false;
    setIsListening(false);
    if (recognitionRef.current) {
      recognitionRef.current.abort();
      recognitionRef.current = null;
    }
    setInterimTranscript("");
    addLog("Stopped listening.");
  }, [addLog]);

  const toggleListening = useCallback(() => {
    if (isListening) stopListening();
    else startListening();
  }, [isListening, startListening, stopListening]);

  useEffect(() => {
    return () => { if (recognitionRef.current) recognitionRef.current.abort(); };
  }, []);

  // Build highlighted transcript HTML
  // Content is sourced from the browser's SpeechRecognition API, not external input.
  // We escape HTML entities before injecting regex-generated span tags.
  function buildTranscriptHTML(text: string): string {
    const safe = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    return safe
      .replace(/\b([A-Za-z]{1,2}\d{2,3})\b/g, '<span class="heard-number">$1</span>')
      .replace(/\b(\d+)\b/g, '<span class="heard-number">$1</span>');
  }

  const displayTranscript = interimTranscript || transcript;

  return (
    <>
      <div className="app">
        {/* Header */}
        <div className="header">
          <h1>Token Listener</h1>
          <p>
            Listens for &ldquo;now serving token number…&rdquo; announcements
            <br />
            and alerts you when your number is called.
          </p>
        </div>

        {/* Token input */}
        <div className="token-display">
          <div className="label">Your Token Number</div>
          <input
            type="text"
            className="token-number-input"
            placeholder="A001"
            maxLength={4}
            value={targetToken}
            onChange={(e) =>
              setTargetToken(
                e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 4)
              )
            }
          />
          <div className="token-underline" />
          <div className="token-hint">
            Enter your 4-character alphanumeric token (e.g. A123, BC45)
          </div>
        </div>

        {/* Unsupported browser notice */}
        {!isSupported && (
          <div className="unsupported">
            <h3>Browser Not Supported</h3>
            <p>
              The Web Speech Recognition API is required. Please use{" "}
              <strong>Google Chrome</strong> or <strong>Microsoft Edge</strong> on
              desktop or Android.
            </p>
          </div>
        )}

        {/* Status card */}
        <div className={`status-card${isListening ? " listening" : ""}`}>
          <div className="status-row">
            <div className="status-indicator">
              <div className={`pulse-dot${isListening ? " active" : ""}`} />
              <span className={`status-text${isListening ? " active" : ""}`}>
                {isListening ? "Listening" : "Idle"}
              </span>
            </div>
            <button
              className={`listen-btn${isListening ? " active" : ""}`}
              onClick={toggleListening}
              disabled={!isSupported}
            >
              {isListening ? "Stop" : "Start"}
            </button>
          </div>

          <div className="transcript-area">
            {displayTranscript ? (
              <>
                {/* Speech recognition output is HTML-escaped before span injection */}
                {/* biome-ignore lint/security/noDangerouslySetInnerHtml: content escaped + from SpeechRecognition API */}
                <span
                  dangerouslySetInnerHTML={{ __html: buildTranscriptHTML(displayTranscript) }}
                />
                {interimTranscript && <span style={{ opacity: 0.3 }}> …</span>}
              </>
            ) : (
              <span className="placeholder">Live transcript will appear here…</span>
            )}
          </div>
        </div>

        {/* Notification settings */}
        <div className="settings-card">
          <h3>Notification Settings</h3>

          <div className="input-group">
            <label>Heads-up threshold (numbers away)</label>
            <input
              type="number"
              value={threshold}
              min={1}
              max={50}
              style={{ width: 80 }}
              onChange={(e) => setThreshold(Math.max(1, parseInt(e.target.value) || 1))}
            />
            <div style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 4 }}>
              Alert when the announced number is within this many of yours
            </div>
          </div>

          <div className="input-group">
            <label>Phone number to notify</label>
            <input
              type="tel"
              placeholder="+1 234 567 8900"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>

          <div className="toggle-row">
            <span className="toggle-label">SMS via Twilio</span>
            <button
              className={`toggle-switch${twilioEnabled ? " on" : ""}`}
              onClick={() => setTwilioEnabled((v) => !v)}
            />
          </div>

          {twilioEnabled && (
            <div className="twilio-fields visible">
              <div className="input-group">
                <label>Twilio Account SID</label>
                <input
                  type="text"
                  placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  value={twilioSid}
                  onChange={(e) => setTwilioSid(e.target.value)}
                />
              </div>
              <div className="input-group">
                <label>Twilio Auth Token</label>
                <input
                  type="password"
                  placeholder="Your auth token"
                  value={twilioAuth}
                  onChange={(e) => setTwilioAuth(e.target.value)}
                />
              </div>
              <div className="input-group">
                <label>Twilio Phone Number (From)</label>
                <input
                  type="tel"
                  placeholder="+1 234 567 8900"
                  value={twilioFrom}
                  onChange={(e) => setTwilioFrom(e.target.value)}
                />
              </div>
              <div className="info-text">
                Your Twilio credentials stay in your browser and are never sent
                anywhere except to Twilio&rsquo;s API to send the SMS. You can get
                a free trial account at <strong>twilio.com</strong>.
              </div>
            </div>
          )}

          {!twilioEnabled && (
            <div className="info-text">
              Without Twilio, you&rsquo;ll get a browser notification + audio alert
              when your number is called. Enable Twilio above to also receive an SMS.
            </div>
          )}
        </div>

        {/* Event log */}
        <div className="log-card">
          <div className="log-header">
            <h3>Event Log</h3>
            <button className="clear-log-btn" onClick={() => setLogs([])}>
              Clear
            </button>
          </div>
          <div className="log-entries">
            {logs.length === 0 ? (
              <div className="log-empty">No events yet</div>
            ) : (
              logs.map((entry) => (
                <div key={entry.id} className={`log-entry${entry.type ? ` ${entry.type}` : ""}`}>
                  <span className="time">{entry.time}</span>
                  {/* Log messages contain pre-built HTML with safe alphanumeric tokens only */}
                  {/* biome-ignore lint/security/noDangerouslySetInnerHtml: msg is internally generated with safe HTML */}
                  <span className="msg" dangerouslySetInnerHTML={{ __html: entry.msg }} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Match overlay */}
      {matchOverlay && (
        <div className="match-overlay visible">
          <div className="match-content">
            <div className="match-icon">🎯</div>
            <div className="match-title">Your Number Is Up!</div>
            <div className="match-number">{matchOverlay}</div>
            <div className="match-sub">Now serving your token number</div>
            <button className="dismiss-btn" onClick={() => setMatchOverlay(null)}>
              Got It
            </button>
          </div>
        </div>
      )}

      {/* Approach overlay */}
      {approachOverlay && (
        <div className="match-overlay visible">
          <div className="match-content">
            <div className="match-icon">⏳</div>
            <div className="match-title" style={{ color: "var(--warn)" }}>
              Getting Close!
            </div>
            <div className="match-number" style={{ fontSize: 48, color: "var(--warn)" }}>
              {approachOverlay.current}
            </div>
            <div className="match-sub">
              {approachOverlay.away} number{approachOverlay.away !== 1 ? "s" : ""} away from
              your token <strong>{approachOverlay.target}</strong>
            </div>
            <button
              className="dismiss-btn"
              style={{ borderColor: "var(--warn)", background: "var(--warn)" }}
              onClick={() => setApproachOverlay(null)}
            >
              Got It
            </button>
          </div>
        </div>
      )}

      <style>{`
        .app {
          position: relative; z-index: 1;
          max-width: 520px; margin: 0 auto;
          padding: 24px 20px 40px;
          min-height: 100vh; display: flex; flex-direction: column;
        }
        .header { text-align: center; padding: 32px 0 8px; }
        .header h1 {
          font-family: var(--mono); font-size: 13px; font-weight: 700;
          letter-spacing: 4px; text-transform: uppercase; color: var(--accent); margin-bottom: 6px;
        }
        .header p { font-size: 13px; color: var(--text-dim); line-height: 1.5; }
        .token-display { margin: 32px 0; text-align: center; position: relative; }
        .token-display .label {
          font-family: var(--mono); font-size: 10px; letter-spacing: 3px;
          text-transform: uppercase; color: var(--text-dim); margin-bottom: 12px;
        }
        .token-number-input {
          font-family: var(--mono); font-size: 56px; font-weight: 700;
          color: var(--text); background: transparent; border: none;
          text-align: center; width: 100%; outline: none;
          letter-spacing: 6px; caret-color: var(--accent); text-transform: uppercase;
          -moz-appearance: textfield;
        }
        .token-number-input::-webkit-outer-spin-button,
        .token-number-input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        .token-number-input::placeholder { color: var(--border); }
        .token-underline {
          width: 160px; height: 3px;
          background: linear-gradient(90deg, transparent, var(--accent), transparent);
          margin: 0 auto; border-radius: 2px; opacity: 0.5;
        }
        .token-hint { margin-top: 10px; font-size: 12px; color: var(--text-dim); }
        .status-card {
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 16px; padding: 24px; margin-bottom: 20px;
          position: relative; overflow: hidden;
        }
        .status-card::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, var(--accent), transparent);
          opacity: 0; transition: opacity 0.3s;
        }
        .status-card.listening::before { opacity: 1; }
        .status-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
        .status-indicator { display: flex; align-items: center; gap: 10px; }
        .pulse-dot {
          width: 10px; height: 10px; border-radius: 50%;
          background: var(--text-dim); position: relative; transition: background 0.3s;
        }
        .pulse-dot.active { background: var(--accent); box-shadow: 0 0 12px var(--accent); }
        .pulse-dot.active::after {
          content: ''; position: absolute; inset: -4px; border-radius: 50%;
          border: 2px solid var(--accent); animation: pulse-ring 1.5s ease-out infinite;
        }
        .status-text {
          font-family: var(--mono); font-size: 12px; letter-spacing: 1px;
          text-transform: uppercase; color: var(--text-dim); transition: color 0.3s;
        }
        .status-text.active { color: var(--accent); }
        .listen-btn {
          font-family: var(--mono); font-size: 12px; font-weight: 700;
          letter-spacing: 2px; text-transform: uppercase;
          padding: 10px 24px; border-radius: 8px;
          border: 1px solid var(--accent); background: transparent;
          color: var(--accent); cursor: pointer; transition: all 0.2s;
        }
        .listen-btn:hover { background: var(--accent-glow); }
        .listen-btn.active { background: var(--accent); color: var(--bg); }
        .listen-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .transcript-area {
          background: var(--surface-2); border-radius: 10px; padding: 14px 16px;
          min-height: 48px; max-height: 100px; overflow-y: auto;
          font-size: 13px; color: var(--text-dim); line-height: 1.6;
        }
        .transcript-area .placeholder { font-style: italic; opacity: 0.5; }
        .heard-number { color: var(--warn); font-weight: 600; font-family: var(--mono); }
        .settings-card {
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 16px; padding: 24px; margin-bottom: 20px;
        }
        .settings-card h3 {
          font-family: var(--mono); font-size: 10px; letter-spacing: 3px;
          text-transform: uppercase; color: var(--text-dim); margin-bottom: 16px;
        }
        .input-group { margin-bottom: 14px; }
        .input-group:last-child { margin-bottom: 0; }
        .input-group label { display: block; font-size: 12px; color: var(--text-dim); margin-bottom: 6px; font-weight: 500; }
        .input-group input, .input-group select {
          width: 100%; font-family: var(--sans); font-size: 14px;
          padding: 10px 14px; border-radius: 8px; border: 1px solid var(--border);
          background: var(--surface-2); color: var(--text); outline: none; transition: border-color 0.2s;
        }
        .input-group input:focus, .input-group select:focus { border-color: var(--accent); }
        .input-group input::placeholder { color: #3a3a50; }
        .toggle-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
        .toggle-label { font-size: 13px; font-weight: 500; color: var(--text); }
        .toggle-switch {
          width: 42px; height: 24px; background: var(--border);
          border-radius: 12px; position: relative; cursor: pointer;
          transition: background 0.2s; border: none; outline: none;
        }
        .toggle-switch.on { background: var(--accent-dim); }
        .toggle-switch::after {
          content: ''; position: absolute; top: 3px; left: 3px;
          width: 18px; height: 18px; border-radius: 50%;
          background: var(--text); transition: transform 0.2s;
        }
        .toggle-switch.on::after { transform: translateX(18px); }
        .twilio-fields { display: none; }
        .twilio-fields.visible { display: block; }
        .info-text {
          font-size: 11px; color: var(--text-dim); line-height: 1.5;
          margin-top: 8px; padding: 8px 10px;
          background: var(--surface-2); border-radius: 6px;
        }
        .log-card {
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 16px; padding: 24px; flex: 1;
          display: flex; flex-direction: column; min-height: 0;
        }
        .log-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
        .log-header h3 {
          font-family: var(--mono); font-size: 10px; letter-spacing: 3px;
          text-transform: uppercase; color: var(--text-dim); margin-bottom: 0;
        }
        .log-entries { flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 6px; }
        .log-entry {
          display: flex; align-items: flex-start; gap: 10px; font-size: 12px;
          padding: 8px 10px; border-radius: 6px; background: var(--surface-2);
          animation: log-in 0.3s ease-out;
        }
        .log-entry .time { font-family: var(--mono); color: var(--text-dim); white-space: nowrap; font-size: 11px; padding-top: 1px; }
        .log-entry .msg { color: var(--text); line-height: 1.4; }
        .log-entry.match .msg { color: var(--accent); font-weight: 600; }
        .log-entry.alert .msg { color: var(--danger); font-weight: 600; }
        .log-entry.number .msg { color: var(--warn); }
        .log-entry.nearby .msg { color: var(--warn); font-weight: 600; }
        .log-empty { font-size: 12px; color: var(--text-dim); opacity: 0.5; font-style: italic; padding: 12px 0; text-align: center; }
        .clear-log-btn {
          font-family: var(--mono); font-size: 10px; letter-spacing: 1px;
          text-transform: uppercase; padding: 4px 10px; border-radius: 4px;
          border: 1px solid var(--border); background: transparent;
          color: var(--text-dim); cursor: pointer; transition: all 0.2s;
        }
        .clear-log-btn:hover { border-color: var(--text-dim); color: var(--text); }
        .match-overlay {
          display: none; position: fixed; inset: 0; z-index: 100;
          background: rgba(0,0,0,0.85); align-items: center;
          justify-content: center; flex-direction: column; animation: overlay-in 0.3s ease;
        }
        .match-overlay.visible { display: flex; }
        .match-content { text-align: center; animation: match-pop 0.5s cubic-bezier(0.34,1.56,0.64,1); }
        .match-icon { font-size: 64px; margin-bottom: 16px; }
        .match-title {
          font-family: var(--mono); font-size: 14px; letter-spacing: 4px;
          text-transform: uppercase; color: var(--accent); margin-bottom: 8px;
        }
        .match-number {
          font-family: var(--mono); font-size: 80px; font-weight: 700;
          color: var(--text); text-shadow: 0 0 40px var(--accent-glow); margin-bottom: 24px;
        }
        .match-sub { font-size: 14px; color: var(--text-dim); margin-bottom: 32px; }
        .dismiss-btn {
          font-family: var(--mono); font-size: 11px; letter-spacing: 2px;
          text-transform: uppercase; padding: 12px 32px; border-radius: 8px;
          border: 1px solid var(--accent); background: var(--accent);
          color: var(--bg); cursor: pointer; font-weight: 700;
        }
        .unsupported {
          background: var(--danger-glow); border: 1px solid var(--danger);
          border-radius: 12px; padding: 20px; margin: 32px 0; text-align: center;
        }
        .unsupported h3 { color: var(--danger); font-size: 14px; margin-bottom: 8px; }
        .unsupported p { font-size: 13px; color: var(--text-dim); line-height: 1.5; }
        @media (max-width: 480px) {
          .token-number-input { font-size: 42px; }
          .match-number { font-size: 56px; }
        }
      `}</style>
    </>
  );
}
