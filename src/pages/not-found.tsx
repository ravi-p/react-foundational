import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function NotFound() {
  return (
    <Box sx={{ height: "100%", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "background.default" }}>
      <Card sx={{ width: "100%", maxWidth: 400, mx: 2 }}>
        <CardContent sx={{ pt: 4, textAlign: "center" }}>
          <Box sx={{ width: 48, height: 48, borderRadius: "50%", bgcolor: "#F1F5F9", mx: "auto", display: "flex", alignItems: "center", justifyContent: "center", mb: 2 }}>
            <ErrorOutlineIcon sx={{ fontSize: 28, color: "text.secondary" }} />
          </Box>
          <Typography variant="h1" sx={{ fontSize: "1.25rem" }} data-testid="text-404-title">
            Page Not Found
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, mb: 3 }} data-testid="text-404-message">
            The page you're looking for doesn't exist or has been moved.
          </Typography>
          <Link to="/">
            <Button variant="outlined" startIcon={<ArrowBackIcon />} data-testid="button-go-home">
              Back to Dashboard
            </Button>
          </Link>
        </CardContent>
      </Card>
    </Box>
  );
}
