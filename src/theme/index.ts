import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2563EB",
      light: "#60A5FA",
      dark: "#1D4ED8",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#64748B",
      light: "#94A3B8",
      dark: "#475569",
      contrastText: "#FFFFFF",
    },
    error: {
      main: "#DC2626",
    },
    warning: {
      main: "#F59E0B",
    },
    success: {
      main: "#16A34A",
    },
    background: {
      default: "#F8FAFC",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#0F172A",
      secondary: "#64748B",
    },
    divider: "#E2E8F0",
  },
  typography: {
    fontFamily: "'Roboto', 'Inter', sans-serif",
    h1: { fontSize: "1.5rem", fontWeight: 600, color: "#0F172A" },
    h2: { fontSize: "1rem", fontWeight: 600, color: "#0F172A" },
    h3: { fontSize: "0.875rem", fontWeight: 600, color: "#0F172A" },
    body1: { fontSize: "0.875rem", color: "#0F172A" },
    body2: { fontSize: "0.75rem", color: "#64748B" },
    caption: {
      fontSize: "0.75rem",
      fontWeight: 500,
      textTransform: "uppercase" as const,
      letterSpacing: "0.05em",
      color: "#64748B",
    },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: [
    "none",
    "0 1px 3px 0 rgba(0,0,0,0.06), 0 1px 2px -1px rgba(0,0,0,0.06)",
    "0 1px 3px 0 rgba(0,0,0,0.06), 0 1px 2px -1px rgba(0,0,0,0.06)",
    "0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -2px rgba(0,0,0,0.05)",
    "0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -2px rgba(0,0,0,0.05)",
    "0 10px 15px -3px rgba(0,0,0,0.07), 0 4px 6px -4px rgba(0,0,0,0.05)",
    "0 10px 15px -3px rgba(0,0,0,0.07), 0 4px 6px -4px rgba(0,0,0,0.05)",
    "0 10px 15px -3px rgba(0,0,0,0.07), 0 4px 6px -4px rgba(0,0,0,0.05)",
    "0 20px 25px -5px rgba(0,0,0,0.08), 0 8px 10px -6px rgba(0,0,0,0.04)",
    "0 20px 25px -5px rgba(0,0,0,0.08), 0 8px 10px -6px rgba(0,0,0,0.04)",
    "0 20px 25px -5px rgba(0,0,0,0.08), 0 8px 10px -6px rgba(0,0,0,0.04)",
    "0 20px 25px -5px rgba(0,0,0,0.08), 0 8px 10px -6px rgba(0,0,0,0.04)",
    "0 25px 50px -12px rgba(0,0,0,0.15)",
    "0 25px 50px -12px rgba(0,0,0,0.15)",
    "0 25px 50px -12px rgba(0,0,0,0.15)",
    "0 25px 50px -12px rgba(0,0,0,0.15)",
    "0 25px 50px -12px rgba(0,0,0,0.15)",
    "0 25px 50px -12px rgba(0,0,0,0.15)",
    "0 25px 50px -12px rgba(0,0,0,0.15)",
    "0 25px 50px -12px rgba(0,0,0,0.15)",
    "0 25px 50px -12px rgba(0,0,0,0.15)",
    "0 25px 50px -12px rgba(0,0,0,0.15)",
    "0 25px 50px -12px rgba(0,0,0,0.15)",
    "0 25px 50px -12px rgba(0,0,0,0.15)",
    "0 25px 50px -12px rgba(0,0,0,0.15)",
  ],
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          border: "1px solid #E2E8F0",
          boxShadow: "0 1px 3px 0 rgba(0,0,0,0.06), 0 1px 2px -1px rgba(0,0,0,0.06)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none" as const,
          fontWeight: 500,
          borderRadius: 6,
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
          },
        },
        sizeSmall: {
          fontSize: "0.8125rem",
          padding: "4px 12px",
        },
      },
      defaultProps: {
        disableElevation: true,
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          borderRadius: 6,
        },
        sizeSmall: {
          height: 24,
          fontSize: "0.75rem",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontSize: "0.75rem",
          fontWeight: 600,
          textTransform: "uppercase" as const,
          letterSpacing: "0.05em",
          color: "#64748B",
          backgroundColor: "rgba(241,245,249,0.5)",
          borderBottom: "1px solid #E2E8F0",
        },
        body: {
          fontSize: "0.875rem",
          borderBottom: "1px solid #E2E8F0",
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: "rgba(241,245,249,0.5)",
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none" as const,
          fontWeight: 500,
          fontSize: "0.8125rem",
          minHeight: 36,
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          minHeight: 36,
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: "0.875rem",
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontSize: "0.75rem",
          borderRadius: 4,
        },
      },
    },
  },
});

export default theme;
