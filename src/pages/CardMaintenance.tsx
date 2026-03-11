import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  Stack,
} from '@mui/material';
import {
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  CreditCard as CreditCardIcon,
  ArrowForward as ArrowForwardIcon,
  InfoOutlined as InfoOutlinedIcon,
  Refresh as RefreshIcon,
  FilterList as FilterListIcon,
  SwapHoriz as SwapHorizIcon,
  VerifiedUser as VerifiedUserIcon,
  ManageAccounts as ManageAccountsIcon,
  LocalGasStation as LocalGasStationIcon,
  AccountBalanceWallet as AccountBalanceWalletIcon,
  Person as PersonIcon,
  Speed as SpeedIcon,
  AccountBalance as AccountBalanceIcon,
  History as HistoryIcon,
  Layers as LayersIcon,
  AutoAwesome as AutoAwesomeIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

interface Card {
  id: string;
  cardNumber: string;
  cardholderName: string;
  accountId: string;
  customerId: string;
  status: 'Active' | 'Inactive' | 'Locked';
  profileType: string;
  lastActivity: string;
}

interface BulkAction {
  icon: React.ElementType;
  title: string;
  description: string;
}

interface CardDetailItem {
  icon: React.ElementType;
  title: string;
  description: string;
}

const mockCards: Card[] = [
  {
    id: '1',
    cardNumber: '1234 56XX XXXX 0019',
    cardholderName: 'TEST NARX',
    accountId: 'MC180',
    customerId: 'BBB81',
    status: 'Active',
    profileType: 'Driver Profile (001)',
    lastActivity: 'Feb 24, 2026 14:32',
  },
  {
    id: '2',
    cardNumber: '1234 56XX XXXX 0027',
    cardholderName: 'JOHN SMITH',
    accountId: 'MC180',
    customerId: 'BBB81',
    status: 'Active',
    profileType: 'Driver Profile (001)',
    lastActivity: 'Feb 23, 2026 09:15',
  },
  {
    id: '3',
    cardNumber: '1234 56XX XXXX 0035',
    cardholderName: 'JANE DOE',
    accountId: 'MC180',
    customerId: 'BBB82',
    status: 'Inactive',
    profileType: 'Vehicle Profile (002)',
    lastActivity: 'Feb 20, 2026 16:45',
  },
  {
    id: '4',
    cardNumber: '1234 56XX XXXX 0043',
    cardholderName: 'MIKE WILSON',
    accountId: 'MC181',
    customerId: 'BBB83',
    status: 'Active',
    profileType: 'Driver Profile (001)',
    lastActivity: 'Feb 22, 2026 11:20',
  },
  {
    id: '5',
    cardNumber: '1234 56XX XXXX 0050',
    cardholderName: 'SARAH BROWN',
    accountId: 'MC181',
    customerId: 'BBB83',
    status: 'Locked',
    profileType: 'Driver Profile (001)',
    lastActivity: 'Feb 19, 2026 08:30',
  },
];

const bulkActions: BulkAction[] = [
  {
    icon: SwapHorizIcon,
    title: 'Move Card(s)',
    description: 'Transfer cards between accounts or customer IDs',
  },
  {
    icon: VerifiedUserIcon,
    title: 'Change Card Status',
    description: 'Activate, deactivate, or suspend multiple cards',
  },
  {
    icon: ManageAccountsIcon,
    title: 'Change Profile',
    description: 'Update driver or vehicle profile assignments',
  },
  {
    icon: LocalGasStationIcon,
    title: 'Change Fuel Limit',
    description: 'Adjust daily or per-transaction fuel spending limits',
  },
  {
    icon: AccountBalanceWalletIcon,
    title: 'Change Cash On Card Limit',
    description: 'Set or modify cash withdrawal limits on cards',
  },
];

const cardDetailItems: CardDetailItem[] = [
  {
    icon: PersonIcon,
    title: 'Cardholder / Vehicle Information',
    description: 'View and edit driver details, vehicle assignments, and shipping info',
  },
  {
    icon: SpeedIcon,
    title: 'Products / Limits',
    description: 'Manage transaction limits, product controls, and spending caps',
  },
  {
    icon: AccountBalanceIcon,
    title: 'eCash / Cash Wallet Information',
    description: 'Check eCash balances, wallet status, and cash activity',
  },
  {
    icon: HistoryIcon,
    title: 'Transaction History',
    description: 'Browse recent transactions, filter by date, and export reports',
  },
  {
    icon: LayersIcon,
    title: 'Network Restrictions',
    description: 'View allowed merchant categories and network access rules',
  },
];

const CardMaintenance: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchBy, setSearchBy] = useState('card-number');
  const [showMasked, setShowMasked] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [showBanner, setShowBanner] = useState(true);

  const handleSearch = () => {
    setShowResults(true);
  };

  const handleStartTour = () => {
    setShowBanner(false);
  };

  const filteredCards = showResults
    ? mockCards.filter((card) => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return (
          card.cardNumber.toLowerCase().includes(q) ||
          card.cardholderName.toLowerCase().includes(q) ||
          card.accountId.toLowerCase().includes(q) ||
          card.customerId.toLowerCase().includes(q)
        );
      })
    : [];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <Box sx={{ maxWidth: 1200, mx: 'auto', px: 3, py: 3 }}>
          <Stack spacing={3}>
            <Typography variant="h1" data-testid="text-page-title">
              Card Maintenance
            </Typography>

            {showBanner && (
              <Card
                sx={{
                  position: 'relative',
                  overflow: 'hidden',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
                data-testid="card-banner"
              >
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'linear-gradient(135deg, rgba(239,246,255,0.92) 0%, rgba(219,234,254,0.88) 40%, rgba(191,219,254,0.85) 100%)',
                  }}
                />
                <IconButton
                  onClick={() => setShowBanner(false)}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    zIndex: 1,
                    color: 'text.secondary',
                  }}
                  size="small"
                  aria-label="Close banner"
                  data-testid="button-banner-close"
                >
                  <CloseIcon sx={{ fontSize: 20 }} />
                </IconButton>
                <CardContent
                  sx={{
                    position: 'relative',
                    p: 3,
                    '&:last-child': { pb: 3 },
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      gap: 3,
                    }}
                  >
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                        <AutoAwesomeIcon sx={{ fontSize: 28, color: '#2563EB' }} />
                        <Typography
                          sx={{
                            fontSize: '1.25rem',
                            fontWeight: 700,
                            color: 'text.primary',
                          }}
                          data-testid="text-banner-title"
                        >
                          Introducing New Search
                        </Typography>
                      </Box>
                      <Typography
                        sx={{
                          fontSize: '0.875rem',
                          color: 'text.secondary',
                          mb: 1.5,
                        }}
                        data-testid="text-banner-description"
                      >
                        Search, Sort, Filter and update multiple cards faster.
                      </Typography>
                      <Box
                        component="ul"
                        sx={{
                          m: 0,
                          pl: 2.5,
                          '& li': {
                            fontSize: '0.875rem',
                            color: 'text.primary',
                            mb: 0.5,
                          },
                        }}
                      >
                        <li>Search Instantly</li>
                        <li>Update Multiple Cards</li>
                        <li>Change limits and Status</li>
                      </Box>
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        flexShrink: 0,
                        pt: 3,
                      }}
                    >
                      <Button
                        variant="outlined"
                        onClick={handleStartTour}
                        sx={{
                          borderColor: 'text.primary',
                          color: 'text.primary',
                          fontWeight: 600,
                          '&:hover': {
                            borderColor: 'primary.main',
                            color: 'primary.main',
                          },
                        }}
                        data-testid="button-take-tour"
                      >
                        Take a Tour
                      </Button>
                      <Button
                        variant="text"
                        onClick={() => setShowBanner(false)}
                        sx={{ color: 'text.primary', fontWeight: 600 }}
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
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <Stack spacing={1.5}>
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={1.5}
                  >
                    <FormControl size="small" sx={{ minWidth: 180 }}>
                      <Select
                        value={searchBy}
                        onChange={(e) => setSearchBy(e.target.value)}
                        data-testid="select-search-by"
                      >
                        <MenuItem value="card-number">Card Number</MenuItem>
                        <MenuItem value="cardholder-name">Cardholder Name</MenuItem>
                        <MenuItem value="card-id">Card ID</MenuItem>
                        <MenuItem value="employee-id">Employee ID</MenuItem>
                        <MenuItem value="unit-number">Unit Number</MenuItem>
                      </Select>
                    </FormControl>
                    <TextField
                      size="small"
                      placeholder="Enter search criteria..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      sx={{ flex: 1 }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon
                              sx={{ fontSize: 18, color: 'text.secondary' }}
                            />
                          </InputAdornment>
                        ),
                      }}
                      data-testid="input-search"
                    />
                    <IconButton
                      onClick={() => setShowMasked(!showMasked)}
                      size="small"
                      aria-label={
                        showMasked
                          ? 'Show card numbers'
                          : 'Mask card numbers'
                      }
                      data-testid="button-toggle-mask"
                    >
                      {showMasked ? (
                        <VisibilityOffIcon sx={{ fontSize: 20 }} />
                      ) : (
                        <VisibilityIcon sx={{ fontSize: 20 }} />
                      )}
                    </IconButton>
                    <Button
                      variant="contained"
                      onClick={handleSearch}
                      startIcon={<SearchIcon />}
                      data-testid="button-search"
                    >
                      Search
                    </Button>
                  </Stack>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <InfoOutlinedIcon
                      sx={{ fontSize: 16, color: 'text.secondary' }}
                    />
                    <Typography
                      variant="body2"
                      data-testid="text-search-hint"
                    >
                      Search by card #: enter last 4, last 10, first 6, or full 16 digits. For name or ID, enter at least 2 characters.
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            {showResults && (
              <Card>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    px: 2.5,
                    pt: 2.5,
                    pb: 1.5,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography
                      variant="h2"
                      data-testid="text-results-title"
                    >
                      Search Results
                    </Typography>
                    <Chip
                      label={filteredCards.length}
                      size="small"
                      color="default"
                      data-testid="badge-result-count"
                    />
                  </Box>
                  <Box>
                    <IconButton
                      size="small"
                      data-testid="button-refresh-results"
                    >
                      <RefreshIcon sx={{ fontSize: 20 }} />
                    </IconButton>
                    <IconButton
                      size="small"
                      data-testid="button-filter-results"
                    >
                      <FilterListIcon sx={{ fontSize: 20 }} />
                    </IconButton>
                  </Box>
                </Box>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Card Number</TableCell>
                        <TableCell>Cardholder Name</TableCell>
                        <TableCell>Account ID</TableCell>
                        <TableCell>Customer ID</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Last Activity</TableCell>
                        <TableCell sx={{ width: 40 }} />
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredCards.map((card) => (
                        <TableRow
                          key={card.id}
                          hover
                          sx={{ cursor: 'pointer' }}
                          onClick={() =>
                            navigate(
                              `/card-maintenance/${card.id}`,
                            )
                          }
                          data-testid={`row-card-${card.id}`}
                        >
                          <TableCell
                            data-testid={`text-card-number-${card.id}`}
                          >
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                fontFamily: '"Roboto Mono", monospace',
                              }}
                            >
                              <CreditCardIcon
                                sx={{
                                  fontSize: 16,
                                  color: 'text.secondary',
                                }}
                              />
                              {showMasked
                                ? card.cardNumber
                                : card.cardNumber.replace(/X/g, '0')}
                            </Box>
                          </TableCell>
                          <TableCell
                            sx={{ fontWeight: 500 }}
                            data-testid={`text-card-holder-${card.id}`}
                          >
                            {card.cardholderName}
                          </TableCell>
                          <TableCell
                            data-testid={`text-account-id-${card.id}`}
                          >
                            {card.accountId}
                          </TableCell>
                          <TableCell
                            data-testid={`text-customer-id-${card.id}`}
                          >
                            {card.customerId}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={card.status}
                              size="small"
                              color={
                                card.status === 'Active'
                                  ? 'success'
                                  : card.status === 'Locked'
                                    ? 'error'
                                    : 'default'
                              }
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell
                            sx={{ color: 'text.secondary' }}
                            data-testid={`text-last-activity-${card.id}`}
                          >
                            {card.lastActivity}
                          </TableCell>
                          <TableCell>
                            <ArrowForwardIcon
                              sx={{
                                fontSize: 16,
                                color: 'text.secondary',
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Card>
            )}

            {!showResults && (
              <>
                <Box>
                  <Typography
                    variant="h2"
                    sx={{ mb: 1.5 }}
                    data-testid="text-multi-card-title"
                  >
                    Bulk Actions
                  </Typography>
                  <Grid container spacing={1.5}>
                    {bulkActions.map((action) => {
                      const Icon = action.icon;
                      return (
                        <Grid
                          size={{ xs: 12, sm: 6, lg: 4 }}
                          key={action.title}
                        >
                          <Card
                            sx={{
                              cursor: 'pointer',
                              transition: 'box-shadow 0.15s',
                              '&:hover': { boxShadow: 3 },
                            }}
                          >
                            <CardContent
                              sx={{
                                p: 2,
                                '&:last-child': { pb: 2 },
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: 1.5,
                              }}
                            >
                              <Box
                                sx={{
                                  width: 36,
                                  height: 36,
                                  borderRadius: 1,
                                  bgcolor: '#EFF6FF',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  flexShrink: 0,
                                }}
                              >
                                <Icon
                                  sx={{
                                    fontSize: 18,
                                    color: '#2563EB',
                                  }}
                                />
                              </Box>
                              <Box sx={{ minWidth: 0 }}>
                                <Typography
                                  variant="body1"
                                  sx={{
                                    fontWeight: 500,
                                    lineHeight: 1.3,
                                  }}
                                  data-testid={`text-bulk-action-${action.title
                                    .toLowerCase()
                                    .replace(/\s+/g, '-')}`}
                                >
                                  {action.title}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  sx={{ mt: 0.5, lineHeight: 1.4 }}
                                >
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
                  <Typography
                    variant="h2"
                    sx={{ mb: 1.5 }}
                    data-testid="text-card-detail-title"
                  >
                    Card Detail
                  </Typography>
                  <Grid container spacing={1.5}>
                    {cardDetailItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Grid
                          size={{ xs: 12, sm: 6, lg: 4 }}
                          key={item.title}
                        >
                          <Card
                            sx={{
                              cursor: 'pointer',
                              transition: 'box-shadow 0.15s',
                              '&:hover': { boxShadow: 3 },
                            }}
                          >
                            <CardContent
                              sx={{
                                p: 2,
                                '&:last-child': { pb: 2 },
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: 1.5,
                              }}
                            >
                              <Box
                                sx={{
                                  width: 36,
                                  height: 36,
                                  borderRadius: 1,
                                  bgcolor: '#F1F5F9',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  flexShrink: 0,
                                }}
                              >
                                <Icon
                                  sx={{
                                    fontSize: 18,
                                    color: '#64748B',
                                  }}
                                />
                              </Box>
                              <Box sx={{ minWidth: 0 }}>
                                <Typography
                                  variant="body1"
                                  sx={{
                                    fontWeight: 500,
                                    lineHeight: 1.3,
                                  }}
                                  data-testid={`text-detail-item-${item.title
                                    .toLowerCase()
                                    .replace(/[\s/]+/g, '-')}`}
                                >
                                  {item.title}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  sx={{ mt: 0.5, lineHeight: 1.4 }}
                                >
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
    </Box>
  );
};

export default CardMaintenance;
