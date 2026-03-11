import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import BarChartIcon from "@mui/icons-material/BarChart";
import SearchIcon from "@mui/icons-material/Search";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import PeopleIcon from "@mui/icons-material/People";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ActivityIcon from "@mui/icons-material/ShowChart";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const quickLinks = [
  { title: "Card Maintenance", description: "Search and manage card details", icon: CreditCardIcon, path: "/manage/card-maintenance", bgColor: "#EFF6FF", iconColor: "#2563EB" },
  { title: "Reporting", description: "View reports and analytics", icon: BarChartIcon, path: "/reporting/bi", bgColor: "#ECFDF5", iconColor: "#059669" },
  { title: "Find Services", description: "Locate ATMs and merchants", icon: SearchIcon, path: "/find/atm", bgColor: "#F5F3FF", iconColor: "#7C3AED" },
  { title: "Payment Center", description: "Manage invoices and payments", icon: AttachMoneyIcon, path: "/payments/invoices", bgColor: "#FFFBEB", iconColor: "#D97706" },
];

const stats = [
  { label: "Active Cards", value: "12,458", change: "+2.4%", icon: CreditCardIcon },
  { label: "Total Transactions", value: "84,291", change: "+5.1%", icon: ActivityIcon },
  { label: "Active Accounts", value: "346", change: "+1.2%", icon: PeopleIcon },
  { label: "Monthly Volume", value: "$4.2M", change: "+3.8%", icon: TrendingUpIcon },
];

const recentActivity = [
  { type: "Card Status Change", detail: "Card ...0019 status changed to Active", time: "2 hours ago", icon: CheckCircleIcon },
  { type: "New Card Order", detail: "5 new driver cards ordered for account MC180", time: "4 hours ago", icon: CreditCardIcon },
  { type: "Limit Update", detail: "Transaction limit updated for card ...0027", time: "6 hours ago", icon: TrendingUpIcon },
  { type: "System Alert", detail: "Scheduled maintenance on Feb 28, 2AM-4AM EST", time: "1 day ago", icon: WarningAmberIcon },
];

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Breadcrumbs items={[{ label: "Dashboard" }]} />
      <Box sx={{ flex: 1, overflow: "auto" }}>
        <Box sx={{ maxWidth: 1200, mx: "auto", px: 3, py: 3 }}>
          <Stack spacing={3}>
            <Box>
              <Typography variant="h1" data-testid="text-dashboard-title">
                Welcome back, Nitin
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5 }} data-testid="text-dashboard-subtitle">
                Here's an overview of your fleet management activity
              </Typography>
            </Box>

            <Grid container spacing={2}>
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={stat.label}>
                    <Card>
                      <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1.5 }}>
                          <Typography variant="caption" data-testid={`label-stat-${stat.label.toLowerCase().replace(/\s+/g, "-")}`}>
                            {stat.label}
                          </Typography>
                          <Box sx={{ width: 32, height: 32, borderRadius: 1, bgcolor: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Icon sx={{ fontSize: 18, color: "#2563EB" }} />
                          </Box>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "flex-end", gap: 1 }}>
                          <Typography sx={{ fontSize: "1.5rem", fontWeight: 600, color: "text.primary" }} data-testid={`value-stat-${stat.label.toLowerCase().replace(/\s+/g, "-")}`}>
                            {stat.value}
                          </Typography>
                          <Typography sx={{ fontSize: "0.75rem", fontWeight: 500, color: "#059669", mb: 0.5 }}>
                            {stat.change}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>

            <Grid container spacing={2}>
              {quickLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={link.title}>
                    <Card
                      sx={{ cursor: "pointer", transition: "box-shadow 0.15s", "&:hover": { boxShadow: 3 } }}
                      onClick={() => navigate(link.path)}
                    >
                      <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
                        <Box sx={{ width: 40, height: 40, borderRadius: 1, bgcolor: link.bgColor, display: "flex", alignItems: "center", justifyContent: "center", mb: 1.5 }}>
                          <Icon sx={{ fontSize: 22, color: link.iconColor }} />
                        </Box>
                        <Typography variant="h3" sx={{ mb: 0.5 }} data-testid={`text-quick-link-${link.title.toLowerCase().replace(/\s+/g, "-")}`}>
                          {link.title}
                        </Typography>
                        <Typography variant="body2">{link.description}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>

            <Card>
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 2.5, pt: 2.5, pb: 1.5 }}>
                  <Typography variant="h2" data-testid="text-recent-activity-title">
                    Recent Activity
                  </Typography>
                  <Button size="small" endIcon={<ArrowForwardIcon sx={{ fontSize: 16 }} />} data-testid="button-view-all-activity">
                    View All
                  </Button>
                </Box>
                <Stack spacing={0}>
                  {recentActivity.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <Box
                        key={idx}
                        sx={{
                          display: "flex", alignItems: "flex-start", gap: 1.5, px: 2.5, py: 1.5,
                          "&:hover": { bgcolor: "rgba(241,245,249,0.5)" },
                          transition: "background-color 0.15s",
                        }}
                        data-testid={`row-activity-${idx}`}
                      >
                        <Box sx={{ width: 32, height: 32, borderRadius: 1, bgcolor: "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, mt: 0.25 }}>
                          <Icon sx={{ fontSize: 16, color: "#64748B" }} />
                        </Box>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>{item.type}</Typography>
                          <Typography variant="body2" sx={{ mt: 0.25 }}>{item.detail}</Typography>
                        </Box>
                        <Typography variant="body2" sx={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 0.5 }}>
                          <AccessTimeIcon sx={{ fontSize: 14 }} />
                          {item.time}
                        </Typography>
                      </Box>
                    );
                  })}
                </Stack>
              </CardContent>
            </Card>

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
    </Box>
  );
}
