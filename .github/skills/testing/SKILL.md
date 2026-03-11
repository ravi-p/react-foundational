---
name: testing
description: How to write tests with Jest and React Testing Library. Use when creating test files, writing unit tests, or testing React components. Covers test structure, RTL queries, provider wrapping, and best practices.
license: MIT
metadata:
  version: '1.0'
---

# Testing

## Setup

- **Jest** as the test runner
- **React Testing Library (RTL)** for component tests
- **@testing-library/user-event** for user interaction simulation

## Step-by-step

1. **Create the test file** co-located with the component: `ComponentName.test.tsx`
2. **Import from RTL**: `render`, `screen`, `waitFor`
3. **Import `userEvent`** for interactions (prefer over `fireEvent`)
4. **Wrap with providers** if the component uses Redux, Router, or Theme

## Test File Template

```tsx
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ComponentName from './ComponentName';

// Wrap with providers if needed
const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    // Add ThemeProvider, Provider (Redux), BrowserRouter as needed
    ui,
  );
};

describe('ComponentName', () => {
  const defaultProps = {
    // sensible defaults
  };

  it('should render correctly', () => {
    render(<ComponentName {...defaultProps} />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  it('should handle user interaction', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();
    render(<ComponentName {...defaultProps} onClick={handleClick} />);

    await user.click(screen.getByRole('button', { name: /submit/i }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should display loading state', () => {
    render(<ComponentName {...defaultProps} loading />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
});
```

## Query Priority (use in this order)

1. `getByRole` — accessible role queries (preferred)
2. `getByLabelText` — form elements
3. `getByPlaceholderText` — input placeholders
4. `getByText` — visible text content
5. `getByTestId` — last resort only

## Rules

- **Test behavior, not implementation** — never test internal state
- **One concept per test** — keep tests focused
- **Descriptive names**: `it('should display error message when API call fails')`
- **Use `userEvent` over `fireEvent`** for realistic interaction simulation
- **Use `waitFor`** for async operations
- **Mock API calls** — never make real HTTP requests in tests
- **Co-locate tests** — `ComponentName.test.tsx` next to `ComponentName.tsx`
