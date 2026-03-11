import { useState, useEffect, useCallback, useRef } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import StopIcon from "@mui/icons-material/Stop";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import CloseIcon from "@mui/icons-material/Close";

export interface TourStep {
  targetSelector: string;
  title: string;
  description: string;
  placement?: "top" | "bottom" | "left" | "right";
}

interface InteractiveTourProps {
  steps: TourStep[];
  isActive: boolean;
  onEnd: () => void;
}

export function InteractiveTour({ steps, isActive, onEnd }: InteractiveTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const onEndRef = useRef(onEnd);
  onEndRef.current = onEnd;

  const updateTargetRect = useCallback(() => {
    if (!isActive || !steps[currentStep]) return;
    const el = document.querySelector(steps[currentStep].targetSelector);
    if (el) {
      setTargetRect(el.getBoundingClientRect());
    } else {
      setTargetRect(null);
    }
  }, [isActive, currentStep, steps]);

  useEffect(() => {
    if (!isActive) {
      setTargetRect(null);
      return;
    }
    setCurrentStep(0);
    setIsPaused(true);
  }, [isActive]);

  useEffect(() => {
    if (!isActive) return;
    const rafId = requestAnimationFrame(() => updateTargetRect());
    const handleScroll = () => updateTargetRect();
    const handleResize = () => updateTargetRect();
    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("resize", handleResize);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", handleResize);
    };
  }, [isActive, updateTargetRect]);

  useEffect(() => {
    if (!isActive || isPaused) return;
    const autoTimer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= steps.length - 1) {
          setTimeout(() => onEndRef.current(), 0);
          return prev;
        }
        return prev + 1;
      });
    }, 5000);
    return () => clearInterval(autoTimer);
  }, [isActive, isPaused, steps.length]);

  useEffect(() => {
    if (!isActive) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onEndRef.current();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isActive]);

  if (!isActive || !targetRect || !steps[currentStep]) return null;

  const step = steps[currentStep];
  const padding = 8;
  const highlightTop = targetRect.top - padding;
  const highlightLeft = targetRect.left - padding;
  const highlightWidth = targetRect.width + padding * 2;
  const highlightHeight = targetRect.height + padding * 2;

  const placement = step.placement || "bottom";
  let tooltipStyle: Record<string, unknown> = {};
  if (placement === "bottom") {
    tooltipStyle = { top: highlightTop + highlightHeight + 12, left: highlightLeft };
  } else if (placement === "top") {
    tooltipStyle = { bottom: window.innerHeight - highlightTop + 12, left: highlightLeft };
  } else if (placement === "right") {
    tooltipStyle = { top: highlightTop, left: highlightLeft + highlightWidth + 12 };
  } else {
    tooltipStyle = { top: highlightTop, right: window.innerWidth - highlightLeft + 12 };
  }

  return (
    <Box
      sx={{ position: "fixed", inset: 0, zIndex: 9999, pointerEvents: "none" }}
      data-testid="tour-overlay"
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.45)",
          maskImage: `
            linear-gradient(#000 0 0),
            linear-gradient(#000 0 0)
          `,
          maskComposite: "exclude",
          WebkitMaskComposite: "xor",
          maskPosition: `0 0, ${highlightLeft}px ${highlightTop}px`,
          maskSize: `100% 100%, ${highlightWidth}px ${highlightHeight}px`,
          maskRepeat: "no-repeat",
        }}
      />

      <Box
        sx={{
          position: "absolute",
          top: highlightTop,
          left: highlightLeft,
          width: highlightWidth,
          height: highlightHeight,
          borderRadius: "8px",
          border: "2px solid #2563EB",
          boxShadow: "0 0 0 0 rgba(37,99,235,0.4)",
          animation: "tour-ripple 1.5s ease-in-out infinite",
          "@keyframes tour-ripple": {
            "0%": { boxShadow: "0 0 0 0 rgba(37,99,235,0.4)" },
            "70%": { boxShadow: "0 0 0 12px rgba(37,99,235,0)" },
            "100%": { boxShadow: "0 0 0 0 rgba(37,99,235,0)" },
          },
        }}
        data-testid="tour-highlight"
      />

      <Box
        sx={{
          position: "absolute",
          ...tooltipStyle,
          maxWidth: 340,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: "0 20px 25px -5px rgba(0,0,0,0.15), 0 8px 10px -6px rgba(0,0,0,0.1)",
          border: "1px solid",
          borderColor: "divider",
          pointerEvents: "auto",
          overflow: "hidden",
        }}
        data-testid="tour-tooltip"
      >
        <Box sx={{ bgcolor: "#2563EB", px: 2, py: 1, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Typography sx={{ color: "#fff", fontSize: "0.8125rem", fontWeight: 600 }} data-testid="text-tour-step-indicator">
            Step {currentStep + 1} of {steps.length}
          </Typography>
          <IconButton size="small" onClick={onEnd} sx={{ color: "#fff", p: 0.25 }} aria-label="Close tour" data-testid="button-tour-close">
            <CloseIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>

        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography sx={{ fontSize: "0.9375rem", fontWeight: 600, color: "text.primary", mb: 0.5 }} data-testid="text-tour-step-title">
            {step.title}
          </Typography>
          <Typography sx={{ fontSize: "0.8125rem", color: "text.secondary", lineHeight: 1.5 }} data-testid="text-tour-step-description">
            {step.description}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5, px: 2, pb: 1.5 }}>
          <IconButton
            size="small"
            disabled={currentStep === 0}
            onClick={() => setCurrentStep((p) => Math.max(0, p - 1))}
            sx={{ bgcolor: "action.hover", "&:hover": { bgcolor: "action.selected" } }}
            aria-label="Previous step"
            data-testid="button-tour-previous"
          >
            <SkipPreviousIcon sx={{ fontSize: 20 }} />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => setIsPaused(!isPaused)}
            sx={{ bgcolor: "action.hover", "&:hover": { bgcolor: "action.selected" } }}
            aria-label={isPaused ? "Play auto-advance" : "Pause auto-advance"}
            data-testid="button-tour-play-pause"
          >
            {isPaused ? <PlayArrowIcon sx={{ fontSize: 20 }} /> : <StopIcon sx={{ fontSize: 20 }} />}
          </IconButton>
          <IconButton
            size="small"
            disabled={currentStep >= steps.length - 1}
            onClick={() => setCurrentStep((p) => Math.min(steps.length - 1, p + 1))}
            sx={{ bgcolor: "action.hover", "&:hover": { bgcolor: "action.selected" } }}
            aria-label="Next step"
            data-testid="button-tour-next"
          >
            <SkipNextIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}
