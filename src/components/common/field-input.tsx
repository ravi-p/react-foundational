import { useState, useCallback } from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import FormHelperText from "@mui/material/FormHelperText";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import Checkbox from "@mui/material/Checkbox";
import Box from "@mui/material/Box";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";

type DataType = "text" | "numeric" | "date" | "currency" | "toggleYN" | "multiCheckbox";

interface FieldInputProps {
  label: string;
  value: string;
  dataType: DataType;
  maxLength?: number;
  error?: boolean;
  helperText?: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  options?: { label: string; value: string }[];
  readOnly?: boolean;
}

function validateText(value: string, maxLength?: number): { valid: boolean; message: string } {
  if (!value.trim()) return { valid: false, message: "Field is required" };
  if (maxLength && value.length > maxLength) return { valid: false, message: `Maximum ${maxLength} characters` };
  return { valid: true, message: "" };
}

function validateNumeric(value: string): { valid: boolean; message: string } {
  if (!value.trim()) return { valid: false, message: "Field is required" };
  if (!/^\d+$/.test(value)) return { valid: false, message: "Digits only" };
  return { valid: true, message: "" };
}

function validateDate(value: string): { valid: boolean; message: string } {
  if (!value.trim()) return { valid: false, message: "Field is required" };
  if (!/^\d{4}$/.test(value)) return { valid: false, message: "Must be 4 digits (MMDD)" };
  const month = parseInt(value.substring(0, 2), 10);
  const day = parseInt(value.substring(2, 4), 10);
  if (month < 1 || month > 12) return { valid: false, message: "Invalid month (01-12)" };
  if (day < 1 || day > 31) return { valid: false, message: "Invalid day (01-31)" };
  return { valid: true, message: "" };
}

function validateCurrency(value: string): { valid: boolean; message: string } {
  if (!value.trim()) return { valid: false, message: "Field is required" };
  if (!/^\d+(\.\d{0,2})?$/.test(value)) return { valid: false, message: "Invalid currency format" };
  return { valid: true, message: "" };
}

function formatCurrency(value: string): string {
  const num = parseFloat(value);
  if (isNaN(num)) return value;
  return num.toFixed(2);
}

function ValidationIndicator({ valid }: { valid: boolean | null }) {
  if (valid === null) return null;
  return valid ? (
    <CheckCircleOutlineIcon sx={{ color: "success.main", fontSize: 20 }} data-testid="icon-valid" />
  ) : (
    <CancelOutlinedIcon sx={{ color: "error.main", fontSize: 20 }} data-testid="icon-invalid" />
  );
}

function TextInput({ label, value, maxLength, error, helperText, onChange, onBlur, readOnly }: Omit<FieldInputProps, "dataType" | "options">) {
  const [touched, setTouched] = useState(false);
  const [validation, setValidation] = useState<{ valid: boolean; message: string } | null>(null);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (maxLength && val.length > maxLength) return;
    onChange(val);
  }, [onChange, maxLength]);

  const handleBlur = useCallback(() => {
    const trimmed = value.trim();
    if (trimmed !== value) onChange(trimmed);
    const result = validateText(trimmed, maxLength);
    setValidation(result);
    setTouched(true);
    onBlur?.();
  }, [value, maxLength, onChange, onBlur]);

  const showError = error || (touched && validation && !validation.valid);
  const displayHelper = helperText || (touched && validation && !validation.valid ? validation.message : "");

  return (
    <TextField
      label={label}
      value={value}
      onChange={handleChange}
      onBlur={handleBlur}
      error={!!showError}
      helperText={displayHelper}
      size="small"
      fullWidth
      disabled={readOnly}
      slotProps={{
        input: {
          endAdornment: touched ? (
            <InputAdornment position="end">
              <ValidationIndicator valid={validation?.valid ?? null} />
            </InputAdornment>
          ) : undefined,
        },
        htmlInput: {
          maxLength: maxLength,
          "data-testid": `input-${label.toLowerCase().replace(/\s+/g, "-")}`,
        },
      }}
      data-testid={`field-${label.toLowerCase().replace(/\s+/g, "-")}`}
    />
  );
}

