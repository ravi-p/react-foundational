import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import SettingsIcon from "@mui/icons-material/Settings";
import BarChartIcon from "@mui/icons-material/BarChart";
import SearchIcon from "@mui/icons-material/Search";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import SecurityIcon from "@mui/icons-material/Security";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import HeadsetMicIcon from "@mui/icons-material/HeadsetMic";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CreditCardIcon from "@mui/icons-material/CreditCard";

interface NavItem {
  label: string;
  icon: typeof SettingsIcon;
  hasDropdown: boolean;
  path?: string;
  items?: { title: string; path: string }[];
}

const navigationItems: NavItem[] = [
  {
    label: "Manage",
    icon: SettingsIcon,
    hasDropdown: true,
    items: [
      { title: "Virtual Card Setup Option", path: "/manage/virtual-card-setup" },
      { title: "One Click Admin", path: "/manage/one-click-admin" },
      { title: "New Card Order", path: "/manage/new-card-order" },
      { title: "Cards", path: "/manage/cards" },
      { title: "Account Management", path: "/manage/account-management" },
      { title: "Branded Debit", path: "/manage/branded-debit" },
      { title: "Customer Activity Dashboard", path: "/manage/customer-activity" },
      { title: "Card Maintenance", path: "/manage/card-maintenance" },
      { title: "Compliance Tools", path: "/manage/compliance-tools" },
      { title: "eCash / Cash Wallet / OnRoad", path: "/manage/ecash" },
      { title: "Express Check", path: "/manage/express-check" },
      { title: "Fleet Assets", path: "/manage/fleet-assets" },
      { title: "Fuel & Networks", path: "/manage/fuel-networks" },
      { title: "Alerts / Notifications Manager", path: "/manage/alerts" },
      { title: "CEMS SyncTool", path: "/manage/cems-synctool" },
      { title: "Vendor Portal", path: "/manage/vendor-portal" },
      { title: "GL Codes", path: "/manage/gl-codes" },
      { title: "SmartQ RFID", path: "/manage/smartq-rfid" },
      { title: "Transactions", path: "/manage/transactions" },
      { title: "Transfer Funds", path: "/manage/transfer-funds" },
      { title: "Tips", path: "/manage/tips" },
      { title: "Telematics / Proximity Connections", path: "/manage/telematics" },
      { title: "Electric Vehicle Support", path: "/manage/ev-support" },
    ],
  },
  {
    label: "Reporting",
    icon: BarChartIcon,
    hasDropdown: true,
    items: [
      { title: "Business Intelligence", path: "/reporting/bi" },
      { title: "Enhanced Merchant Reporting", path: "/reporting/merchant" },
      { title: "Exception Limits", path: "/reporting/exception-limits" },
      { title: "Exception Tracking", path: "/reporting/exception-tracking" },
      { title: "FleetDash Reports", path: "/reporting/fleetdash" },
      { title: "Low-Cost Fuel Index", path: "/reporting/fuel-index" },
      { title: "Report Scheduler", path: "/reporting/scheduler" },
      { title: "ReportQ", path: "/reporting/reportq" },
      { title: "Price File Audit", path: "/reporting/price-audit" },
      { title: "Comdata OneLook", path: "/reporting/onelook" },
      { title: "Electric Vehicle Dashboard", path: "/reporting/ev-dashboard" },
      { title: "Card Listing SFTP", path: "/reporting/card-listing" },
      { title: "eReceipt Viewer", path: "/reporting/ereceipt" },
    ],
  },
  {
    label: "Find",
    icon: SearchIcon,
    hasDropdown: true,
    items: [
      { title: "ATM Locator", path: "/find/atm" },
      { title: "GoComcheck", path: "/find/gocomcheck" },
      { title: "Merchant Locator", path: "/find/merchant" },
      { title: "Smart Buy", path: "/find/smart-buy" },
      { title: "Service Center Locator", path: "/find/service-center" },
      { title: "Mastercard Business Network", path: "/find/mastercard-network" },
    ],
  },
  {
    label: "Payment Center",
    icon: AttachMoneyIcon,
    hasDropdown: true,
    items: [
      { title: "Available Credit Info", path: "/payments/credit-info" },
      { title: "Global Credit Info", path: "/payments/global-credit" },
      { title: "My Invoices", path: "/payments/invoices" },
      { title: "Online Bill Pay", path: "/payments/bill-pay" },
      { title: "Pay On Account", path: "/payments/pay-on-account" },
      { title: "Request Invoiced Data File", path: "/payments/invoiced-data" },
      { title: "Fund My Account", path: "/payments/fund" },
    ],
  },
  {
    label: "Internal Admin",
    icon: SecurityIcon,
    hasDropdown: true,
    items: [
      { title: "Cardholder Web Internal Access", path: "/admin/cardholder-access" },
      { title: "Customized Fields Definitions", path: "/admin/custom-fields" },
      { title: "Cardholder Web Diagnostics", path: "/admin/diagnostics" },
      { title: "Emulate User", path: "/admin/emulate" },
      { title: "Funding File Inquiry", path: "/admin/funding-inquiry" },
      { title: "Inquire on Status of Submitted Request", path: "/admin/request-status" },
      { title: "Intranet Administration", path: "/admin/intranet" },
      { title: "Settlement / Manual Adjustments", path: "/admin/settlement" },
      { title: "Retrieve Incomplete Credit Request", path: "/admin/credit-request" },
      { title: "Submit Request to Credit", path: "/admin/submit-credit" },
      { title: "Search Changes By User ID", path: "/admin/search-changes" },
      { title: "User Registration", path: "/admin/user-registration" },
      { title: "Wire Desk", path: "/admin/wire-desk" },
      { title: "Sync Tool Response", path: "/admin/sync-response" },
      { title: "Supplier Solution Transaction History", path: "/admin/supplier-history" },
      { title: "Card Opt-Out Manager", path: "/admin/opt-out" },
    ],
  },
  {
    label: "Resource Center",
    icon: MenuBookIcon,
    hasDropdown: false,
    path: "/resources",
  },
  {
    label: "Self-Service Center",
    icon: HeadsetMicIcon,
    hasDropdown: false,
    path: "/self-service",
  },
  {
    label: "Help",
    icon: HelpOutlineIcon,
    hasDropdown: true,
    items: [
      { title: "CLASSIC ICD", path: "/help/classic-icd" },
      { title: "Feedback", path: "/help/feedback" },
      { title: "Terms and Conditions", path: "/help/terms" },
      { title: "Customer Resources", path: "/help/customer-resources" },
      { title: "User Guide - Husky", path: "/help/guide-husky" },
      { title: "User Guide - Chevron MasterCard", path: "/help/guide-chevron" },
      { title: "User Guide - Universal Premium", path: "/help/guide-universal-premium" },
      { title: "User Guide - BP Mastercard", path: "/help/guide-bp" },
      { title: "User Guide - Universal Platinum Canada", path: "/help/guide-platinum-canada" },
      { title: "User Guide - Universal Platinum Cash Wallet", path: "/help/guide-platinum-wallet" },
      { title: "User Guide - Universal Platinum", path: "/help/guide-platinum" },
      { title: "User Guide - Fuelman MasterCard", path: "/help/guide-fuelman" },
      { title: "User Guide - ARCO Mastercard", path: "/help/guide-arco" },
    ],
  },
  {
    label: "Ask Corpay",
    icon: ChatBubbleOutlineIcon,
    hasDropdown: true,
    items: [
      { title: "Ask Corpay Beta", path: "/ask-corpay" },
    ],
  },
];

