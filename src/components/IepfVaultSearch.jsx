import { useState } from "react";
import { Landmark, Loader2, Search, X } from "lucide-react";

// PAN format: 5 uppercase letters + 4 digits + 1 uppercase letter
const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

/**
 * Formats a rupee amount with the INR symbol and Indian number grouping.
 * e.g. 45000 -> "45,000"
 */
function formatRupees(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * IepfVaultSearch -- lets investors look up unclaimed dividends held by IEPF.
 * Calls GET /api/v1/iepf/search?pan_number=<PAN> on the FastAPI backend.
 *
 * Mock: entering "ABCDE1234F" returns the Rs.45,000 Reliance Industries record.
 */
export default function IepfVaultSearch() {
  const [pan, setPan] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const panIsValid = PAN_REGEX.test(pan.trim().toUpperCase());

  const handleSearch = async (e) => {
    e.preventDefault();
    const normalised = pan.trim().toUpperCase();

    if (!PAN_REGEX.test(normalised)) {
      setError("Please enter a valid 10-character PAN (e.g. ABCDE1234F).");
      return;
    }

    setError("");
    setResult(null);
    setLoading(true);

    try {
      const url = new URL("http://localhost:8000/api/v1/iepf/search");
      url.searchParams.set("pan_number", normalised);

      const response = await fetch(url.toString());

      if (!response.ok) {
        throw new Error(
          `Server returned ${response.status}. Make sure the FastAPI backend is running on port 8000.`
        );
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to reach the IEPF API. Confirm FastAPI is running at localhost:8000."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setPan("");
    setResult(null);
    setError("");
  };

  return (
    <div
      id="iepf"
      className="scroll-mt-28"
      aria-labelledby="iepf-heading"
    >
      <div className="mb-6">
          <p className="text-xs uppercase tracking-widest text-[#FF9933] mb-2 flex items-center gap-1.5">
            <Landmark className="h-3.5 w-3.5" aria-hidden="true" />
            IEPF Unclaimed Dividends
          </p>
          <h2 id="iepf-heading" className="text-2xl font-semibold">
            Search for unclaimed dividends
          </h2>
          <p className="mt-2 text-sm text-gray-400 leading-relaxed">
            Enter your PAN to check whether any of your dividends or shares have
            been transferred to the Investor Education and Protection Fund (IEPF).
          </p>
        </div>

        <form onSubmit={handleSearch} noValidate>
          <label
            htmlFor="pan-input"
            className="block text-xs uppercase tracking-widest text-gray-400 mb-2"
          >
            PAN Number
          </label>
          <div className="flex gap-3">
            <input
              id="pan-input"
              type="text"
              value={pan}
              onChange={(e) => {
                setPan(e.target.value.toUpperCase());
                setError("");
                setResult(null);
              }}
              placeholder="e.g. ABCDE1234F"
              maxLength={10}
              autoComplete="off"
              spellCheck={false}
              aria-describedby={error ? "pan-error" : undefined}
              aria-invalid={!!error}
              className={`flex-1 bg-[#0A1128] border rounded-2xl px-4 py-2.5 text-white text-sm tracking-wider placeholder:text-gray-500 focus:outline-none transition-colors ${
                error
                  ? "border-red-500 focus:border-red-400"
                  : "border-white/20 focus:border-[#FF9933]"
              }`}
            />
            <button
              type="submit"
              disabled={loading || !pan.trim()}
              aria-busy={loading}
              className="inline-flex items-center gap-2 rounded-full bg-[#FF9933] px-5 py-2.5 text-sm font-semibold text-[#0A1128] disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 transition shrink-0"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              {loading ? "Searching..." : "Search"}
            </button>
          </div>

          {pan.length > 0 && !panIsValid && !error && (
            <p className="mt-1.5 text-xs text-gray-500" aria-live="polite">
              Format: 5 letters + 4 digits + 1 letter (all uppercase)
            </p>
          )}

          {error && (
            <p
              id="pan-error"
              role="alert"
              className="mt-2 text-sm text-red-400"
            >
              {error}
            </p>
          )}
        </form>

        {result && (
          <div
            className="mt-6"
            role="region"
            aria-label="Search result"
            aria-live="polite"
          >
            {result.status === "found" ? (
              <div className="rounded-2xl border border-[#FF9933]/30 bg-[#FF9933]/5 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-[#FF9933] mb-1">
                      Unclaimed Dividend Found
                    </p>
                    <p className="text-2xl font-bold text-white">
                      {formatRupees(result.amount)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleReset}
                    aria-label="Clear result and search again"
                    className="rounded-full p-1.5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                    <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">
                      Company
                    </p>
                    <p className="text-sm font-semibold text-white">
                      {result.company}
                    </p>
                  </div>
                  <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                    <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">
                      Folio No.
                    </p>
                    <p className="text-sm font-semibold text-white font-mono">
                      {result.folio}
                    </p>
                  </div>
                </div>

                <p className="mt-4 text-xs text-gray-400 leading-relaxed">
                  File an IEPF-5 claim form at{" "}
                  <a
                    href="https://www.iepf.gov.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#FF9933] hover:underline"
                  >
                    iepf.gov.in
                  </a>{" "}
                  and keep your share certificate, Aadhaar, and cancelled cheque
                  ready.
                </p>
              </div>
            ) : (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center">
                <p className="text-gray-300 font-medium">No unclaimed dividends found</p>
                <p className="mt-1 text-sm text-gray-400">
                  {result.message ?? "No dividends or shares transferred to IEPF were found for this PAN."}
                </p>
                <button
                  type="button"
                  onClick={handleReset}
                  className="mt-4 rounded-full border border-white/15 px-5 py-2 text-xs text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                >
                  Search another PAN
                </button>
              </div>
            )}
          </div>
        )}
    </div>
  );
}
