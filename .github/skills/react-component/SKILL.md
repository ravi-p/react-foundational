---
name: react-component
description: How to create React components in this project. Use when creating new UI components, pages, or modifying existing component files. Covers arrow function pattern, MUI usage, props typing, accessibility, and file naming conventions.
license: MIT
metadata:
  version: '1.0'
---

# Creating React Components

## Step-by-step

1. **Choose the right location:**
   - Reusable UI components → `src/components/common/<component-name>/`
   - Feature-specific components → `src/components/<feature-name>/`
   - Page-level components → `src/pages/`

2. **Create the file** with kebab-case naming: `user-card.tsx`

3. **Define the component** using this exact pattern:

```tsx
import React from 'react';

import { Box, Typography } from '@mui/material';

interface UserCardProps {
  name: string;
  email: string;
  onEdit?: () => void;
}

const UserCard: React.FC<UserCardProps> = ({ name, email, onEdit }) => {
  return (
    <Box sx={{ p: 2, borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
      <Typography variant="h6" component="h2">
        {name}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {email}
      </Typography>
    </Box>
  );
};

export default UserCard;
```

## Rules

- **Arrow functions only** — never `function` declarations for components
- **React.FC<Props>** — always type the component with FC generic
- **Interface for props** — suffix with `Props` (e.g., `UserCardProps`)
- **Default export** for the component, named exports for related types
- **MUI components** for all layout and typography — no raw `<div>`, `<p>`, `<h1>`
- **`sx` prop** for styling — use theme tokens (`theme.spacing()`, `theme.palette.*`)
- **Accessibility**: `alt` on images, `aria-label` on icon buttons, semantic HTML

## Import Order

```tsx
// 1. React
import React, { useState, useEffect } from 'react';

// 2. Third-party
import { Box, Typography } from '@mui/material';

// 3. Internal (using @/ alias)
import { useAppSelector } from '@/store/hooks';

// 4. Styles (if any)
import './styles.css';
```

## Common Patterns

### Component with local state

```tsx
const Counter: React.FC = () => {
  const [count, setCount] = useState(0);
  return <Button onClick={() => setCount((prev) => prev + 1)}>Count: {count}</Button>;
};
```

### Component with Redux

```tsx
const UserList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { users, loading } = useAppSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  if (loading) return <CircularProgress />;

  return (
    <Box>
      {users.map((user) => (
        <UserCard key={user.id} name={user.name} email={user.email} />
      ))}
    </Box>
  );
};
```
