import { type ReactNode } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";

interface DetailSectionProps {
  title: string;
  icon?: ReactNode;
  editable?: boolean;
  loading?: boolean;
  children: ReactNode;
  onEdit?: () => void;
  onSave?: () => void;
  onCancel?: () => void;
  editing?: boolean;
  saveDisabled?: boolean;
  saving?: boolean;
  editDisabled?: boolean;
  defaultExpanded?: boolean;
}

export function DetailSection({
  title,
  icon,
  editable = false,
  loading = false,
  children,
  onEdit,
  onSave,
  onCancel,
  editing = false,
  saveDisabled = false,
  saving = false,
  editDisabled = false,
  defaultExpanded = false,
}: DetailSectionProps) {
  const sectionId = title.toLowerCase().replace(/\s+/g, "-");

  return (
    <Accordion
      defaultExpanded={defaultExpanded}
      expanded={editing ? true : undefined}
      disableGutters
      sx={{
        border: "1px solid",
        borderColor: editing ? "primary.main" : "divider",
        borderRadius: "8px !important",
        "&:before": { display: "none" },
        mb: 1.5,
        overflow: "hidden",
        transition: "border-color 0.2s",
      }}
      data-testid={`section-${sectionId}`}
    >
      <AccordionSummary
        expandIcon={!editing ? <ExpandMoreIcon data-testid={`button-expand-${sectionId}`} /> : undefined}
        sx={{
          px: 2.5,
          py: 0.5,
          bgcolor: editing ? "primary.main" : "action.hover",
          color: editing ? "primary.contrastText" : undefined,
          "& .MuiAccordionSummary-content": {
            alignItems: "center",
            gap: 1,
            my: 1,
          },
          cursor: editing ? "default !important" : undefined,
        }}
      >
        {icon && (
          <Box sx={{ display: "flex", color: editing ? "primary.contrastText" : "primary.main" }} data-testid={`icon-${sectionId}`}>
            {icon}
          </Box>
        )}
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 600, flexGrow: 1, color: editing ? "primary.contrastText" : undefined }}
          data-testid={`title-${sectionId}`}
        >
          {title}
          {editing && (
            <Typography component="span" variant="caption" sx={{ ml: 1, opacity: 0.85 }}>
              (Editing)
            </Typography>
          )}
        </Typography>
        {editable && !editing && (
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.();
            }}
            disabled={editDisabled}
            data-testid={`button-edit-${sectionId}`}
            sx={{ ml: 1, opacity: editDisabled ? 0.4 : 1 }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        )}
        {editing && (
          <Stack direction="row" spacing={1} onClick={(e) => e.stopPropagation()}>
            <Button
              variant="contained"
              size="small"
              startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
              onClick={onSave}
              disabled={saveDisabled || saving}
              data-testid={`button-save-${sectionId}`}
              sx={{
                bgcolor: "background.paper",
                color: "primary.main",
                "&:hover": { bgcolor: "grey.100" },
              }}
            >
              {saving ? "Saving..." : "Save"}
            </Button>
            <Button
              variant="outlined"
              size="small"
              startIcon={<CancelIcon />}
              onClick={onCancel}
              disabled={saving}
              data-testid={`button-cancel-${sectionId}`}
              sx={{
                borderColor: "primary.contrastText",
                color: "primary.contrastText",
                "&:hover": { borderColor: "primary.contrastText", bgcolor: "rgba(255,255,255,0.1)" },
              }}
            >
              Cancel
            </Button>
          </Stack>
        )}
      </AccordionSummary>
      <AccordionDetails sx={{ px: 2.5, py: 2 }}>
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              py: 4,
            }}
            data-testid={`loading-${sectionId}`}
          >
            <CircularProgress size={28} />
          </Box>
        ) : (
          children
        )}
      </AccordionDetails>
    </Accordion>
  );
}
