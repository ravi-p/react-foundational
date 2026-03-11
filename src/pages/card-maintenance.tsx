import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Chip from "@mui/material/Chip";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Collapse from "@mui/material/Collapse";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import Menu from "@mui/material/Menu";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { StatusBadge } from "@/components/common/status-badge";
import { InteractiveTour, TourStep } from "@/components/common/interactive-tour";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import RefreshIcon from "@mui/icons-material/Refresh";
import FilterListIcon from "@mui/icons-material/FilterList";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import PersonIcon from "@mui/icons-material/Person";
import SpeedIcon from "@mui/icons-material/Speed";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import HistoryIcon from "@mui/icons-material/History";
import LayersIcon from "@mui/icons-material/Layers";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CloseIcon from "@mui/icons-material/Close";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const tourSteps: TourStep[] = [
  {
    targetSelector: '[data-testid="card-search-section"]',
    title: "Search & Filters",
    description: "Enter a card number, name, or ID to search. Use the filter icon to expand Account, Customer, Status, and Sort filters.",
    placement: "bottom",
  },
  {
    targetSelector: '[data-testid="button-search"]',
    title: "Search Cards",
    description: "Click Search or press Enter to find cards. The button activates after you type at least 2 characters.",
    placement: "bottom",
  },
];

const mockAccounts = [
  { id: "MC180", name: "NARX_TEST" },
  { id: "MC181", name: "FLEET_CORP" },
  { id: "MC182", name: "TRANSPORT_INC" },
  { id: "MC183", name: "LOGISTICS_LLC" },
  { id: "MC184", name: "CARGO_SERVICES" },
];

const mockCustomersByAccount: Record<string, { id: string; name: string }[]> = {
  MC180: [
    { id: "BBB81", name: "Customer BBB81" },
    { id: "BBB82", name: "Customer BBB82" },
  ],
  MC181: [
    { id: "BBB83", name: "Customer BBB83" },
    { id: "BBB84", name: "Customer BBB84" },
  ],
  MC182: [{ id: "BBB85", name: "Customer BBB85" }],
  MC183: [{ id: "BBB86", name: "Customer BBB86" }],
  MC184: [{ id: "BBB87", name: "Customer BBB87" }],
};

const statusOptions = [
  { value: "", label: "All Statuses" },
  { value: "A", label: "Active (A)" },
  { value: "B", label: "Blocked (B)" },
  { value: "X", label: "Expired (X)" },
  { value: "F", label: "Fraudulent (F)" },
  { value: "L", label: "Lost (L)" },
  { value: "S", label: "Suspended (S)" },
  { value: "D", label: "Deleted (D)" },
];

const sortOptions = [
  { value: "first_name", label: "First Name" },
  { value: "last_name", label: "Last Name" },
  { value: "card_number", label: "Card Number" },
  { value: "employee_number", label: "Employee Number" },
  { value: "unit_number", label: "Unit Number" },
  { value: "status", label: "Status" },
];

const mockCards = [
  { id: "1", cardNumber: "1234 56XX XXXX 0019", firstName: "TEST", lastName: "NARX", cardholderName: "TEST NARX", accountId: "MC180", customerId: "BBB81", status: "Active", statusCode: "A", profileType: "Driver Profile (001)", lastActivity: "Feb 24, 2026 14:32", employeeNumber: "1001", unitNumber: "U-501" },
  { id: "2", cardNumber: "1234 56XX XXXX 0027", firstName: "JOHN", lastName: "SMITH", cardholderName: "JOHN SMITH", accountId: "MC180", customerId: "BBB81", status: "Active", statusCode: "A", profileType: "Driver Profile (001)", lastActivity: "Feb 23, 2026 09:15", employeeNumber: "1002", unitNumber: "U-502" },
  { id: "3", cardNumber: "1234 56XX XXXX 0035", firstName: "JANE", lastName: "DOE", cardholderName: "JANE DOE", accountId: "MC180", customerId: "BBB82", status: "Inactive", statusCode: "B", profileType: "Vehicle Profile (002)", lastActivity: "Feb 20, 2026 16:45", employeeNumber: "1003", unitNumber: "U-503" },
  { id: "4", cardNumber: "1234 56XX XXXX 0043", firstName: "MIKE", lastName: "WILSON", cardholderName: "MIKE WILSON", accountId: "MC181", customerId: "BBB83", status: "Active", statusCode: "A", profileType: "Driver Profile (001)", lastActivity: "Feb 22, 2026 11:20", employeeNumber: "1004", unitNumber: "U-504" },
  { id: "5", cardNumber: "1234 56XX XXXX 0050", firstName: "SARAH", lastName: "BROWN", cardholderName: "SARAH BROWN", accountId: "MC181", customerId: "BBB83", status: "Locked", statusCode: "S", profileType: "Driver Profile (001)", lastActivity: "Feb 19, 2026 08:30", employeeNumber: "1005", unitNumber: "U-505" },
];

