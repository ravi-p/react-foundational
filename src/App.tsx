import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import theme from "@/theme";
import { store } from "@/store/store";
import { TopNav } from "@/components/common/top-nav";
import { ErrorBoundary } from "@/components/error-boundary/ErrorBoundary";
import { Router } from "@/routes";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <ErrorBoundary>
            <Box sx={{ display: "flex", flexDirection: "column", height: "100vh", width: "100%" }}>
              <TopNav />
              <Box component="main" sx={{ flex: 1, overflow: "hidden" }}>
                <Router />
              </Box>
            </Box>
          </ErrorBoundary>
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
