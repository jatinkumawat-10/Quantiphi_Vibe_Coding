# Frontend Specifications

## Overview

React SPA built with Vite, styled with Emotion, and using React Router for navigation. All business logic is handled server-side; frontend is presentation-only.

## Architecture

### Component Hierarchy
```
App
├── ThemeProvider (Emotion)
├── AuthProvider (Context)
└── RouterProvider (React Router)
    ├── LoginPage
    ├── RegisterPage
    └── DashboardPage (Protected)
        ├── AppLayout
        │   ├── Header (Logo, User, Logout)
        │   └── MainContent
        ├── Topbar
        │   ├── MetricTile (Burn Rate)
        │   └── MetricTile (Upcoming Renewals)
        ├── EntryForm
        │   ├── TextField (Service Name)
        │   ├── TextField (Cost)
        │   ├── Select (Billing Cycle)
        │   ├── DatePicker (Renewal Date)
        │   └── Button (Submit)
        └── SubscriptionTable
            └── SubscriptionRow[]
                ├── ServiceName
                ├── Cost
                ├── BillingCycle
                ├── RenewalDate
                ├── RenewingSoonBadge (conditional)
                ├── StatusBadge
                └── StatusToggle
```

## Modules

### Auth Module
- **Context**: `AuthContext` provides user state and auth functions
- **API**: Centralized auth API calls
- **Pages**: Login and Register pages with forms
- **Components**: LoginForm and RegisterForm with React Hook Form

### Subscriptions Module
- **Hooks**: `useSubscriptions` manages data fetching and state
- **API**: Subscription CRUD and metrics API calls
- **Pages**: Dashboard page combining all components
- **Components**: Topbar, EntryForm, SubscriptionTable, etc.

## Theme System

### Tokens (Source of Truth)
- `colors/`: Color palette with semantic aliases
- `spacing/`: 4px increment spacing scale
- `typography/`: Font family, size, weight, line-height

### Theme Composition
- `theme.js`: Composes tokens into Emotion-consumable object
- `ThemeProvider.jsx`: Wraps app with ThemeProvider
- `globalStyles.js`: CSS resets and base styles

### Semantic Aliases
- `warningAmber`: "Renewing Soon" badge
- `mutedGrey`: Paused rows
- `activeGreen`: Active status
- `inputFocus`: Focus ring color

## Shared Components

### Button
- Variants: primary, secondary, danger, ghost
- Sizes: sm, md, lg
- Disabled state with loading indication

### TextField
- Label, placeholder, error state
- Focus ring and border styling
- Disabled state

### Select
- Dropdown with options
- Custom arrow styling
- Error state

### DatePicker
- Native HTML5 date input
- Min date validation
- Error state

## Data Flow

1. **Initial Load**: `useSubscriptions` fetches data on mount
2. **User Actions**: Form submissions trigger API calls
3. **Optimistic Updates**: Toggle immediately updates UI
4. **Server Sync**: Re-fetch metrics after toggle for consistency

## Error Handling

- Form validation errors shown inline
- API errors displayed in error banners
- Loading states for all async operations
- 401 responses redirect to login

## Responsive Design

- Desktop-first layout
- Tablet-friendly with breakpoints
- Mobile support via media queries
- Grid layout for entry form

## Performance

- Lazy loading not needed for MVP (<50 routes)
- No code splitting required
- Optimized bundle via Vite
- Emotion CSS-in-JS with critical CSS extraction