const bulkActions = [
  { icon: SwapHorizIcon, title: "Move Card(s)", description: "Transfer cards between accounts or customer IDs" },
  { icon: VerifiedUserIcon, title: "Change Card Status", description: "Activate, deactivate, or suspend multiple cards" },
  { icon: ManageAccountsIcon, title: "Change Profile", description: "Update driver or vehicle profile assignments" },
  { icon: LocalGasStationIcon, title: "Change Fuel Limit", description: "Adjust daily or per-transaction fuel spending limits" },
  { icon: AccountBalanceWalletIcon, title: "Change Cash On Card Limit", description: "Set or modify cash withdrawal limits on cards" },
];

const cardDetailItems = [
  { icon: PersonIcon, title: "Cardholder / Vehicle Information", description: "View and edit driver details, vehicle assignments, and shipping info" },
  { icon: SpeedIcon, title: "Products / Limits", description: "Manage transaction limits, product controls, and spending caps" },
  { icon: AccountBalanceIcon, title: "eCash / Cash Wallet Information", description: "Check eCash balances, wallet status, and cash activity" },
  { icon: HistoryIcon, title: "Transaction History", description: "Browse recent transactions, filter by date, and export reports" },
  { icon: LayersIcon, title: "Network Restrictions", description: "View allowed merchant categories and network access rules" },
];