function NavDropdown({ item, location, navigate }: { item: NavItem; location: string; navigate: (path: string) => void }) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const isActiveGroup = item.items
    ? item.items.some((sub) => location.startsWith(sub.path))
    : false;
  const Icon = item.icon;

  return (
    <>
      <Button
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={{
          color: isActiveGroup ? "primary.main" : "text.secondary",
          fontWeight: isActiveGroup ? 600 : 400,
          fontSize: "0.875rem",
          px: 1.5,
          minWidth: "auto",
          height: 40,
          borderBottom: isActiveGroup ? "2px solid" : "2px solid transparent",
          borderColor: isActiveGroup ? "primary.main" : "transparent",
          borderRadius: 0,
          textTransform: "none",
          gap: 0.5,
          flexShrink: 0,
          "&:hover": { backgroundColor: "transparent", color: "text.primary" },
        }}
        data-testid={`button-nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
      >
        <Icon sx={{ fontSize: 18 }} />
        <Box component="span" sx={{ display: { xs: "none", lg: "inline" } }}>{item.label}</Box>
        <KeyboardArrowDownIcon sx={{ fontSize: 16, opacity: 0.5 }} />
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        slotProps={{ paper: { sx: { width: 260, maxHeight: 320 } } }}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
      >
        {item.items?.map((sub) => (
          <MenuItem
            key={sub.title}
            onClick={() => { navigate(sub.path); setAnchorEl(null); }}
            selected={location === sub.path}
            sx={{ fontSize: "0.875rem" }}
            data-testid={`link-subnav-${sub.title.toLowerCase().replace(/[\s\/]+/g, "-")}`}
          >
            {sub.title}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

export function TopNav() {
  const location = useLocation().pathname;
  const navigate = useNavigate();

  return (
    <Box sx={{ flexShrink: 0, position: "sticky", top: 0, zIndex: 1100 }}>
      <AppBar position="static" color="inherit" elevation={0} sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Toolbar sx={{ minHeight: "56px !important", px: 3 }}>
          <Box
            sx={{ display: "flex", alignItems: "center", gap: 1, mr: 4, cursor: "pointer" }}
            onClick={() => navigate("/")}
            data-testid="link-home-logo"
          >
            <img src="/favicon.png" alt="COMDATA / iConnectData" style={{ height: 32, objectFit: "contain" }} data-testid="img-brand-logo" />
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box sx={{ textAlign: "right" }}>
              <Typography variant="body2" sx={{ fontWeight: 500, fontSize: "0.875rem", color: "text.primary", lineHeight: 1.3 }} data-testid="text-user-name">
                Nitin P.
              </Typography>
              <Typography variant="caption" sx={{ fontSize: "0.75rem", color: "text.secondary", textTransform: "none", letterSpacing: 0 }}>
                Administrator
              </Typography>
            </Box>
            <Avatar sx={{ width: 36, height: 36, bgcolor: "#E2E8F0", color: "text.primary", fontSize: "0.75rem", fontWeight: 500 }}>
              NP
            </Avatar>
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{
          height: 40,
          borderBottom: 1,
          borderColor: "divider",
          bgcolor: "background.paper",
          display: "flex",
          alignItems: "center",
          px: 3,
          gap: 0.25,
          overflowX: "auto",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
        }}
        data-testid="nav-main"
      >
        {navigationItems.map((item) => {
          if (item.hasDropdown) {
            return <NavDropdown key={item.label} item={item} location={location} navigate={navigate} />;
          }

          const isActive = location === item.path;
          const Icon = item.icon;
          return (
            <Tooltip key={item.label} title={item.label} sx={{ display: { lg: "none" } }}>
              <Button
                onClick={() => item.path && navigate(item.path)}
                sx={{
                  color: isActive ? "primary.main" : "text.secondary",
                  fontWeight: isActive ? 600 : 400,
                  fontSize: "0.875rem",
                  px: 1.5,
                  minWidth: "auto",
                  height: 40,
                  borderBottom: isActive ? "2px solid" : "2px solid transparent",
                  borderColor: isActive ? "primary.main" : "transparent",
                  borderRadius: 0,
                  textTransform: "none",
                  gap: 0.75,
                  flexShrink: 0,
                  "&:hover": { backgroundColor: "transparent", color: "text.primary" },
                }}
                data-testid={`link-nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <Icon sx={{ fontSize: 18 }} />
                <Box component="span" sx={{ display: { xs: "none", lg: "inline" } }}>{item.label}</Box>
              </Button>
            </Tooltip>
          );
        })}
      </Box>
    </Box>
  );
}
