import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { InfoField } from "@/components/common/info-field";
import { StatusBadge } from "@/components/common/status-badge";
import { DetailSection } from "@/components/common/detail-section";
import { FieldInput } from "@/components/common/field-input";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import PersonIcon from "@mui/icons-material/Person";
import SecurityIcon from "@mui/icons-material/Security";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import HistoryIcon from "@mui/icons-material/History";
import DescriptionIcon from "@mui/icons-material/Description";
import EditIcon from "@mui/icons-material/Edit";
import HistoryToggleOffIcon from "@mui/icons-material/HistoryToggleOff";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import CircularProgress from "@mui/material/CircularProgress";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import TextField from "@mui/material/TextField";
import FormLabel from "@mui/material/FormLabel";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import FormControlLabel from "@mui/material/FormControlLabel";
import TableSortLabel from "@mui/material/TableSortLabel";
import TablePagination from "@mui/material/TablePagination";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import LockResetIcon from "@mui/icons-material/LockReset";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { Visibility, VisibilityOff } from "@mui/icons-material";

interface DirectDepositAccount {
  id: string;
  accountNumber: string;
  routingNumber: string;
  accountName: string;
  checkingAccount: "Y" | "N";
  depositType: "Fixed Amount" | "Percentage";
  amount: string;
  status: "Active" | "Pending" | "Deleted";
}

const initialDirectDeposits: DirectDepositAccount[] = [
  {
    id: "dd-1",
    accountNumber: "1234567890",
    routingNumber: "021000021",
    accountName: "Primary Checking",
    checkingAccount: "Y",
    depositType: "Fixed Amount",
    amount: "500.00",
    status: "Active",
  },
  {
    id: "dd-2",
    accountNumber: "9876543210",
    routingNumber: "011401533",
    accountName: "Savings Account",
    checkingAccount: "N",
    depositType: "Percentage",
    amount: "25",
    status: "Pending",
  },
];

const emptyDepositForm: Omit<DirectDepositAccount, "id"> = {
  accountNumber: "",
  routingNumber: "",
  accountName: "",
  checkingAccount: "Y",
  depositType: "Fixed Amount",
  amount: "",
  status: "Active",
};

function getDepositStatusVariant(status: string): "active" | "pending" | "inactive" {
  switch (status) {
    case "Active": return "active";
    case "Pending": return "pending";
    case "Deleted": return "inactive";
    default: return "inactive";
  }
}

const cardData = {
  cardNumber: "7083209000000019",
  accountId: "MC180",
  customerId: "BBB81",
  firstName: "TEST",
  lastName: "NARX",
  fullName: "TEST NARX",
  profileType: "Driver Profile (001)",
  employeeNumber: "1",
  lastActivity: "Feb 24, 2026 14:32",
  status: "Active",
  dob: "01/15/1985",
  ssnLast4: "6789",
  mccControls: "Standard",
  cardType: "OnRoad",
  unitNumber: "1",
  accountName: "NARX_TEST",
};

const cardHolderInfo = {
  lastName: "NARX",
  dob: "01/15/1985",
  ssnPartial: "XXX-XX-6789",
};

const networkRestrictions = [
  { category: "Fuel", allowed: true },
  { category: "Maintenance", allowed: true },
  { category: "Tires", allowed: true },
  { category: "Hotels/Lodging", allowed: false },
  { category: "Restaurants", allowed: false },
  { category: "ATM/Cash", allowed: false },
  { category: "Misc", allowed: false },
];

const cashLimits = {
  cashLimit: "$500.00",
  amountUsed: "$0.00",
  resetOption: "Daily",
};

const fuelLimits = {
  fuelLimit: "$1,500.00",
  gallonsPerTransaction: "200",
  resetOption: "Daily",
};

const recentUpdates = [
  { field: "STATUS", action: "CHG", oldValue: "A", newValue: "K", timestamp: "4:24:09 PM - Feb 17, 2026", user: "E28" },
  { field: "LASTNAME", action: "ADD", oldValue: "", newValue: "NARX", timestamp: "4:24:09 PM - Feb 17, 2026", user: "E28" },
  { field: "1ST NAME", action: "ADD", oldValue: "", newValue: "TEST", timestamp: "4:24:09 PM - Feb 17, 2026", user: "E28" },
  { field: "EMPLOYEE", action: "ADD", oldValue: "", newValue: "1", timestamp: "4:24:09 PM - Feb 17, 2026", user: "E28" },
  { field: "SL NAME", action: "ADD", oldValue: "", newValue: "12357", timestamp: "4:24:09 PM - Feb 17, 2026", user: "E28" },
  { field: "UNIT NR", action: "ADD", oldValue: "", newValue: "1", timestamp: "4:24:09 PM - Feb 17, 2026", user: "E28" },
];

const STATUS_OPTIONS = [
  { value: "Active", label: "Active (A)" },
  { value: "Block", label: "Block (B)" },
  { value: "Cancelled", label: "Cancelled (X)" },
  { value: "Fraud", label: "Fraud (F)" },
  { value: "Lost", label: "Lost (L)" },
  { value: "Stolen", label: "Stolen (S)" },
  { value: "Deactivated", label: "Deactivated (D)" },
];

const PROFILE_OPTIONS = [
  { value: "Driver Profile (001)", label: "Driver Profile (001)" },
  { value: "Executive", label: "Executive" },
  { value: "Standard", label: "Standard" },
  { value: "Budget", label: "Budget" },
  { value: "Premium", label: "Premium" },
];

const RESET_OPTIONS = [
  { value: "Daily", label: "Daily" },
  { value: "Weekly", label: "Weekly" },
  { value: "Monthly", label: "Monthly" },
  { value: "Transaction", label: "Per Transaction" },
];

interface Transaction {
  id: string;
  date: string;
  merchant: string;
  amount: number;
  type: string;
  status: "Completed" | "Pending" | "Declined" | "Cancelled";
}

