"use client";

type CheckoutStep = "details" | "shipping" | "payment";

interface CheckoutStepsProps {
  /** Tahapan saat ini: details (form), shipping (implisit dalam form), payment (QRIS atau kartu) */
  currentStep: CheckoutStep;
  /** Tema yang sesuai dengan checkout */
  theme?: "light";
  /** Saat mengklik tahapan yang sudah selesai, memungkinkan untuk kembali ke tahapan tersebut */
  onStepClick?: (step: CheckoutStep) => void;
}

const STEPS: { id: CheckoutStep; label: string }[] = [
  { id: "details", label: "Rincian" },
  { id: "shipping", label: "Pengiriman" },
  { id: "payment", label: "Pembayaran" },
];

export default function CheckoutSteps({
  currentStep,
  theme = "light",
  onStepClick,
}: CheckoutStepsProps) {
  const currentIndex = Math.max(
    0,
    STEPS.findIndex((s) => s.id === currentStep),
  );
  const ink = theme === "light" ? "#1B2B22" : "#1B2B22";

  return (
    <nav
      aria-label="Progres checkout"
      className="flex items-center gap-0 mb-8"
    >
      {STEPS.map((step, index) => {
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;
        const isPending = index > currentIndex;
        const isClickable = isCompleted && onStepClick;

        return (
          <div key={step.id} className="flex flex-1 items-center min-w-0">
            {/* Lingkaran + Label */}
            <div
              className={`flex flex-col items-center flex-1 min-w-0 ${
                isClickable ? "cursor-pointer" : ""
              }`}
              onClick={isClickable ? () => onStepClick(step.id) : undefined}
              onKeyDown={
                isClickable
                  ? (e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onStepClick(step.id);
                      }
                    }
                  : undefined
              }
              role={isClickable ? "button" : undefined}
              tabIndex={isClickable ? 0 : undefined}
              aria-label={
                isClickable
                  ? `Kembali ke tahap ${step.label}`
                  : undefined
              }
            >
              <div
                className={`
                  flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-[10px] font-medium uppercase tracking-wider transition-colors
                  ${isCompleted ? "border-brand-green bg-brand-green text-white" : ""}
                  ${isCurrent ? "border-[#1B2B22] bg-[#1B2B22]/10 text-[#1B2B22]" : ""}
                  ${isPending ? "border-[#1B2B22]/25 bg-transparent text-[#1B2B22]/40" : ""}
                `}
                aria-current={isCurrent ? "step" : undefined}
              >
                {isCompleted ? (
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              <span
                className={`mt-2 text-[10px] uppercase tracking-[0.15em] truncate max-w-full ${
                  isCurrent ? "font-medium opacity-100" : "font-light opacity-70"
                }`}
                style={{ color: ink }}
              >
                {step.label}
              </span>
            </div>
            {/* Garis Penghubung */}
            {index < STEPS.length - 1 && (
              <div
                className={`h-px flex-1 min-w-[20px] max-w-[60px] mx-1 -mt-5 ${
                  isCompleted ? "bg-brand-green/50" : "bg-[#1B2B22]/15"
                }`}
                aria-hidden
              />
            )}
          </div>
        );
      })}
    </nav>
  );
}
