import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { Visibility, VisibilityOff } from "@mui/icons-material";

interface InfoFieldProps {
  label: string;
  value: string | number | null | undefined;
  valueClassName?: string;
  masked?: boolean;
  onToggleMask?: () => void;
}

function getMaskedValue(value: string | number | null | undefined): string {
  if (value == null) return "\u2014";
  const str = String(value);
  if (str.length <= 4) return "\u2022".repeat(str.length);
  return "\u2022".repeat(str.length - 4) + str.slice(-4);
}

export function InfoField({ label, value, valueClassName, masked, onToggleMask }: InfoFieldProps) {
  const isMasked = masked !== undefined;
  const displayValue = isMasked && masked ? getMaskedValue(value) : (value ?? "\u2014");
  const useMonospace = isMasked && masked;
  const testIdBase = label.toLowerCase().replace(/\s+/g, "-");

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
      <Typography
        variant="caption"
        data-testid={`label-${testIdBase}`}
      >
        {label}
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
        <Typography
          variant="body1"
          sx={{
            fontFamily: (useMonospace || valueClassName?.includes("mono"))
              ? "'Roboto Mono', monospace"
              : undefined,
            fontWeight: valueClassName?.includes("medium") ? 500 : 400,
            color: "#999",
            letterSpacing: useMonospace ? "0.05em" : undefined,
          }}
          data-testid={`value-${testIdBase}`}
        >
          {displayValue}
        </Typography>
        {isMasked && onToggleMask && (
          <IconButton
            size="small"
            onClick={onToggleMask}
            data-testid={`toggle-mask-${testIdBase}`}
            aria-label={masked ? `Reveal ${label}` : `Hide ${label}`}
            sx={{ ml: 0.5, p: 0.5 }}
          >
            {masked ? (
              <Visibility sx={{ fontSize: 18, color: "#999" }} />
            ) : (
              <VisibilityOff sx={{ fontSize: 18, color: "#999" }} />
            )}
          </IconButton>
        )}
      </Box>
    </Box>
  );
}
