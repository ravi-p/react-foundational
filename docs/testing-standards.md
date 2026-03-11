# Testing Standards

## Stack

- **Jest** — test runner
- **React Testing Library (RTL)** — component testing
- **@testing-library/user-event** — realistic user interaction simulation

## File Conventions

| Convention | Rule                                                   |
| ---------- | ------------------------------------------------------ |
| Location   | Co-located with source: `ComponentName.test.tsx`       |
| Naming     | `*.test.tsx` for components, `*.test.ts` for utilities |
| Structure  | `describe` → `it` blocks                               |

## Test Structure

```tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  const defaultProps = { title: 'Test' };

  it('should render the title', () => {
    render(<MyComponent {...defaultProps} />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('should handle click events', async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    render(<MyComponent {...defaultProps} onClick={onClick} />);

    await user.click(screen.getByRole('button', { name: /submit/i }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
```

## Query Priority

Use in this order (most to least preferred):

1. `getByRole` — accessible role queries
2. `getByLabelText` — form elements
3. `getByPlaceholderText` — input placeholders
4. `getByText` — visible text content
5. `getByTestId` — **last resort only**

## Provider Wrapping

Components using Redux, Router, or Theme need wrapping:

```tsx
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter } from 'react-router-dom';
import { store } from '@/store/store';
import { theme } from '@/theme/theme';

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>{ui}</BrowserRouter>
      </ThemeProvider>
    </Provider>,
  );
};
```

## Rules

- Test **behavior**, not implementation
- One concept per test
- Use `userEvent` over `fireEvent`
- Use `waitFor` for async operations
- Mock API calls — never hit real endpoints
- Descriptive test names: `it('should display error when API fails')`
