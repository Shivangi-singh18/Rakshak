import { useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  CircleCheck as CheckCircle2,
  FileWarning,
  Landmark,
  Loader2,
  Mic,
  UserX,
} from "lucide-react";

const CATEGORIES = [
  {
    id: "Broker Unauthorized Trade",
    label: "Broker Unauthorized Trade",
    hint: "Trades placed without your consent",
    Icon: AlertTriangle,
  },
  {
    id: "Missing Nominee",
    label: "Missing Nominee",
    hint: "Folio or demat account has no nominee",
    Icon: UserX,
  },
  {
    id: "IEPF Unclaimed Funds",
    label: "IEPF Unclaimed Funds",
    hint: "Dividends or shares transferred to IEPF",
    Icon: Landmark,
  },
  {
    id: "Fake Advisory Scam",
    label: "Fake Advisory Scam",
    hint: "Unregistered tips, WhatsApp, or guaranteed returns",
    Icon: FileWarning,
  },
];

const STEP_LABELS = ["Issue", "Details", "Review"];

function getSpeechRecognition() {
  if (typeof window === "undefined") return null;
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

export default function GrievanceWizard() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    category: "",
    raw_story: "",
  });
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [error, setError] = useState("");
  const [petition, setPetition] = useState(null);
  const recognitionRef = useRef(null);

  const progressIndex = Math.min(step, 3) - 1;

  const resetClaim = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setStep(1);
    setFormData({ category: "", raw_story: "" });
    setLoading(false);
    setListening(false);
    setError("");
    setPetition(null);
  };

  const startVoiceCapture = () => {
    const SpeechRecognition = getSpeechRecognition();
    if (!SpeechRecognition) {
      setError("Voice input is not supported in this browser. Please type your story.");
      return;
    }

    setError("");

    if (listening && recognitionRef.current) {
      recognitionRef.current.stop();
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "hi-IN";
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.maxAlternatives = 1;
    recognitionRef.current = recognition;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => {
      setListening(false);
      recognitionRef.current = null;
    };
    recognition.onerror = () => {
      setListening(false);
      setError("Could not capture audio. Check microphone permission and try again.");
    };
    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = 0; i < event.results.length; i += 1) {
        transcript += event.results[i][0].transcript;
      }
      const cleaned = transcript.trim();
      if (!cleaned) return;
      setFormData((prev) => ({
        ...prev,
        raw_story: prev.raw_story
          ? `${prev.raw_story.trim()} ${cleaned}`
          : cleaned,
      }));
    };

    recognition.start();
  };

  const generatePetition = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("http://localhost:8000/api/v1/triage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      let payload = null;
      const contentType = response.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        payload = await response.json();
      } else {
        const text = await response.text();
        payload = text ? { petition: text } : null;
      }

      if (!response.ok) {
        throw new Error(
          payload?.detail ||
            payload?.message ||
            `Triage failed (${response.status}). Start the FastAPI server on port 8000.`
        );
      }

      setPetition(payload);
      setStep(4);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to reach the triage API. Confirm FastAPI is running at localhost:8000."
      );
    } finally {
      setLoading(false);
    }
  };

  const petitionBody =
    petition?.petition ||
    petition?.scores_petition ||
    petition?.draft ||
    petition?.message ||
    null;

  return (
    <div id="triage" className="scroll-mt-28">
      <div>
        <div className="mb-8">
          <p className="text-xs uppercase tracking-widest text-[#FF9933] mb-2">
            SCORES petition wizard
          </p>
          <div className="flex items-center justify-between gap-2 text-sm text-gray-400">
            {STEP_LABELS.map((label, index) => (
              <div key={label} className="flex items-center gap-2 flex-1">
                <span
                  className={
                    index <= progressIndex ? "text-white font-medium" : "text-gray-500"
                  }
                >
                  {label}
                </span>
                {index < STEP_LABELS.length - 1 && (
                  <span className="text-gray-600">-&gt;</span>
                )}
              </div>
            ))}
          </div>
          <p className="mt-2 text-sm text-gray-400">
            Step {Math.min(step, 3)} of 3: {STEP_LABELS[progressIndex]}
          </p>
        </div>

        {step === 1 && (
          <div>
            <h2 className="text-2xl font-semibold mb-6">What do you need help with?</h2>
            <div className="grid gap-3">
              {CATEGORIES.map(({ id, label, hint, Icon }) => {
                const selected = formData.category === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, category: id }))
                    }
                    className={`w-full text-left rounded-2xl border p-4 transition-colors ${
                      selected
                        ? "border-[#FF9933] bg-[#FF9933]/10"
                        : "border-white/10 bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Icon className="h-5 w-5 mt-0.5 text-[#FF9933]" aria-hidden="true" />
                      <div>
                        <p className="font-medium text-white">{label}</p>
                        <p className="text-sm text-gray-400 mt-1">{hint}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="mt-8 flex justify-end">
              <button
                type="button"
                disabled={!formData.category}
                onClick={() => setStep(2)}
                className="rounded-full bg-[#FF9933] px-6 py-2.5 text-sm font-semibold text-[#0A1128] disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 transition"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-2xl font-semibold mb-2">Explain what happened</h2>
            <p className="text-sm text-gray-400 mb-4">
              Type in English or Hindi, or tap the mic for voice-first capture over
              2G/3G.
            </p>
            <div className="relative">
              <textarea
                value={formData.raw_story}
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    raw_story: event.target.value,
                  }))
                }
                rows={8}
                placeholder="Share dates, broker name, PAN/demat if you have them, and what you want SEBI to do..."
                className="bg-[#0A1128] border border-white/20 p-4 w-full rounded-2xl text-white placeholder:text-gray-500 focus:outline-none focus:border-[#FF9933] pr-14"
              />
              <button
                type="button"
                onClick={startVoiceCapture}
                className={`absolute top-4 right-4 rounded-full p-2 border transition ${
                  listening
                    ? "bg-[#FF9933]/20 border-[#FF9933] text-[#FF9933]"
                    : "bg-white/10 border-white/10 text-white hover:bg-white/20"
                }`}
                aria-label={listening ? "Stop voice input" : "Start voice input"}
              >
                <Mic className="h-4 w-4" />
              </button>
            </div>
            {listening && (
              <p className="mt-2 text-xs text-[#FF9933]">Listening in Hindi (hi-IN)…</p>
            )}
            <div className="mt-8 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
              <button
                type="button"
                disabled={!formData.raw_story.trim()}
                onClick={() => setStep(3)}
                className="rounded-full bg-[#FF9933] px-6 py-2.5 text-sm font-semibold text-[#0A1128] disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110"
              >
                Review Petition
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-2xl font-semibold mb-6">Review your complaint</h2>
            <div className="space-y-4">
              <div className="rounded-2xl border border-white/10 bg-[#0A1128] p-4">
                <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">
                  Category
                </p>
                <p className="text-white font-medium">{formData.category}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-[#0A1128] p-4">
                <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">
                  What happened
                </p>
                <p className="text-gray-200 whitespace-pre-wrap leading-relaxed">
                  {formData.raw_story}
                </p>
              </div>
            </div>
            {error && (
              <p className="mt-4 text-sm text-red-400" role="alert">
                {error}
              </p>
            )}
            <div className="mt-8 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  setError("");
                  setStep(2);
                }}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={generatePetition}
                className="inline-flex items-center gap-2 rounded-full bg-[#138808] px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-60 hover:brightness-110"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Generate Legal SCORES Petition
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="text-center py-6">
            <CheckCircle2 className="mx-auto h-16 w-16 text-[#138808]" aria-hidden="true" />
            <h2 className="mt-6 text-3xl font-bold">Petition Generated!</h2>
            <p className="mt-3 text-gray-400">
              Your grievance has been triaged for SEBI SCORES. File it on the
              SCORES portal and keep your acknowledgement number safe.
            </p>
            {petitionBody && (
              <div className="mt-6 text-left rounded-2xl border border-white/10 bg-[#0A1128] p-4 max-h-64 overflow-y-auto">
                <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">
                  Draft petition
                </p>
                <p className="text-sm text-gray-200 whitespace-pre-wrap">
                  {typeof petitionBody === "string"
                    ? petitionBody
                    : JSON.stringify(petitionBody, null, 2)}
                </p>
              </div>
            )}
            {petition && !petitionBody && (
              <div className="mt-6 text-left rounded-2xl border border-white/10 bg-[#0A1128] p-4 max-h-64 overflow-y-auto">
                <pre className="text-xs text-gray-300 whitespace-pre-wrap">
                  {JSON.stringify(petition, null, 2)}
                </pre>
              </div>
            )}
            <button
              type="button"
              onClick={resetClaim}
              className="mt-8 rounded-full bg-[#FF9933] px-6 py-2.5 text-sm font-semibold text-[#0A1128] hover:brightness-110"
            >
              Start New Claim
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