export default function CardMaintenance() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTouched, setSearchTouched] = useState(false);
  const [showMasked, setShowMasked] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  const [tourActive, setTourActive] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<{ id: string; name: string } | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<{ id: string; name: string } | null>(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("first_name");
  const [isLoading, setIsLoading] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [orderBy, setOrderBy] = useState<string>("cardholderName");
  const [orderDirection, setOrderDirection] = useState<"asc" | "desc">("asc");
  const [bulkMenuAnchor, setBulkMenuAnchor] = useState<null | HTMLElement>(null);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [bulkStatus, setBulkStatus] = useState("");
  const [bulkProfile, setBulkProfile] = useState("");
  const [bulkCashLimit, setBulkCashLimit] = useState("");
  const [bulkFuelLimit, setBulkFuelLimit] = useState("");
  const [moveAccount, setMoveAccount] = useState<{ id: string; name: string } | null>(null);
  const [moveCustomer, setMoveCustomer] = useState<{ id: string; name: string } | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string }>({ open: false, message: "" });

  const profileOptions = [
    { value: "Executive", label: "Executive" },
    { value: "Standard", label: "Standard" },
    { value: "Budget", label: "Budget" },
    { value: "Premium", label: "Premium" },
  ];

  const moveAvailableCustomers = moveAccount
    ? mockCustomersByAccount[moveAccount.id] || []
    : [];

  const isSearchValid = searchQuery.length >= 2;
  const showSearchError = searchTouched && searchQuery.length > 0 && searchQuery.length < 2;

  const availableCustomers = selectedAccount
    ? mockCustomersByAccount[selectedAccount.id] || []
    : [];

  const handleAccountChange = useCallback((_: unknown, value: { id: string; name: string } | null) => {
    setSelectedAccount(value);
    setSelectedCustomer(null);
  }, []);

  const handleSearch = useCallback(() => {
    if (!isSearchValid) return;
    setIsLoading(true);
    setShowOverlay(false);

    const overlayTimer = setTimeout(() => {
      setShowOverlay(true);
    }, 750);

    setTimeout(() => {
      clearTimeout(overlayTimer);
      setIsLoading(false);
      setShowOverlay(false);
      setShowResults(true);
    }, 1200);
  }, [isSearchValid]);

  const handleStartTour = () => {
    setShowBanner(false);
    setTourActive(true);
  };

  const filteredCards = showResults
    ? mockCards.filter((card) => {
        const q = searchQuery.toLowerCase();
        const matchesSearch =
          !q ||
          card.cardNumber.toLowerCase().includes(q) ||
          card.cardholderName.toLowerCase().includes(q) ||
          card.accountId.toLowerCase().includes(q) ||
          card.customerId.toLowerCase().includes(q);

        const matchesAccount = !selectedAccount || card.accountId === selectedAccount.id;
        const matchesCustomer = !selectedCustomer || card.customerId === selectedCustomer.id;
        const matchesStatus = !statusFilter || card.statusCode === statusFilter;

        return matchesSearch && matchesAccount && matchesCustomer && matchesStatus;
      })
    : [];

  const handleSortRequest = useCallback((column: string) => {
    setOrderDirection((prev) => (orderBy === column ? (prev === "asc" ? "desc" : "asc") : "asc"));
    setOrderBy(column);
  }, [orderBy]);

  const handleSelectAll = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedCards(filteredCards.map((card) => card.id));
    } else {
      setSelectedCards([]);
    }
  }, [filteredCards]);

  const handleSelectCard = useCallback((cardId: string) => {
    setSelectedCards((prev) =>
      prev.includes(cardId) ? prev.filter((id) => id !== cardId) : [...prev, cardId]
    );
  }, []);

  const handleOpenBulkMenu = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setBulkMenuAnchor(event.currentTarget);
  }, []);

  const handleCloseBulkMenu = useCallback(() => {
    setBulkMenuAnchor(null);
  }, []);

  const handleOpenModal = useCallback((modalType: string) => {
    setBulkMenuAnchor(null);
    setBulkStatus("");
    setBulkProfile("");
    setBulkCashLimit("");
    setBulkFuelLimit("");
    setMoveAccount(null);
    setMoveCustomer(null);
    setActiveModal(modalType);
  }, []);

  const handleCloseModal = useCallback(() => {
    setActiveModal(null);
    setModalLoading(false);
  }, []);

  const handleApplyBulkAction = useCallback((successMessage: string) => {
    setModalLoading(true);
    setTimeout(() => {
      setModalLoading(false);
      setActiveModal(null);
      setSelectedCards([]);
      setSnackbar({ open: true, message: successMessage });
    }, 1500);
  }, []);

  const handleSelectAllResults = useCallback(() => {
    setSelectedCards(filteredCards.map((card) => card.id));
  }, [filteredCards]);

  const handleClearSelection = useCallback(() => {
    setSelectedCards([]);
  }, []);

  const isValidCurrency = (val: string) => /^\d+(\.\d{0,2})?$/.test(val) && parseFloat(val) > 0;

  const sortedCards = [...filteredCards].sort((a, b) => {
    const dir = orderDirection === "asc" ? 1 : -1;
    switch (orderBy) {
      case "cardholderName":
        return dir * a.cardholderName.localeCompare(b.cardholderName);
      case "accountId":
        return dir * a.accountId.localeCompare(b.accountId);
      case "status":
        return dir * a.status.localeCompare(b.status);
      case "employeeNumber":
        return dir * a.employeeNumber.localeCompare(b.employeeNumber);
      case "unitNumber":
        return dir * a.unitNumber.localeCompare(b.unitNumber);
      default:
        return 0;
    }
  });

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Breadcrumbs items={[{ label: "Manage", path: "/manage" }, { label: "Card Maintenance" }]} />
      <Box sx={{ flex: 1, overflow: "auto" }}>
        <Box sx={{ maxWidth: 1200, mx: "auto", px: 3, py: 3 }}>
          <Stack spacing={3}>
            <Typography variant="h1" data-testid="text-page-title">
              Card Maintenance
            </Typography>

            {showBanner && (
              <Card
                sx={{
                  position: "relative",
                  overflow: "hidden",
                  backgroundImage: "linear-gradient(135deg, rgba(37,99,235,0.08) 0%, rgba(96,165,250,0.12) 50%, rgba(29,78,216,0.06) 100%)",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
                data-testid="card-banner"
              >
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(135deg, rgba(239,246,255,0.92) 0%, rgba(219,234,254,0.88) 40%, rgba(191,219,254,0.85) 100%)",
                  }}
                />
                <IconButton
                  onClick={() => setShowBanner(false)}
                  sx={{ position: "absolute", top: 8, right: 8, zIndex: 1, color: "text.secondary" }}
                  size="small"
                  aria-label="Close banner"
                  data-testid="button-banner-close"
                >
                  <CloseIcon sx={{ fontSize: 20 }} />
                </IconButton>
                <CardContent sx={{ position: "relative", p: 3, "&:last-child": { pb: 3 } }}>
                  <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 3 }}>
                    <Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                        <AutoAwesomeIcon sx={{ fontSize: 28, color: "#2563EB" }} />
                        <Typography sx={{ fontSize: "1.25rem", fontWeight: 700, color: "text.primary" }} data-testid="text-banner-title">
                          Introducing New Search
                        </Typography>
                      </Box>
                      <Typography sx={{ fontSize: "0.875rem", color: "text.secondary", mb: 1.5 }} data-testid="text-banner-description">
                        Search, Sort, Filter and update multiple card faster.
                      </Typography>
                      <Box component="ul" sx={{ m: 0, pl: 2.5, "& li": { fontSize: "0.875rem", color: "text.primary", mb: 0.5 } }}>
                        <li>Search Instantly</li>
                        <li>Update Multiple Cards</li>
                        <li>Change limits and Status</li>
                      </Box>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexShrink: 0, pt: 3 }}>
                      <Button
                        variant="outlined"
                        onClick={handleStartTour}
                        sx={{ borderColor: "text.primary", color: "text.primary", fontWeight: 600, "&:hover": { borderColor: "primary.main", color: "primary.main" } }}
                        data-testid="button-take-tour"
                      >
                        Take a Tour
                      </Button>
                      <Button
                        variant="text"
                        onClick={() => setShowBanner(false)}
                        sx={{ color: "text.primary", fontWeight: 600 }}
                        data-testid="button-dismiss-banner"
                      >
                        Dismiss
                      </Button>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            )}

            <Card data-testid="card-search-section">
              <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                <Stack spacing={1.5}>
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} alignItems="flex-start">
                    <TextField
                      size="small"
                      placeholder="Enter card number, name, or ID"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        if (!searchTouched) setSearchTouched(true);
                      }}
                      onKeyDown={(e) => e.key === "Enter" && isSearchValid && handleSearch()}
                      error={showSearchError}
                      helperText={showSearchError ? "Search criteria must be at least 2 characters" : ""}
                      sx={{ flex: 1 }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon sx={{ fontSize: 18, color: "text.secondary" }} />
                          </InputAdornment>
                        ),
                      }}
                      data-testid="input-search"
                    />
                    <IconButton
                      onClick={() => setShowMasked(!showMasked)}
                      size="small"
                      sx={{ mt: { xs: 0, sm: 0.5 } }}
                      aria-label={showMasked ? "Show card numbers" : "Mask card numbers"}
                      data-testid="button-toggle-mask"
                    >
                      {showMasked ? <VisibilityOffIcon sx={{ fontSize: 20 }} /> : <VisibilityIcon sx={{ fontSize: 20 }} />}
                    </IconButton>
                    <IconButton
                      onClick={() => setFiltersOpen(!filtersOpen)}
                      size="small"
                      sx={{
                        mt: { xs: 0, sm: 0.5 },
                        color: filtersOpen ? "primary.main" : "text.secondary",
                        bgcolor: filtersOpen ? "rgba(37,99,235,0.08)" : "transparent",
                        "&:hover": { bgcolor: filtersOpen ? "rgba(37,99,235,0.12)" : "action.hover" },
                      }}
                      aria-label={filtersOpen ? "Hide filters" : "Show filters"}
                      data-testid="button-filter-toggle"
                    >
                      <FilterListIcon sx={{ fontSize: 20 }} />
                    </IconButton>
                    <Button
                      variant="contained"
                      onClick={handleSearch}
                      disabled={!isSearchValid || isLoading}
                      startIcon={isLoading ? <CircularProgress size={16} color="inherit" /> : <SearchIcon />}
                      sx={{ minWidth: 100 }}
                      data-testid="button-search"
                    >
                      {isLoading ? "Searching..." : "Search"}
                    </Button>
                  </Stack>

                  <Collapse in={filtersOpen} timeout={300}>
                    <Box sx={{ pt: 1 }}>
                      <Grid container spacing={1.5}>
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                          <Autocomplete
                            size="small"
                            options={mockAccounts}
                            getOptionLabel={(option) => `${option.name} (${option.id})`}
                            value={selectedAccount}
                            onChange={handleAccountChange}
                            filterOptions={(options, { inputValue }) => {
                              if (inputValue.length < 2) return [];
                              return options.filter((o) =>
                                `${o.name} ${o.id}`.toLowerCase().includes(inputValue.toLowerCase())
                              );
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Account"
                                placeholder="All Accounts"
                                data-testid="input-account-filter"
                              />
                            )}
                            noOptionsText="Type 2+ characters to search"
                            data-testid="autocomplete-account"
                          />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                          <Autocomplete
                            size="small"
                            options={availableCustomers}
                            getOptionLabel={(option) => `${option.name} (${option.id})`}
                            value={selectedCustomer}
                            onChange={(_, value) => setSelectedCustomer(value)}
                            disabled={!selectedAccount}
                            filterOptions={(options, { inputValue }) => {
                              if (inputValue.length < 2) return [];
                              return options.filter((o) =>
                                `${o.name} ${o.id}`.toLowerCase().includes(inputValue.toLowerCase())
                              );
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Customer"
                                placeholder={selectedAccount ? "All Customers" : "Select account first"}
                                data-testid="input-customer-filter"
                              />
                            )}
                            noOptionsText={selectedAccount ? "Type 2+ characters to search" : "Select an account first"}
                            data-testid="autocomplete-customer"
                          />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                          <FormControl size="small" fullWidth>
                            <InputLabel>Card Status</InputLabel>
                            <Select
                              value={statusFilter}
                              onChange={(e) => setStatusFilter(e.target.value)}
                              label="Card Status"
                              data-testid="select-status-filter"
                            >
                              {statusOptions.map((opt) => (
                                <MenuItem key={opt.value} value={opt.value} data-testid={`option-status-${opt.value || "all"}`}>
                                  {opt.label}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                          <FormControl size="small" fullWidth>
                            <InputLabel>Sort By</InputLabel>
                            <Select
                              value={sortBy}
                              onChange={(e) => setSortBy(e.target.value)}
                              label="Sort By"
                              data-testid="select-sort-by"
                            >
                              {sortOptions.map((opt) => (
                                <MenuItem key={opt.value} value={opt.value} data-testid={`option-sort-${opt.value}`}>
                                  {opt.label}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                      </Grid>
                    </Box>
                  </Collapse>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <InfoOutlinedIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                    <Typography variant="body2" data-testid="text-search-hint">
                      Enter card number, name, or ID. Minimum 2 characters required.
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            {isLoading && showOverlay && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  py: 6,
                }}
                data-testid="loading-overlay"
              >
                <CircularProgress size={40} sx={{ mb: 2 }} />
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Searching cards...
                </Typography>
              </Box>
            )}

            {showResults && !isLoading && (
              <Card>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 2.5, pt: 2.5, pb: 1.5 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="h2" data-testid="text-results-title">
                      Search Results
                    </Typography>
                    <Chip
                      label={`${sortedCards.length} cards found`}
                      size="small"
                      color="default"
                      data-testid="badge-result-count"
                    />
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <IconButton
                      size="small"
                      onClick={handleOpenBulkMenu}
                      disabled={selectedCards.length === 0}
                      aria-label="Bulk actions"
                      data-testid="button-bulk-actions"
                    >
                      <MoreVertIcon sx={{ fontSize: 20 }} />
                    </IconButton>
                    <Menu
                      anchorEl={bulkMenuAnchor}
                      open={Boolean(bulkMenuAnchor)}
                      onClose={handleCloseBulkMenu}
                      data-testid="menu-bulk-actions"
                    >
                      <MenuItem onClick={() => handleOpenModal("status")} data-testid="menu-item-change-status">
                        <VerifiedUserIcon sx={{ fontSize: 18, mr: 1.5, color: "text.secondary" }} />
                        Change Status
                      </MenuItem>
                      <MenuItem onClick={() => handleOpenModal("profile")} data-testid="menu-item-change-profile">
                        <ManageAccountsIcon sx={{ fontSize: 18, mr: 1.5, color: "text.secondary" }} />
                        Change Profile
                      </MenuItem>
                      <MenuItem onClick={() => handleOpenModal("cashLimit")} data-testid="menu-item-change-cash-limit">
                        <AccountBalanceWalletIcon sx={{ fontSize: 18, mr: 1.5, color: "text.secondary" }} />
                        Change Cash Limit
                      </MenuItem>
                      <MenuItem onClick={() => handleOpenModal("fuelLimit")} data-testid="menu-item-change-fuel-limit">
                        <LocalGasStationIcon sx={{ fontSize: 18, mr: 1.5, color: "text.secondary" }} />
                        Change Fuel Limit
                      </MenuItem>
                      <MenuItem onClick={() => handleOpenModal("moveCards")} data-testid="menu-item-move-cards">
                        <SwapHorizIcon sx={{ fontSize: 18, mr: 1.5, color: "text.secondary" }} />
                        Move Cards
                      </MenuItem>
                    </Menu>
                    <IconButton
                      size="small"
                      onClick={handleSearch}
                      aria-label="Refresh results"
                      data-testid="button-refresh-results"
                    >
                      <RefreshIcon sx={{ fontSize: 20 }} />
                    </IconButton>
                  </Box>
                </Box>

                {selectedCards.length > 0 && (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      px: 2.5,
                      py: 1.5,
                      bgcolor: "action.hover",
                      borderTop: "1px solid",
                      borderBottom: "1px solid",
                      borderColor: "divider",
                    }}
                    data-testid="selection-toolbar"
                  >
                    <Typography variant="body2" sx={{ fontWeight: 600 }} data-testid="text-selected-count">
                      {selectedCards.length} card{selectedCards.length !== 1 ? "s" : ""} selected
                    </Typography>
                    <Button
                      size="small"
                      variant="text"
                      onClick={handleSelectAllResults}
                      data-testid="button-select-all-results"
                    >
                      Select All
                    </Button>
                    <Button
                      size="small"
                      variant="text"
                      onClick={handleClearSelection}
                      data-testid="button-clear-selection"
                    >
                      Clear All
                    </Button>
                  </Box>
                )}

                {sortedCards.length === 0 ? (
                  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 6, px: 3 }} data-testid="empty-results">
                    <SearchOffIcon sx={{ fontSize: 48, color: "text.secondary", mb: 1.5 }} />
                    <Typography variant="h2" sx={{ mb: 0.5 }}>
                      No cards found
                    </Typography>
                    <Typography variant="body2" sx={{ textAlign: "center", maxWidth: 360 }}>
                      Try adjusting your search criteria or filters to find the cards you're looking for.
                    </Typography>
                  </Box>
                ) : (
                  <TableContainer>
                    <Table stickyHeader>
                      <TableHead>
                        <TableRow>
                          <TableCell padding="checkbox" sx={{ bgcolor: "background.paper" }}>
                            <Checkbox
                              indeterminate={selectedCards.length > 0 && selectedCards.length < sortedCards.length}
                              checked={sortedCards.length > 0 && selectedCards.length === sortedCards.length}
                              onChange={handleSelectAll}
                              inputProps={{ "aria-label": "Select all cards" }}
                              data-testid="checkbox-select-all"
                            />
                          </TableCell>
                          <TableCell sx={{ bgcolor: "background.paper" }}>
                            <TableSortLabel
                              active={orderBy === "cardholderName"}
                              direction={orderBy === "cardholderName" ? orderDirection : "asc"}
                              onClick={() => handleSortRequest("cardholderName")}
                              data-testid="sort-cardholder-name"
                            >
                              Card Holder Name
                            </TableSortLabel>
                          </TableCell>
                          <TableCell sx={{ bgcolor: "background.paper" }}>
                            <TableSortLabel
                              active={orderBy === "accountId"}
                              direction={orderBy === "accountId" ? orderDirection : "asc"}
                              onClick={() => handleSortRequest("accountId")}
                              data-testid="sort-account-code"
                            >
                              Account Code
                            </TableSortLabel>
                          </TableCell>
                          <TableCell sx={{ bgcolor: "background.paper" }}>
                            <TableSortLabel
                              active={orderBy === "status"}
                              direction={orderBy === "status" ? orderDirection : "asc"}
                              onClick={() => handleSortRequest("status")}
                              data-testid="sort-card-status"
                            >
                              Card Status
                            </TableSortLabel>
                          </TableCell>
                          <TableCell sx={{ bgcolor: "background.paper" }}>
                            <TableSortLabel
                              active={orderBy === "employeeNumber"}
                              direction={orderBy === "employeeNumber" ? orderDirection : "asc"}
                              onClick={() => handleSortRequest("employeeNumber")}
                              data-testid="sort-employee-id"
                            >
                              Employee ID
                            </TableSortLabel>
                          </TableCell>
                          <TableCell sx={{ bgcolor: "background.paper" }}>
                            <TableSortLabel
                              active={orderBy === "unitNumber"}
                              direction={orderBy === "unitNumber" ? orderDirection : "asc"}
                              onClick={() => handleSortRequest("unitNumber")}
                              data-testid="sort-unit-number"
                            >
                              Unit Number
                            </TableSortLabel>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {sortedCards.map((card) => {
                          const isSelected = selectedCards.includes(card.id);
                          return (
                            <TableRow
                              key={card.id}
                              hover
                              selected={isSelected}
                              sx={{ cursor: "pointer" }}
                              onClick={() => navigate(`/manage/card-maintenance/${card.id}`)}
                              data-testid={`row-card-${card.id}`}
                            >
                              <TableCell padding="checkbox">
                                <Checkbox
                                  checked={isSelected}
                                  onClick={(e) => e.stopPropagation()}
                                  onChange={() => handleSelectCard(card.id)}
                                  inputProps={{ "aria-label": `Select ${card.cardholderName}` }}
                                  data-testid={`checkbox-card-${card.id}`}
                                />
                              </TableCell>
                              <TableCell sx={{ fontWeight: 500 }} data-testid={`text-card-holder-${card.id}`}>
                                {card.cardholderName}
                              </TableCell>
                              <TableCell data-testid={`text-account-code-${card.id}`}>{card.accountId}</TableCell>
                              <TableCell>
                                <StatusBadge
                                  status={card.status}
                                  variant={card.status === "Active" ? "active" : card.status === "Locked" ? "locked" : "inactive"}
                                />
                              </TableCell>
                              <TableCell data-testid={`text-employee-id-${card.id}`}>{card.employeeNumber}</TableCell>
                              <TableCell data-testid={`text-unit-number-${card.id}`}>{card.unitNumber}</TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Card>
            )}

            {!showResults && !isLoading && (
              <>
                <Box>
                  <Typography variant="h2" sx={{ mb: 1.5 }} data-testid="text-multi-card-title">
                    Bulk Actions
                  </Typography>
                  <Grid container spacing={1.5}>
                    {bulkActions.map((action) => {
                      const Icon = action.icon;
                      return (
                        <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={action.title}>
                          <Card sx={{ cursor: "pointer", transition: "box-shadow 0.15s", "&:hover": { boxShadow: 3 } }}>
                            <CardContent sx={{ p: 2, "&:last-child": { pb: 2 }, display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                              <Box sx={{ width: 36, height: 36, borderRadius: 1, bgcolor: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                <Icon sx={{ fontSize: 18, color: "#2563EB" }} />
                              </Box>
                              <Box sx={{ minWidth: 0 }}>
                                <Typography variant="body1" sx={{ fontWeight: 500, lineHeight: 1.3 }} data-testid={`text-bulk-action-${action.title.toLowerCase().replace(/\s+/g, "-")}`}>
                                  {action.title}
                                </Typography>
                                <Typography variant="body2" sx={{ mt: 0.5, lineHeight: 1.4 }}>
                                  {action.description}
                                </Typography>
                              </Box>
                            </CardContent>
                          </Card>
                        </Grid>
                      );
                    })}
                  </Grid>
                </Box>

                <Box>
                  <Typography variant="h2" sx={{ mb: 1.5 }} data-testid="text-card-detail-title">
                    Card Detail
                  </Typography>
                  <Grid container spacing={1.5}>
                    {cardDetailItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={item.title}>
                          <Card sx={{ cursor: "pointer", transition: "box-shadow 0.15s", "&:hover": { boxShadow: 3 } }}>
                            <CardContent sx={{ p: 2, "&:last-child": { pb: 2 }, display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                              <Box sx={{ width: 36, height: 36, borderRadius: 1, bgcolor: "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                <Icon sx={{ fontSize: 18, color: "#64748B" }} />
                              </Box>
                              <Box sx={{ minWidth: 0 }}>
                                <Typography variant="body1" sx={{ fontWeight: 500, lineHeight: 1.3 }} data-testid={`text-detail-item-${item.title.toLowerCase().replace(/[\s\/]+/g, "-")}`}>
                                  {item.title}
                                </Typography>
                                <Typography variant="body2" sx={{ mt: 0.5, lineHeight: 1.4 }}>
                                  {item.description}
                                </Typography>
                              </Box>
                            </CardContent>
                          </Card>
                        </Grid>
                      );
                    })}
                  </Grid>
                </Box>
              </>
            )}
          </Stack>
        </Box>
      </Box>
      <InteractiveTour steps={tourSteps} isActive={tourActive} onEnd={() => setTourActive(false)} />

      <Dialog
        open={activeModal === "status"}
        onClose={handleCloseModal}
        maxWidth="xs"
        fullWidth
        data-testid="dialog-change-status"
      >
        <DialogTitle>Change Card Status</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Update status for {selectedCards.length} selected card{selectedCards.length !== 1 ? "s" : ""}.
          </Typography>
          <FormControl fullWidth size="small">
            <InputLabel>New Status</InputLabel>
            <Select
              value={bulkStatus}
              onChange={(e) => setBulkStatus(e.target.value)}
              label="New Status"
              disabled={modalLoading}
              data-testid="select-bulk-status"
            >
              {statusOptions.filter((o) => o.value !== "").map((opt) => (
                <MenuItem key={opt.value} value={opt.value} data-testid={`option-bulk-status-${opt.value}`}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} disabled={modalLoading} data-testid="button-cancel-status">
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => handleApplyBulkAction(`Status updated to "${bulkStatus}" for ${selectedCards.length} card(s)`)}
            disabled={!bulkStatus || modalLoading}
            startIcon={modalLoading ? <CircularProgress size={16} color="inherit" /> : undefined}
            data-testid="button-apply-status"
          >
            {modalLoading ? "Applying..." : "Apply"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={activeModal === "profile"}
        onClose={handleCloseModal}
        maxWidth="xs"
        fullWidth
        data-testid="dialog-change-profile"
      >
        <DialogTitle>Change Profile</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Update profile for {selectedCards.length} selected card{selectedCards.length !== 1 ? "s" : ""}.
          </Typography>
          <FormControl fullWidth size="small">
            <InputLabel>New Profile</InputLabel>
            <Select
              value={bulkProfile}
              onChange={(e) => setBulkProfile(e.target.value)}
              label="New Profile"
              disabled={modalLoading}
              data-testid="select-bulk-profile"
            >
              {profileOptions.map((opt) => (
                <MenuItem key={opt.value} value={opt.value} data-testid={`option-bulk-profile-${opt.value.toLowerCase()}`}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} disabled={modalLoading} data-testid="button-cancel-profile">
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => handleApplyBulkAction(`Profile updated to "${bulkProfile}" for ${selectedCards.length} card(s)`)}
            disabled={!bulkProfile || modalLoading}
            startIcon={modalLoading ? <CircularProgress size={16} color="inherit" /> : undefined}
            data-testid="button-apply-profile"
          >
            {modalLoading ? "Applying..." : "Apply"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={activeModal === "cashLimit"}
        onClose={handleCloseModal}
        maxWidth="xs"
        fullWidth
        data-testid="dialog-change-cash-limit"
      >
        <DialogTitle>Change Cash Limit</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Set new cash limit for {selectedCards.length} selected card{selectedCards.length !== 1 ? "s" : ""}.
          </Typography>
          <TextField
            fullWidth
            size="small"
            label="Cash Limit"
            value={bulkCashLimit}
            onChange={(e) => {
              const val = e.target.value;
              if (val === "" || /^\d*\.?\d{0,2}$/.test(val)) setBulkCashLimit(val);
            }}
            disabled={modalLoading}
            error={bulkCashLimit !== "" && !isValidCurrency(bulkCashLimit)}
            helperText={bulkCashLimit !== "" && !isValidCurrency(bulkCashLimit) ? "Enter a valid amount greater than 0" : ""}
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
            data-testid="input-bulk-cash-limit"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} disabled={modalLoading} data-testid="button-cancel-cash-limit">
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => handleApplyBulkAction(`Cash limit set to $${bulkCashLimit} for ${selectedCards.length} card(s)`)}
            disabled={!isValidCurrency(bulkCashLimit) || modalLoading}
            startIcon={modalLoading ? <CircularProgress size={16} color="inherit" /> : undefined}
            data-testid="button-apply-cash-limit"
          >
            {modalLoading ? "Applying..." : "Apply"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={activeModal === "fuelLimit"}
        onClose={handleCloseModal}
        maxWidth="xs"
        fullWidth
        data-testid="dialog-change-fuel-limit"
      >
        <DialogTitle>Change Fuel Limit</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Set new fuel limit for {selectedCards.length} selected card{selectedCards.length !== 1 ? "s" : ""}.
          </Typography>
          <TextField
            fullWidth
            size="small"
            label="Fuel Limit"
            value={bulkFuelLimit}
            onChange={(e) => {
              const val = e.target.value;
              if (val === "" || /^\d*\.?\d{0,2}$/.test(val)) setBulkFuelLimit(val);
            }}
            disabled={modalLoading}
            error={bulkFuelLimit !== "" && !isValidCurrency(bulkFuelLimit)}
            helperText={bulkFuelLimit !== "" && !isValidCurrency(bulkFuelLimit) ? "Enter a valid amount greater than 0" : ""}
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
            data-testid="input-bulk-fuel-limit"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} disabled={modalLoading} data-testid="button-cancel-fuel-limit">
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => handleApplyBulkAction(`Fuel limit set to $${bulkFuelLimit} for ${selectedCards.length} card(s)`)}
            disabled={!isValidCurrency(bulkFuelLimit) || modalLoading}
            startIcon={modalLoading ? <CircularProgress size={16} color="inherit" /> : undefined}
            data-testid="button-apply-fuel-limit"
          >
            {modalLoading ? "Applying..." : "Apply"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={activeModal === "moveCards"}
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
        data-testid="dialog-move-cards"
      >
        <DialogTitle>Move Cards</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Transfer {selectedCards.length} selected card{selectedCards.length !== 1 ? "s" : ""} to a different account.
          </Typography>
          <Stack spacing={2}>
            <Autocomplete
              size="small"
              options={mockAccounts}
              getOptionLabel={(option) => `${option.name} (${option.id})`}
              value={moveAccount}
              onChange={(_, value) => {
                setMoveAccount(value);
                setMoveCustomer(null);
              }}
              disabled={modalLoading}
              filterOptions={(options, { inputValue }) => {
                if (inputValue.length < 2) return [];
                return options.filter((o) =>
                  `${o.name} ${o.id}`.toLowerCase().includes(inputValue.toLowerCase())
                );
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Destination Account"
                  placeholder="Type 2+ characters to search"
                  data-testid="input-move-account"
                />
              )}
              noOptionsText="Type 2+ characters to search"
              data-testid="autocomplete-move-account"
            />
            <Autocomplete
              size="small"
              options={moveAvailableCustomers}
              getOptionLabel={(option) => `${option.name} (${option.id})`}
              value={moveCustomer}
              onChange={(_, value) => setMoveCustomer(value)}
              disabled={!moveAccount || modalLoading}
              filterOptions={(options, { inputValue }) => {
                if (inputValue.length < 2) return [];
                return options.filter((o) =>
                  `${o.name} ${o.id}`.toLowerCase().includes(inputValue.toLowerCase())
                );
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Destination Customer"
                  placeholder={moveAccount ? "Type 2+ characters to search" : "Select account first"}
                  data-testid="input-move-customer"
                />
              )}
              noOptionsText={moveAccount ? "Type 2+ characters to search" : "Select an account first"}
              data-testid="autocomplete-move-customer"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} disabled={modalLoading} data-testid="button-cancel-move">
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => handleApplyBulkAction(`${selectedCards.length} card(s) moved to ${moveAccount?.name} / ${moveCustomer?.name}`)}
            disabled={!moveAccount || !moveCustomer || modalLoading}
            startIcon={modalLoading ? <CircularProgress size={16} color="inherit" /> : undefined}
            data-testid="button-apply-move"
          >
            {modalLoading ? "Applying..." : "Apply"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ open: false, message: "" })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        data-testid="snackbar-bulk-success"
      >
        <Alert
          onClose={() => setSnackbar({ open: false, message: "" })}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
          data-testid="alert-bulk-success"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
