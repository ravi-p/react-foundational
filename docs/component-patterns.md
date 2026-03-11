# Component Patterns

## Standard Component Template

```tsx
import React from 'react';

import { Box, Typography } from '@mui/material';

interface MyComponentProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

const MyComponent: React.FC<MyComponentProps> = ({ title, subtitle, children }) => {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" component="h2">
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body2" color="text.secondary">
          {subtitle}
        </Typography>
      )}
      {children}
    </Box>
  );
};

export default MyComponent;
```

## Key Rules

- **Arrow functions only**: `const Comp: React.FC<Props> = () => {}`
- **Interface for props** with `Props` suffix
- **Default export** for the component
- **MUI components** for all layout — no raw HTML `<div>`, `<p>`, `<span>`
- **`sx` prop** for styling

## Component with State

```tsx
const Counter: React.FC = () => {
  const [count, setCount] = useState(0);

  const handleIncrement = () => {
    setCount((prev) => prev + 1);
  };

  return (
    <Box>
      <Typography>Count: {count}</Typography>
      <Button onClick={handleIncrement} aria-label="Increment counter">
        Increment
      </Button>
    </Box>
  );
};
```

## Component with Redux

```tsx
const UserList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { users, loading, error } = useAppSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  if (loading) return <CircularProgress aria-label="Loading users" />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box>
      {users.map((user) => (
        <UserCard key={user.id} {...user} />
      ))}
    </Box>
  );
};
```

## Memoization

Use `React.memo` for components that receive stable props but have expensive renders:

```tsx
const ExpensiveList: React.FC<ListProps> = React.memo(({ items }) => {
  return (
    <Box>
      {items.map((item) => (
        <ListItem key={item.id}>{item.name}</ListItem>
      ))}
    </Box>
  );
});
```

Use `useMemo` and `useCallback` for expensive computations and stable callback references:

```tsx
const filteredUsers = useMemo(() => users.filter((u) => u.active), [users]);

const handleSubmit = useCallback(
  (data: FormData) => {
    dispatch(submitForm(data));
  },
  [dispatch],
);
```

## Conditional Rendering

```tsx
// Short-circuit
{
  isLoading && <CircularProgress />;
}

// Ternary
{
  isAuthenticated ? <Dashboard /> : <LoginPage />;
}

// Early return
if (loading) return <CircularProgress />;
if (error) return <Alert severity="error">{error}</Alert>;
return <Content />;
```

## MUI Styling Patterns

### sx prop (preferred for one-off styles)

```tsx
<Box sx={{ display: 'flex', gap: 2, p: 3, borderRadius: 1 }}>
```

### styled() (for reusable styled components)

```tsx
import { styled } from '@mui/material/styles';

const StyledCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
}));
```

### Theme tokens (always use over hardcoded values)

```tsx
// ✅ Good
sx={{ color: 'primary.main', mb: 2 }}

// ❌ Bad
sx={{ color: '#1976d2', marginBottom: '16px' }}
```