const mockTransactions: Transaction[] = [
  { id: "tx-1", date: "2026-02-24", merchant: "Shell Gas Station #1234", amount: 87.50, type: "Fuel", status: "Completed" },
  { id: "tx-2", date: "2026-02-24", merchant: "Truck Parts Depot", amount: 245.00, type: "Maintenance", status: "Completed" },
  { id: "tx-3", date: "2026-02-23", merchant: "Love's Travel Stop #456", amount: 134.75, type: "Fuel", status: "Completed" },
  { id: "tx-4", date: "2026-02-23", merchant: "Quick Tire Center", amount: 450.00, type: "Tires", status: "Pending" },
  { id: "tx-5", date: "2026-02-22", merchant: "BP Station #789", amount: 92.30, type: "Fuel", status: "Completed" },
  { id: "tx-6", date: "2026-02-22", merchant: "Fleet Wash Co", amount: 35.00, type: "Maintenance", status: "Completed" },
  { id: "tx-7", date: "2026-02-21", merchant: "Pilot Travel Center #321", amount: 156.80, type: "Fuel", status: "Declined" },
  { id: "tx-8", date: "2026-02-21", merchant: "AutoZone #567", amount: 89.99, type: "Maintenance", status: "Completed" },
  { id: "tx-9", date: "2026-02-20", merchant: "TA Petro #890", amount: 201.45, type: "Fuel", status: "Completed" },
  { id: "tx-10", date: "2026-02-20", merchant: "Denny's Restaurant", amount: 24.50, type: "Meals", status: "Cancelled" },
  { id: "tx-11", date: "2026-02-19", merchant: "Marathon Station #234", amount: 78.60, type: "Fuel", status: "Completed" },
  { id: "tx-12", date: "2026-02-19", merchant: "Hampton Inn", amount: 129.00, type: "Lodging", status: "Completed" },
  { id: "tx-13", date: "2026-02-18", merchant: "Speedway #678", amount: 65.40, type: "Fuel", status: "Completed" },
  { id: "tx-14", date: "2026-02-18", merchant: "Walmart Supercenter", amount: 42.75, type: "Merchandise", status: "Declined" },
  { id: "tx-15", date: "2026-02-17", merchant: "Exxon Station #901", amount: 110.25, type: "Fuel", status: "Completed" },
  { id: "tx-16", date: "2026-02-17", merchant: "ATM Withdrawal", amount: 200.00, type: "Cash", status: "Completed" },
  { id: "tx-17", date: "2026-02-16", merchant: "Valvoline Instant Oil", amount: 79.99, type: "Maintenance", status: "Completed" },
  { id: "tx-18", date: "2026-02-16", merchant: "Sunoco Station #345", amount: 98.10, type: "Fuel", status: "Completed" },
];

type TxSortKey = "date" | "merchant" | "amount" | "type" | "status";

const txStatusColor: Record<string, { bg: string; text: string }> = {
  Completed: { bg: "#ECFDF5", text: "#047857" },
  Pending: { bg: "#FFFBEB", text: "#D97706" },
  Declined: { bg: "#FEF2F2", text: "#DC2626" },
  Cancelled: { bg: "#F1F5F9", text: "#475569" },
};

interface BasicInfoEditValues {
  firstName: string;
  lastName: string;
  dob: string;
  ssnLast4: string;
  employeeId: string;
  status: string;
  profile: string;
}

interface CashLimitsEditValues {
  cashLimit: string;
  amountUsed: string;
  resetOption: string;
}

function useSectionLoading(delay = 800) {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), delay);
    return () => clearTimeout(timer);
  }, [delay]);
  return loading;
}

function parseCurrencyToRaw(val: string): string {
  return val.replace(/[$,]/g, "");
}