function NumericInput({ label, value, maxLength, error, helperText, onChange, onBlur, readOnly }: Omit<FieldInputProps, "dataType" | "options">) {
  const [touched, setTouched] = useState(false);
  const [validation, setValidation] = useState<{ valid: boolean; message: string } | null>(null);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^\d]/g, "");
    if (maxLength && val.length > maxLength) return;
    onChange(val);
  }, [onChange, maxLength]);

  const handleBlur = useCallback(() => {
    const result = validateNumeric(value);
    setValidation(result);
    setTouched(true);
    onBlur?.();
  }, [value, onBlur]);

  const showError = error || (touched && validation && !validation.valid);
  const displayHelper = helperText || (touched && validation && !validation.valid ? validation.message : "");

  return (
    <TextField
      label={label}
      value={value}
      onChange={handleChange}
      onBlur={handleBlur}
      error={!!showError}
      helperText={displayHelper}
      size="small"
      fullWidth
      disabled={readOnly}
      slotProps={{
        input: {
          endAdornment: touched ? (
            <InputAdornment position="end">
              <ValidationIndicator valid={validation?.valid ?? null} />
            </InputAdornment>
          ) : undefined,
        },
        htmlInput: {
          inputMode: "numeric",
          maxLength: maxLength,
          "data-testid": `input-${label.toLowerCase().replace(/\s+/g, "-")}`,
        },
      }}
      data-testid={`field-${label.toLowerCase().replace(/\s+/g, "-")}`}
    />
  );
}

function DateInput({ label, value, error, helperText, onChange, onBlur, readOnly }: Omit<FieldInputProps, "dataType" | "options" | "maxLength">) {
  const [touched, setTouched] = useState(false);
  const [validation, setValidation] = useState<{ valid: boolean; message: string } | null>(null);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^\d]/g, "");
    if (val.length > 4) return;
    onChange(val);
  }, [onChange]);

  const handleBlur = useCallback(() => {
    const result = validateDate(value);
    setValidation(result);
    setTouched(true);
    onBlur?.();
  }, [value, onBlur]);

  const showError = error || (touched && validation && !validation.valid);
  const displayHelper = helperText || (touched && validation && !validation.valid ? validation.message : "MMDD format");

  return (
    <TextField
      label={label}
      value={value}
      onChange={handleChange}
      onBlur={handleBlur}
      error={!!showError}
      helperText={displayHelper}
      placeholder="MMDD"
      size="small"
      fullWidth
      disabled={readOnly}
      slotProps={{
        input: {
          endAdornment: touched ? (
            <InputAdornment position="end">
              <ValidationIndicator valid={validation?.valid ?? null} />
            </InputAdornment>
          ) : undefined,
        },
        htmlInput: {
          inputMode: "numeric",
          maxLength: 4,
          "data-testid": `input-${label.toLowerCase().replace(/\s+/g, "-")}`,
        },
      }}
      data-testid={`field-${label.toLowerCase().replace(/\s+/g, "-")}`}
    />
  );
}

