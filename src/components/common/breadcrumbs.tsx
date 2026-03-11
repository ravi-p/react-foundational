import { Link } from "react-router-dom";
import MuiBreadcrumbs from "@mui/material/Breadcrumbs";
import MuiLink from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import HomeIcon from "@mui/icons-material/Home";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <Box sx={{ px: 3, py: 1.5, bgcolor: "background.default" }} data-testid="nav-breadcrumbs">
      <MuiBreadcrumbs
        separator={<NavigateNextIcon sx={{ fontSize: 16, color: "text.disabled" }} />}
        aria-label="breadcrumb"
      >
        <MuiLink
          component={Link}
          to="/"
          underline="hover"
          sx={{ display: "flex", alignItems: "center", color: "text.secondary", cursor: "pointer", fontSize: "0.875rem" }}
          data-testid="link-breadcrumb-home"
        >
          <HomeIcon sx={{ fontSize: 18 }} />
        </MuiLink>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          if (isLast || !item.path) {
            return (
              <Typography
                key={index}
                sx={{ fontWeight: 600, fontSize: "0.875rem", color: "text.primary" }}
                data-testid={`text-breadcrumb-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {item.label}
              </Typography>
            );
          }
          return (
            <MuiLink
              key={index}
              component={Link}
              to={item.path}
              underline="hover"
              sx={{ color: "text.secondary", cursor: "pointer", fontSize: "0.875rem" }}
              data-testid={`link-breadcrumb-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
            >
              {item.label}
            </MuiLink>
          );
        })}
      </MuiBreadcrumbs>
    </Box>
  );
}