export default function CardDetails() {
  const params = useParams<{ id: string }>();
  const [cardNumberMasked, setCardNumberMasked] = useState(true);
  const [dobMasked, setDobMasked] = useState(true);
  const [ssnMasked, setSsnMasked] = useState(true);
  const [holderDobMasked, setHolderDobMasked] = useState(true);
  const [holderSsnMasked, setHolderSsnMasked] = useState(true);

  const loadingBasic = useSectionLoading(600);
  const loadingHolder = useSectionLoading(800);
  const loadingNetwork = useSectionLoading(700);
  const loadingCash = useSectionLoading(900);
  const loadingFuel = useSectionLoading(1000);
  const loadingDeposit = useSectionLoading(750);
  const loadingTransactions = useSectionLoading(850);
  const loadingAudit = useSectionLoading(500);

  const isOnRoad = cardData.cardType === "OnRoad";
  const showCashLimits = true;
  const showDirectDeposit = true;

  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [directDeposits, setDirectDeposits] = useState<DirectDepositAccount[]>(initialDirectDeposits);
  const [ddModalOpen, setDdModalOpen] = useState(false);
  const [ddEditingId, setDdEditingId] = useState<string | null>(null);
  const [ddForm, setDdForm] = useState<Omit<DirectDepositAccount, "id">>(emptyDepositForm);
  const [ddFormErrors, setDdFormErrors] = useState<Record<string, string>>({});
  const [ddSaving, setDdSaving] = useState(false);
  const [ddDeleteConfirmOpen, setDdDeleteConfirmOpen] = useState(false);
  const [ddDeleteTarget, setDdDeleteTarget] = useState<DirectDepositAccount | null>(null);
  const [ddDeleting, setDdDeleting] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string }>({ open: false, message: "" });

  const [resetPinOpen, setResetPinOpen] = useState(false);
  const [resetPinState, setResetPinState] = useState<"confirm" | "processing" | "success" | "error">("confirm");

  const [txSortKey, setTxSortKey] = useState<TxSortKey>("date");
  const [txSortDir, setTxSortDir] = useState<"asc" | "desc">("desc");
  const [txPage, setTxPage] = useState(0);
  const [txRowsPerPage, setTxRowsPerPage] = useState(10);
  const [txMerchantFilter, setTxMerchantFilter] = useState("");

  const handleTxSort = useCallback((key: TxSortKey) => {
    setTxSortDir((prev) => (txSortKey === key ? (prev === "asc" ? "desc" : "asc") : "desc"));
    setTxSortKey(key);
  }, [txSortKey]);

  const filteredTransactions = useMemo(() => {
    let list = [...mockTransactions];
    if (txMerchantFilter.trim()) {
      const q = txMerchantFilter.toLowerCase();
      list = list.filter((t) => t.merchant.toLowerCase().includes(q));
    }
    return list;
  }, [txMerchantFilter]);

  const sortedTransactions = useMemo(() => {
    const sorted = [...filteredTransactions];
    const dir = txSortDir === "asc" ? 1 : -1;
    sorted.sort((a, b) => {
      switch (txSortKey) {
        case "date": return dir * a.date.localeCompare(b.date);
        case "merchant": return dir * a.merchant.localeCompare(b.merchant);
        case "amount": return dir * (a.amount - b.amount);
        case "type": return dir * a.type.localeCompare(b.type);
        case "status": return dir * a.status.localeCompare(b.status);
        default: return 0;
      }
    });
    return sorted;
  }, [filteredTransactions, txSortKey, txSortDir]);

  const paginatedTransactions = useMemo(() => {
    const start = txPage * txRowsPerPage;
    return sortedTransactions.slice(start, start + txRowsPerPage);
  }, [sortedTransactions, txPage, txRowsPerPage]);

  const handleResetPin = useCallback(() => {
    setResetPinState("processing");
    setTimeout(() => {
      const success = Math.random() > 0.2;
      if (success) {
        setResetPinState("success");
        setTimeout(() => {
          setResetPinOpen(false);
          setResetPinState("confirm");
          setSnackbar({ open: true, message: "PIN reset successfully" });
        }, 2000);
      } else {
        setResetPinState("error");
      }
    }, 1500);
  }, []);

  const [basicInfoValues, setBasicInfoValues] = useState<BasicInfoEditValues>({
    firstName: cardData.firstName,
    lastName: cardData.lastName,
    dob: "0115",
    ssnLast4: cardData.ssnLast4,
    employeeId: cardData.employeeNumber,
    status: cardData.status,
    profile: cardData.profileType,
  });
  const [basicInfoOriginal, setBasicInfoOriginal] = useState<BasicInfoEditValues | null>(null);

  const [cashValues, setCashValues] = useState<CashLimitsEditValues>({
    cashLimit: parseCurrencyToRaw(cashLimits.cashLimit),
    amountUsed: parseCurrencyToRaw(cashLimits.amountUsed),
    resetOption: cashLimits.resetOption,
  });
  const [cashOriginal, setCashOriginal] = useState<CashLimitsEditValues | null>(null);

  const basicInfoDirty = useMemo(() => {
    if (!basicInfoOriginal) return false;
    return (
      basicInfoValues.firstName !== basicInfoOriginal.firstName ||
      basicInfoValues.lastName !== basicInfoOriginal.lastName ||
      basicInfoValues.dob !== basicInfoOriginal.dob ||
      basicInfoValues.ssnLast4 !== basicInfoOriginal.ssnLast4 ||
      basicInfoValues.employeeId !== basicInfoOriginal.employeeId ||
      basicInfoValues.status !== basicInfoOriginal.status ||
      basicInfoValues.profile !== basicInfoOriginal.profile
    );
  }, [basicInfoValues, basicInfoOriginal]);

  const basicInfoValid = useMemo(() => {
    if (!basicInfoValues.firstName.trim()) return false;
    if (!basicInfoValues.lastName.trim()) return false;
    if (!/^\d{4}$/.test(basicInfoValues.dob)) return false;
    const month = parseInt(basicInfoValues.dob.substring(0, 2), 10);
    const day = parseInt(basicInfoValues.dob.substring(2, 4), 10);
    if (month < 1 || month > 12 || day < 1 || day > 31) return false;
    if (!/^\d+$/.test(basicInfoValues.ssnLast4)) return false;
    if (!/^\d+$/.test(basicInfoValues.employeeId)) return false;
    return true;
  }, [basicInfoValues]);

  const cashDirty = useMemo(() => {
    if (!cashOriginal) return false;
    return (
      cashValues.cashLimit !== cashOriginal.cashLimit ||
      cashValues.resetOption !== cashOriginal.resetOption
    );
  }, [cashValues, cashOriginal]);

  const cashValid = useMemo(() => {
    const raw = cashValues.cashLimit;
    if (!raw.trim()) return false;
    if (!/^\d+(\.\d{0,2})?$/.test(raw)) return false;
    return true;
  }, [cashValues]);

  const handleEditBasicInfo = useCallback(() => {
    setBasicInfoOriginal({ ...basicInfoValues });
    setEditingSection("basic-information");
  }, [basicInfoValues]);

  const handleCancelBasicInfo = useCallback(() => {
    if (basicInfoOriginal) {
      setBasicInfoValues({ ...basicInfoOriginal });
    }
    setBasicInfoOriginal(null);
    setEditingSection(null);
  }, [basicInfoOriginal]);

  const handleSaveBasicInfo = useCallback(() => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setBasicInfoOriginal(null);
      setEditingSection(null);
    }, 1500);
  }, []);

  const handleEditCash = useCallback(() => {
    setCashOriginal({ ...cashValues });
    setEditingSection("cash-limits");
  }, [cashValues]);

  const handleCancelCash = useCallback(() => {
    if (cashOriginal) {
      setCashValues({ ...cashOriginal });
    }
    setCashOriginal(null);
    setEditingSection(null);
  }, [cashOriginal]);

  const handleSaveCash = useCallback(() => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setCashOriginal(null);
      setEditingSection(null);
    }, 1500);
  }, []);

  const handleDdAdd = useCallback(() => {
    setDdEditingId(null);
    setDdForm({ ...emptyDepositForm });
    setDdFormErrors({});
    setDdModalOpen(true);
  }, []);

  const handleDdEdit = useCallback((deposit: DirectDepositAccount) => {
    setDdEditingId(deposit.id);
    setDdForm({
      accountNumber: deposit.accountNumber,
      routingNumber: deposit.routingNumber,
      accountName: deposit.accountName,
      checkingAccount: deposit.checkingAccount,
      depositType: deposit.depositType,
      amount: deposit.amount,
      status: deposit.status,
    });
    setDdFormErrors({});
    setDdModalOpen(true);
  }, []);

  const validateDdForm = useCallback((): boolean => {
    const errors: Record<string, string> = {};
    if (!ddForm.accountNumber.trim()) errors.accountNumber = "Account number is required";
    if (!ddForm.routingNumber.trim()) errors.routingNumber = "Routing number is required";
    else if (!/^\d{9}$/.test(ddForm.routingNumber)) errors.routingNumber = "Routing number must be 9 digits";
    if (!ddForm.accountName.trim()) errors.accountName = "Account name is required";
    if (!ddForm.amount.trim()) errors.amount = "Amount is required";
    else {
      const numAmount = parseFloat(ddForm.amount);
      if (isNaN(numAmount) || numAmount <= 0) errors.amount = "Amount must be a positive number";
      if (ddForm.depositType === "Percentage" && numAmount > 100) errors.amount = "Percentage cannot exceed 100";
    }
    setDdFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [ddForm]);

  const handleDdSave = useCallback(() => {
    if (!validateDdForm()) return;
    setDdSaving(true);
    setTimeout(() => {
      if (ddEditingId) {
        setDirectDeposits((prev) =>
          prev.map((d) => (d.id === ddEditingId ? { ...d, ...ddForm } : d))
        );
        setSnackbar({ open: true, message: "Direct deposit updated successfully" });
      } else {
        const newDeposit: DirectDepositAccount = {
          ...ddForm,
          id: `dd-${Date.now()}`,
        };
        setDirectDeposits((prev) => [...prev, newDeposit]);
        setSnackbar({ open: true, message: "Direct deposit added successfully" });
      }
      setDdSaving(false);
      setDdModalOpen(false);
    }, 1000);
  }, [ddEditingId, ddForm, validateDdForm]);

  const handleDdDeleteConfirm = useCallback((deposit: DirectDepositAccount) => {
    setDdDeleteTarget(deposit);
    setDdDeleteConfirmOpen(true);
  }, []);

  const handleDdDelete = useCallback(() => {
    if (!ddDeleteTarget) return;
    setDdDeleting(true);
    setTimeout(() => {
      setDirectDeposits((prev) => prev.filter((d) => d.id !== ddDeleteTarget.id));
      setSnackbar({ open: true, message: "Direct deposit deleted successfully" });
      setDdDeleting(false);
      setDdDeleteConfirmOpen(false);
      setDdDeleteTarget(null);
    }, 800);
  }, [ddDeleteTarget]);

  const handleDdFormChange = useCallback((field: keyof Omit<DirectDepositAccount, "id">, value: string) => {
    setDdForm((prev) => ({ ...prev, [field]: value }));
    setDdFormErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const maskedCardDisplay = cardNumberMasked
    ? "\u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 " + cardData.cardNumber.slice(-4)
    : cardData.cardNumber.replace(/(.{4})/g, "$1 ").trim();

  const isEditingBasicInfo = editingSection === "basic-information";
  const isEditingCash = editingSection === "cash-limits";

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Breadcrumbs
        items={[
          { label: "Manage", path: "/manage" },
          { label: "Card Maintenance", path: "/manage/card-maintenance" },
          { label: `Card Details (${cardData.accountName})` },
        ]}
      />
      <Box sx={{ flex: 1, overflow: "auto" }}>
        <Box sx={{ maxWidth: 960, mx: "auto", px: 3, py: 3 }}>
          <Stack spacing={3}>
            <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 2, flexWrap: "wrap" }}>
              <Box>
                <Typography variant="h1" data-testid="text-card-details-title">
                  Card Details
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5 }} data-testid="text-card-details-subtitle">
                  Manage and monitor settings for account {cardData.accountName}
                </Typography>
              </Box>
              <Stack direction="row" spacing={1}>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<LockResetIcon />}
                  onClick={() => { setResetPinState("confirm"); setResetPinOpen(true); }}
                  data-testid="button-reset-pin"
                >
                  Reset PIN
                </Button>
                <Button variant="outlined" size="small" startIcon={<HistoryToggleOffIcon />} data-testid="button-view-history">
                  View History
                </Button>
                <Button variant="contained" size="small" startIcon={<EditIcon />} data-testid="button-edit-information">
                  Edit Information
                </Button>
              </Stack>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                p: 2.5,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                bgcolor: "action.hover",
                flexWrap: "wrap",
              }}
              data-testid="card-header"
            >
              <CreditCardIcon sx={{ fontSize: 32, color: "primary.main" }} />
              <Box sx={{ flexGrow: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                  <Typography
                    variant="h6"
                    sx={{ fontFamily: "'Roboto Mono', monospace", fontWeight: 600, letterSpacing: "0.05em" }}
                    data-testid="text-card-number-header"
                  >
                    {maskedCardDisplay}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => setCardNumberMasked(!cardNumberMasked)}
                    data-testid="toggle-mask-card-number"
                    aria-label={cardNumberMasked ? "Reveal card number" : "Hide card number"}
                    sx={{ p: 0.5 }}
                  >
                    {cardNumberMasked ? (
                      <Visibility sx={{ fontSize: 20, color: "#999" }} />
                    ) : (
                      <VisibilityOff sx={{ fontSize: 20, color: "#999" }} />
                    )}
                  </IconButton>
                </Box>
                <Typography variant="body2" sx={{ color: "text.secondary" }} data-testid="text-cardholder-name">
                  {cardData.fullName}
                </Typography>
              </Box>
              <StatusBadge status={cardData.status} variant="active" />
            </Box>

            <DetailSection
              title="Basic Information"
              icon={<CreditCardIcon />}
              editable
              loading={loadingBasic}
              defaultExpanded
              editing={isEditingBasicInfo}
              editDisabled={editingSection !== null && !isEditingBasicInfo}
              saving={saving}
              saveDisabled={!basicInfoDirty || !basicInfoValid}
              onEdit={handleEditBasicInfo}
              onSave={handleSaveBasicInfo}
              onCancel={handleCancelBasicInfo}
            >
              {isEditingBasicInfo ? (
                <Grid container spacing={2}>
                  <Grid size={{ xs: 6, md: 3 }}>
                    <InfoField
                      label="Card Number"
                      value={cardData.cardNumber}
                      masked={cardNumberMasked}
                      onToggleMask={() => setCardNumberMasked(!cardNumberMasked)}
                    />
                  </Grid>
                  <Grid size={{ xs: 6, md: 3 }}>
                    <FieldInput
                      label="First Name"
                      value={basicInfoValues.firstName}
                      dataType="text"
                      maxLength={30}
                      onChange={(val) => setBasicInfoValues((prev) => ({ ...prev, firstName: val }))}
                    />
                  </Grid>
                  <Grid size={{ xs: 6, md: 3 }}>
                    <FieldInput
                      label="Last Name"
                      value={basicInfoValues.lastName}
                      dataType="text"
                      maxLength={30}
                      onChange={(val) => setBasicInfoValues((prev) => ({ ...prev, lastName: val }))}
                    />
                  </Grid>
                  <Grid size={{ xs: 6, md: 3 }}>
                    <FieldInput
                      label="Date of Birth"
                      value={basicInfoValues.dob}
                      dataType="date"
                      onChange={(val) => setBasicInfoValues((prev) => ({ ...prev, dob: val }))}
                    />
                  </Grid>
                  <Grid size={{ xs: 6, md: 3 }}>
                    <FieldInput
                      label="SSN Last 4"
                      value={basicInfoValues.ssnLast4}
                      dataType="numeric"
                      maxLength={4}
                      onChange={(val) => setBasicInfoValues((prev) => ({ ...prev, ssnLast4: val }))}
                    />
                  </Grid>
                  <Grid size={{ xs: 6, md: 3 }}>
                    <FieldInput
                      label="Employee ID"
                      value={basicInfoValues.employeeId}
                      dataType="numeric"
                      maxLength={10}
                      onChange={(val) => setBasicInfoValues((prev) => ({ ...prev, employeeId: val }))}
                    />
                  </Grid>
                  <Grid size={{ xs: 6, md: 3 }}>
                    <FormControl size="small" fullWidth data-testid="field-status-select">
                      <InputLabel>Status</InputLabel>
                      <Select
                        label="Status"
                        value={basicInfoValues.status}
                        onChange={(e) => setBasicInfoValues((prev) => ({ ...prev, status: e.target.value }))}
                        data-testid="select-status"
                      >
                        {STATUS_OPTIONS.map((opt) => (
                          <MenuItem key={opt.value} value={opt.value} data-testid={`option-status-${opt.value.toLowerCase()}`}>
                            {opt.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 6, md: 3 }}>
                    <FormControl size="small" fullWidth data-testid="field-profile-select">
                      <InputLabel>Profile</InputLabel>
                      <Select
                        label="Profile"
                        value={basicInfoValues.profile}
                        onChange={(e) => setBasicInfoValues((prev) => ({ ...prev, profile: e.target.value }))}
                        data-testid="select-profile"
                      >
                        {PROFILE_OPTIONS.map((opt) => (
                          <MenuItem key={opt.value} value={opt.value} data-testid={`option-profile-${opt.value.toLowerCase().replace(/\s+/g, "-")}`}>
                            {opt.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 6, md: 3 }}>
                    <InfoField label="MCC Controls" value={cardData.mccControls} />
                  </Grid>
                </Grid>
              ) : (
                <Grid container spacing={2}>
                  <Grid size={{ xs: 6, md: 3 }}>
                    <InfoField
                      label="Card Number"
                      value={cardData.cardNumber}
                      masked={cardNumberMasked}
                      onToggleMask={() => setCardNumberMasked(!cardNumberMasked)}
                    />
                  </Grid>
                  <Grid size={{ xs: 6, md: 3 }}>
                    <InfoField label="First Name" value={basicInfoValues.firstName} />
                  </Grid>
                  <Grid size={{ xs: 6, md: 3 }}>
                    <InfoField label="Last Name" value={basicInfoValues.lastName} />
                  </Grid>
                  <Grid size={{ xs: 6, md: 3 }}>
                    <InfoField
                      label="Date of Birth"
                      value={cardData.dob}
                      masked={dobMasked}
                      onToggleMask={() => setDobMasked(!dobMasked)}
                    />
                  </Grid>
                  <Grid size={{ xs: 6, md: 3 }}>
                    <InfoField
                      label="SSN Last 4"
                      value={basicInfoValues.ssnLast4}
                      masked={ssnMasked}
                      onToggleMask={() => setSsnMasked(!ssnMasked)}
                    />
                  </Grid>
                  <Grid size={{ xs: 6, md: 3 }}>
                    <InfoField label="Employee ID" value={basicInfoValues.employeeId} />
                  </Grid>
                  <Grid size={{ xs: 6, md: 3 }}>
                    <InfoField label="Status" value={basicInfoValues.status} />
                  </Grid>
                  <Grid size={{ xs: 6, md: 3 }}>
                    <InfoField label="Profile" value={basicInfoValues.profile} />
                  </Grid>
                  <Grid size={{ xs: 6, md: 3 }}>
                    <InfoField label="MCC Controls" value={cardData.mccControls} />
                  </Grid>
                </Grid>
              )}
            </DetailSection>

            <DetailSection
              title="Card Holder Info"
              icon={<PersonIcon />}
              editable
              loading={loadingHolder}
              defaultExpanded
              editDisabled={editingSection !== null}
              onEdit={() => {}}
            >
              <Grid container spacing={2}>
                <Grid size={{ xs: 6, md: 4 }}>
                  <InfoField label="Last Name" value={cardHolderInfo.lastName} />
                </Grid>
                <Grid size={{ xs: 6, md: 4 }}>
                  <InfoField
                    label="Date of Birth"
                    value={cardHolderInfo.dob}
                    masked={holderDobMasked}
                    onToggleMask={() => setHolderDobMasked(!holderDobMasked)}
                  />
                </Grid>
                <Grid size={{ xs: 6, md: 4 }}>
                  <InfoField
                    label="SSN (Partial)"
                    value={cardHolderInfo.ssnPartial}
                    masked={holderSsnMasked}
                    onToggleMask={() => setHolderSsnMasked(!holderSsnMasked)}
                  />
                </Grid>
              </Grid>
            </DetailSection>

            <DetailSection
              title="Network Restrictions"
              icon={<SecurityIcon />}
              editable
              loading={loadingNetwork}
              editDisabled={editingSection !== null}
              onEdit={() => {}}
            >
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Merchant Category</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {networkRestrictions.map((item) => (
                      <TableRow key={item.category} data-testid={`row-network-${item.category.toLowerCase().replace(/[\s/]+/g, "-")}`}>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>
                          <StatusBadge
                            status={item.allowed ? "Allowed" : "Blocked"}
                            variant={item.allowed ? "active" : "inactive"}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </DetailSection>

            {showCashLimits && (
              <DetailSection
                title="Cash Limits"
                icon={<AttachMoneyIcon />}
                editable
                loading={loadingCash}
                editing={isEditingCash}
                editDisabled={editingSection !== null && !isEditingCash}
                saving={saving}
                saveDisabled={!cashDirty || !cashValid}
                onEdit={handleEditCash}
                onSave={handleSaveCash}
                onCancel={handleCancelCash}
              >
                {isEditingCash ? (
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 6, md: 4 }}>
                      <FieldInput
                        label="Cash Limit"
                        value={cashValues.cashLimit}
                        dataType="currency"
                        onChange={(val) => setCashValues((prev) => ({ ...prev, cashLimit: val }))}
                      />
                    </Grid>
                    <Grid size={{ xs: 6, md: 4 }}>
                      <FieldInput
                        label="Amount Used"
                        value={cashValues.amountUsed}
                        dataType="currency"
                        readOnly
                        onChange={() => {}}
                      />
                    </Grid>
                    <Grid size={{ xs: 6, md: 4 }}>
                      <FormControl size="small" fullWidth data-testid="field-reset-option-select">
                        <InputLabel>Reset Option</InputLabel>
                        <Select
                          label="Reset Option"
                          value={cashValues.resetOption}
                          onChange={(e) => setCashValues((prev) => ({ ...prev, resetOption: e.target.value }))}
                          data-testid="select-reset-option"
                        >
                          {RESET_OPTIONS.map((opt) => (
                            <MenuItem key={opt.value} value={opt.value} data-testid={`option-reset-${opt.value.toLowerCase()}`}>
                              {opt.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                ) : (
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 6, md: 4 }}>
                      <InfoField label="Cash Limit" value={`$${parseFloat(cashValues.cashLimit).toFixed(2)}`} valueClassName="font-mono" />
                    </Grid>
                    <Grid size={{ xs: 6, md: 4 }}>
                      <InfoField label="Amount Used" value={`$${parseFloat(cashValues.amountUsed).toFixed(2)}`} valueClassName="font-mono" />
                    </Grid>
                    <Grid size={{ xs: 6, md: 4 }}>
                      <InfoField label="Reset Option" value={cashValues.resetOption} />
                    </Grid>
                  </Grid>
                )}
              </DetailSection>
            )}

            {isOnRoad && (
              <DetailSection
                title="Fuel Limits"
                icon={<LocalGasStationIcon />}
                editable
                loading={loadingFuel}
                editDisabled={editingSection !== null}
                onEdit={() => {}}
              >
                <Grid container spacing={2}>
                  <Grid size={{ xs: 6, md: 4 }}>
                    <InfoField label="Fuel Limit" value={fuelLimits.fuelLimit} valueClassName="font-mono" />
                  </Grid>
                  <Grid size={{ xs: 6, md: 4 }}>
                    <InfoField label="Gallons Per Transaction" value={fuelLimits.gallonsPerTransaction} />
                  </Grid>
                  <Grid size={{ xs: 6, md: 4 }}>
                    <InfoField label="Reset Option" value={fuelLimits.resetOption} />
                  </Grid>
                </Grid>
              </DetailSection>
            )}

            {showDirectDeposit && (
              <DetailSection
                title="Direct Deposit"
                icon={<AccountBalanceIcon />}
                loading={loadingDeposit}
              >
                <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={handleDdAdd}
                    data-testid="button-add-direct-deposit"
                  >
                    Add Direct Deposit
                  </Button>
                </Box>
                {directDeposits.length === 0 ? (
                  <Typography variant="body2" sx={{ color: "text.secondary", py: 2, textAlign: "center" }} data-testid="text-no-direct-deposits">
                    No direct deposit accounts configured.
                  </Typography>
                ) : (
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Account Number</TableCell>
                          <TableCell>Routing Number</TableCell>
                          <TableCell>Account Name</TableCell>
                          <TableCell>Checking</TableCell>
                          <TableCell>Deposit Type</TableCell>
                          <TableCell>Amount</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {directDeposits.map((deposit) => (
                          <TableRow key={deposit.id} data-testid={`row-direct-deposit-${deposit.id}`}>
                            <TableCell sx={{ fontFamily: "'Roboto Mono', monospace" }}>
                              {"\u2022\u2022\u2022\u2022\u2022\u2022" + deposit.accountNumber.slice(-4)}
                            </TableCell>
                            <TableCell sx={{ fontFamily: "'Roboto Mono', monospace" }}>
                              {deposit.routingNumber}
                            </TableCell>
                            <TableCell>{deposit.accountName}</TableCell>
                            <TableCell>{deposit.checkingAccount}</TableCell>
                            <TableCell>{deposit.depositType}</TableCell>
                            <TableCell sx={{ fontFamily: "'Roboto Mono', monospace" }}>
                              {deposit.depositType === "Percentage" ? `${deposit.amount}%` : `$${deposit.amount}`}
                            </TableCell>
                            <TableCell>
                              <StatusBadge
                                status={deposit.status}
                                variant={getDepositStatusVariant(deposit.status)}
                              />
                            </TableCell>
                            <TableCell>
                              <Stack direction="row" spacing={0.5}>
                                <IconButton
                                  size="small"
                                  onClick={() => handleDdEdit(deposit)}
                                  data-testid={`button-edit-deposit-${deposit.id}`}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  onClick={() => handleDdDeleteConfirm(deposit)}
                                  data-testid={`button-delete-deposit-${deposit.id}`}
                                  sx={{ color: "error.main" }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Stack>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </DetailSection>
            )}

            <DetailSection
              title="Transaction History"
              icon={<HistoryIcon />}
              loading={loadingTransactions}
            >
              <Stack spacing={1.5}>
                <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
                  <TextField
                    size="small"
                    placeholder="Search merchant..."
                    value={txMerchantFilter}
                    onChange={(e) => { setTxMerchantFilter(e.target.value); setTxPage(0); }}
                    sx={{ minWidth: 200 }}
                    data-testid="input-tx-merchant-filter"
                  />
                </Box>
                {filteredTransactions.length === 0 ? (
                  <Box sx={{ textAlign: "center", py: 4 }} data-testid="text-tx-empty">
                    <Typography variant="body1" sx={{ fontWeight: 500, mb: 0.5 }}>No transactions found</Typography>
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>Try adjusting your search filters</Typography>
                  </Box>
                ) : (
                  <>
                    <TableContainer>
                      <Table size="small" stickyHeader>
                        <TableHead>
                          <TableRow>
                            {(["date", "merchant", "amount", "type", "status"] as TxSortKey[]).map((col) => (
                              <TableCell
                                key={col}
                                align={col === "amount" ? "right" : "left"}
                                sx={{ bgcolor: "background.paper" }}
                              >
                                <TableSortLabel
                                  active={txSortKey === col}
                                  direction={txSortKey === col ? txSortDir : "asc"}
                                  onClick={() => handleTxSort(col)}
                                  data-testid={`sort-tx-${col}`}
                                >
                                  {col === "date" ? "Date" : col === "merchant" ? "Merchant" : col === "amount" ? "Amount" : col === "type" ? "Type" : "Status"}
                                </TableSortLabel>
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {paginatedTransactions.map((tx) => (
                            <TableRow key={tx.id} data-testid={`row-tx-${tx.id}`}>
                              <TableCell>{tx.date}</TableCell>
                              <TableCell>{tx.merchant}</TableCell>
                              <TableCell align="right" sx={{ fontFamily: "'Roboto Mono', monospace" }}>
                                ${tx.amount.toFixed(2)}
                              </TableCell>
                              <TableCell>{tx.type}</TableCell>
                              <TableCell>
                                <Chip
                                  label={tx.status}
                                  size="small"
                                  sx={{
                                    bgcolor: txStatusColor[tx.status]?.bg || "#F1F5F9",
                                    color: txStatusColor[tx.status]?.text || "#475569",
                                    fontWeight: 500,
                                    fontSize: "0.75rem",
                                  }}
                                  data-testid={`badge-tx-status-${tx.id}`}
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <TablePagination
                      component="div"
                      count={filteredTransactions.length}
                      page={txPage}
                      onPageChange={(_, p) => setTxPage(p)}
                      rowsPerPage={txRowsPerPage}
                      onRowsPerPageChange={(e) => { setTxRowsPerPage(parseInt(e.target.value, 10)); setTxPage(0); }}
                      rowsPerPageOptions={[10, 25, 50]}
                      data-testid="pagination-transactions"
                    />
                  </>
                )}
              </Stack>
            </DetailSection>

            <DetailSection
              title="Recent Updates"
              icon={<DescriptionIcon />}
              loading={loadingAudit}
              defaultExpanded
            >
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Field</TableCell>
                      <TableCell>Action</TableCell>
                      <TableCell>Old Value</TableCell>
                      <TableCell>New Value</TableCell>
                      <TableCell>Timestamp</TableCell>
                      <TableCell>User</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentUpdates.map((update, idx) => (
                      <TableRow key={idx} data-testid={`row-update-${idx}`}>
                        <TableCell sx={{ fontWeight: 500 }}>{update.field}</TableCell>
                        <TableCell>
                          <Chip label={update.action} size="small" variant="outlined" />
                        </TableCell>
                        <TableCell sx={{ color: "text.secondary", fontFamily: "'Roboto Mono', monospace" }}>
                          {update.oldValue || "\u2014"}
                        </TableCell>
                        <TableCell sx={{ fontFamily: "'Roboto Mono', monospace" }}>{update.newValue}</TableCell>
                        <TableCell sx={{ color: "text.secondary" }}>{update.timestamp}</TableCell>
                        <TableCell sx={{ color: "text.secondary" }}>{update.user}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </DetailSection>

            <Box sx={{ textAlign: "center", py: 3 }} data-testid="footer">
              <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 0.5 }}>
                <Typography variant="body2" sx={{ cursor: "pointer", "&:hover": { color: "text.primary" } }}>Support</Typography>
                <Typography variant="body2" sx={{ cursor: "pointer", "&:hover": { color: "text.primary" } }}>Terms of Service</Typography>
                <Typography variant="body2" sx={{ cursor: "pointer", "&:hover": { color: "text.primary" } }}>Privacy Policy</Typography>
              </Stack>
              <Typography variant="body2">COMDATA SYSTEM - POWERED BY iConnectData &copy; 2026</Typography>
            </Box>
          </Stack>
        </Box>
      </Box>

      <Dialog
        open={ddModalOpen}
        onClose={() => { if (!ddSaving) setDdModalOpen(false); }}
        maxWidth="sm"
        fullWidth
        data-testid="dialog-direct-deposit"
      >
        <DialogTitle data-testid="text-dd-dialog-title">
          {ddEditingId ? "Edit Direct Deposit" : "Add Direct Deposit"}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <TextField
              label="Account Number"
              value={ddForm.accountNumber}
              onChange={(e) => handleDdFormChange("accountNumber", e.target.value)}
              error={!!ddFormErrors.accountNumber}
              helperText={ddFormErrors.accountNumber}
              fullWidth
              size="small"
              data-testid="input-dd-account-number"
            />
            <TextField
              label="Routing Number"
              value={ddForm.routingNumber}
              onChange={(e) => handleDdFormChange("routingNumber", e.target.value.replace(/\D/g, "").slice(0, 9))}
              error={!!ddFormErrors.routingNumber}
              helperText={ddFormErrors.routingNumber || "9 digits"}
              fullWidth
              size="small"
              data-testid="input-dd-routing-number"
            />
            <TextField
              label="Account Name"
              value={ddForm.accountName}
              onChange={(e) => handleDdFormChange("accountName", e.target.value)}
              error={!!ddFormErrors.accountName}
              helperText={ddFormErrors.accountName}
              fullWidth
              size="small"
              data-testid="input-dd-account-name"
            />
            <FormControl>
              <FormLabel data-testid="label-dd-checking">Checking Account</FormLabel>
              <RadioGroup
                row
                value={ddForm.checkingAccount}
                onChange={(e) => handleDdFormChange("checkingAccount", e.target.value)}
                data-testid="input-dd-checking-account"
              >
                <FormControlLabel value="Y" control={<Radio size="small" />} label="Yes" data-testid="radio-dd-checking-yes" />
                <FormControlLabel value="N" control={<Radio size="small" />} label="No" data-testid="radio-dd-checking-no" />
              </RadioGroup>
            </FormControl>
            <FormControl fullWidth size="small">
              <InputLabel>Deposit Type</InputLabel>
              <Select
                value={ddForm.depositType}
                label="Deposit Type"
                onChange={(e) => handleDdFormChange("depositType", e.target.value)}
                data-testid="select-dd-deposit-type"
              >
                <MenuItem value="Fixed Amount">Fixed Amount</MenuItem>
                <MenuItem value="Percentage">Percentage</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label={ddForm.depositType === "Percentage" ? "Percentage (%)" : "Amount ($)"}
              value={ddForm.amount}
              onChange={(e) => handleDdFormChange("amount", e.target.value)}
              error={!!ddFormErrors.amount}
              helperText={ddFormErrors.amount}
              fullWidth
              size="small"
              data-testid="input-dd-amount"
            />
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={ddForm.status}
                label="Status"
                onChange={(e) => handleDdFormChange("status", e.target.value)}
                data-testid="select-dd-status"
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Deleted">Deleted</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDdModalOpen(false)} disabled={ddSaving} data-testid="button-dd-cancel">
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleDdSave}
            disabled={ddSaving}
            startIcon={ddSaving ? <CircularProgress size={16} /> : undefined}
            data-testid="button-dd-save"
          >
            {ddSaving ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={ddDeleteConfirmOpen}
        onClose={() => { if (!ddDeleting) { setDdDeleteConfirmOpen(false); setDdDeleteTarget(null); } }}
        maxWidth="xs"
        fullWidth
        data-testid="dialog-delete-deposit"
      >
        <DialogTitle data-testid="text-delete-deposit-title">Delete Direct Deposit</DialogTitle>
        <DialogContent>
          <Typography variant="body1" data-testid="text-delete-deposit-message">
            Delete direct deposit account ending in {ddDeleteTarget?.accountNumber.slice(-4)}?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => { setDdDeleteConfirmOpen(false); setDdDeleteTarget(null); }}
            disabled={ddDeleting}
            data-testid="button-delete-deposit-cancel"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDdDelete}
            disabled={ddDeleting}
            startIcon={ddDeleting ? <CircularProgress size={16} /> : undefined}
            data-testid="button-delete-deposit-confirm"
          >
            {ddDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ open: false, message: "" })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        data-testid="snackbar-notification"
      >
        <Alert onClose={() => setSnackbar({ open: false, message: "" })} severity="success" variant="filled" sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Dialog
        open={resetPinOpen}
        onClose={() => { if (resetPinState !== "processing") { setResetPinOpen(false); setResetPinState("confirm"); } }}
        maxWidth="xs"
        fullWidth
        data-testid="dialog-reset-pin"
      >
        <DialogTitle data-testid="text-reset-pin-title">Reset Card PIN</DialogTitle>
        <DialogContent>
          {resetPinState === "confirm" && (
            <Stack spacing={2}>
              <Typography variant="body1" data-testid="text-reset-pin-message">
                Reset PIN for card ending in {cardData.cardNumber.slice(-4)}?
              </Typography>
              <Alert severity="info" data-testid="text-reset-pin-info">
                The cardholder will receive a new PIN via their registered phone number.
              </Alert>
            </Stack>
          )}
          {resetPinState === "processing" && (
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 3 }} data-testid="reset-pin-processing">
              <CircularProgress size={40} sx={{ mb: 2 }} />
              <Typography variant="body1">Resetting PIN...</Typography>
            </Box>
          )}
          {resetPinState === "success" && (
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 3 }} data-testid="reset-pin-success">
              <CheckCircleOutlineIcon sx={{ fontSize: 48, color: "#047857", mb: 1 }} />
              <Typography variant="body1" sx={{ fontWeight: 500 }}>PIN reset successfully</Typography>
              <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>This dialog will close automatically.</Typography>
            </Box>
          )}
          {resetPinState === "error" && (
            <Stack spacing={2} data-testid="reset-pin-error">
              <Alert severity="error">
                Failed to reset PIN. Please try again or contact support.
              </Alert>
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          {resetPinState === "confirm" && (
            <>
              <Button onClick={() => { setResetPinOpen(false); setResetPinState("confirm"); }} data-testid="button-reset-pin-cancel">
                Cancel
              </Button>
              <Button variant="contained" onClick={handleResetPin} data-testid="button-reset-pin-confirm">
                Reset PIN
              </Button>
            </>
          )}
          {resetPinState === "error" && (
            <>
              <Button onClick={() => { setResetPinOpen(false); setResetPinState("confirm"); }} data-testid="button-reset-pin-close">
                Cancel
              </Button>
              <Button variant="contained" onClick={handleResetPin} data-testid="button-reset-pin-retry">
                Retry
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}