function CurrencyInput({ label, value, error, helperText, onChange, onBlur, readOnly }: Omit<FieldInputProps, "dataType" | "options" | "maxLength">) {
  const [touched, setTouched] = useState(false);
  const [validation, setValidation] = useState<{ valid: boolean; message: string } | null>(null);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^\d.]/g, "");
    const parts = val.split(".");
    if (parts.length > 2) return;
    if (parts[1] && parts[1].length > 2) return;
    onChange(val);
  }, [onChange]);

  const handleBlur = useCallback(() => {
    const result = validateCurrency(value);
    setValidation(result);
    setTouched(true);
    if (result.valid) {
      onChange(formatCurrency(value));
    }
    onBlur?.();
  }, [value, onChange, onBlur]);

  const showError = error || (touched && validation && !validation.valid);
  const displayHelper = helperText || (touched && validation && !validation.valid ? validation.message : "");

  return (
    <TextField
      label={label}
      value={value}
      onChange={handleChange}
      onBlur={handleBlur}
      error={!!showError}
      helperText={displayHelper}
      size="small"
      fullWidth
      disabled={readOnly}
      slotProps={{
        input: {
          startAdornment: <InputAdornment position="start">$</InputAdornment>,
          endAdornment: touched ? (
            <InputAdornment position="end">
              <ValidationIndicator valid={validation?.valid ?? null} />
            </InputAdornment>
          ) : undefined,
        },
        htmlInput: {
          inputMode: "decimal",
          "data-testid": `input-${label.toLowerCase().replace(/\s+/g, "-")}`,
        },
      }}
      data-testid={`field-${label.toLowerCase().replace(/\s+/g, "-")}`}
    />
  );
}

function ToggleField({ label, value, onChange, error, helperText }: Omit<FieldInputProps, "dataType" | "options" | "maxLength">) {
  const showError = !!error;

  return (
    <FormControl error={showError} data-testid={`field-${label.toLowerCase().replace(/\s+/g, "-")}`}>
      <FormLabel sx={{ fontSize: "0.75rem", fontWeight: 500, mb: 0.5 }}>{label}</FormLabel>
      <RadioGroup
        row
        value={value}
        onChange={(e) => onChange(e.target.value)}
        data-testid={`radio-group-${label.toLowerCase().replace(/\s+/g, "-")}`}
      >
        <FormControlLabel
          value="Y"
          control={<Radio size="small" />}
          label="Yes"
          data-testid={`radio-yes-${label.toLowerCase().replace(/\s+/g, "-")}`}
        />
        <FormControlLabel
          value="N"
          control={<Radio size="small" />}
          label="No"
          data-testid={`radio-no-${label.toLowerCase().replace(/\s+/g, "-")}`}
        />
      </RadioGroup>
      {showError && helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
}

function MultiCheckboxField({ label, value, options, onChange, error, helperText }: Omit<FieldInputProps, "dataType" | "maxLength">) {
  const selectedValues = value ? value.split(",").filter(Boolean) : [];

  const handleToggle = useCallback((optionValue: string) => {
    const newSelected = selectedValues.includes(optionValue)
      ? selectedValues.filter((v) => v !== optionValue)
      : [...selectedValues, optionValue];
    onChange(newSelected.join(","));
  }, [selectedValues, onChange]);

  const showError = !!error;

  return (
    <FormControl error={showError} data-testid={`field-${label.toLowerCase().replace(/\s+/g, "-")}`}>
      <FormLabel sx={{ fontSize: "0.75rem", fontWeight: 500, mb: 0.5 }}>{label}</FormLabel>
      <FormGroup row>
        {(options || []).map((opt) => (
          <FormControlLabel
            key={opt.value}
            control={
              <Checkbox
                size="small"
                checked={selectedValues.includes(opt.value)}
                onChange={() => handleToggle(opt.value)}
                data-testid={`checkbox-${opt.value.toLowerCase().replace(/\s+/g, "-")}`}
              />
            }
            label={opt.label}
          />
        ))}
      </FormGroup>
      {showError && helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
}

export function FieldInput(props: FieldInputProps) {
  const { dataType, ...rest } = props;

  switch (dataType) {
    case "text":
      return <TextInput {...rest} />;
    case "numeric":
      return <NumericInput {...rest} />;
    case "date":
      return <DateInput {...rest} />;
    case "currency":
      return <CurrencyInput {...rest} />;
    case "toggleYN":
      return <ToggleField {...rest} />;
    case "multiCheckbox":
      return <MultiCheckboxField {...rest} />;
    default:
      return <TextInput {...rest} />;
  }
}

export type { FieldInputProps, DataType };
