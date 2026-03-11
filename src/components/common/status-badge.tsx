import Chip from "@mui/material/Chip";

type StatusVariant = "active" | "locked" | "inactive" | "pending" | "enrolled" | "available" | "warning";

const variantStyles: Record<StatusVariant, { bgcolor: string; color: string }> = {
  active: { bgcolor: "#ECFDF5", color: "#047857" },
  locked: { bgcolor: "#EFF6FF", color: "#1D4ED8" },
  inactive: { bgcolor: "#F1F5F9", color: "#475569" },
  pending: { bgcolor: "#FFFBEB", color: "#B45309" },
  enrolled: { bgcolor: "#ECFDF5", color: "#047857" },
  available: { bgcolor: "#EFF6FF", color: "#1D4ED8" },
  warning: { bgcolor: "#FFFBEB", color: "#B45309" },
};

interface StatusBadgeProps {
  status: string;
  variant?: StatusVariant;
}

export function StatusBadge({ status, variant = "active" }: StatusBadgeProps) {
  const styles = variantStyles[variant];
  return (
    <Chip
      label={status}
      size="small"
      sx={{
        bgcolor: styles.bgcolor,
        color: styles.color,
        fontWeight: 500,
        fontSize: "0.75rem",
        height: 24,
        borderRadius: "6px",
        "& .MuiChip-label": { px: 1.25 },
      }}
      data-testid={`badge-status-${status.toLowerCase().replace(/\s+/g, "-")}`}
    />
  );
}
