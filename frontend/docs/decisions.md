# Frontend Architecture Decisions

## 1. Emotion for Styling (Not CSS Modules / Tailwind)

**Decision**: Use Emotion (`@emotion/react`, `@emotion/styled`) for CSS-in-JS.

**Reasoning**:
- Theme-aware styling out of the box
- Dynamic styles based on props
- No class name conflicts
- Colocated styles with components
- PRD specifies Emotion

**Tradeoffs**:
- Runtime CSS-in-JS overhead (minimal for this scale)
- Bundle size increase vs CSS Modules
- Better DX and theme integration

## 2. React Context for Auth State (Not Redux/Zustand)

**Decision**: Use React Context + hooks for authentication state.

**Reasoning**:
- Auth state is simple (user, token, loading)
- No complex state management needed
- Built-in React solution
- PRD specifies Context

**Tradeoffs**:
- Re-renders on auth state change (acceptable)
- No middleware support
- Sufficient for single-user auth flow

## 3. useSubscriptions Custom Hook (Not Global Store)

**Decision**: Manage subscription state in a custom hook per page.

**Reasoning**:
- Single dashboard page needs subscription data
- Hook encapsulates data fetching and mutations
- Easy to test and reuse
- Avoids unnecessary global state

**Tradeoffs**:
- Data not shared across pages (not needed in Phase 1)
- Slight duplication if multiple pages need data
- Acceptable for current scope

## 4. React Hook Form for Forms (Not Formik)

**Decision**: Use React Hook Form for form management.

**Reasoning**:
- Smaller bundle size than Formik
- Better performance (uncontrolled components)
- Excellent TypeScript support (though using JS)
- PRD specifies React Hook Form

**Tradeoffs**:
- Newer than Formik
- Better performance and DX

## 5. Native HTML5 Date Input (Not Custom DatePicker)

**Decision**: Use native `<input type="date">` instead of custom date picker.

**Reasoning**:
- No additional dependency
- Browser-native UX
- Sufficient for date-only input
- Accessibility built-in

**Tradeoffs**:
- Inconsistent styling across browsers
- Less feature-rich than custom picker
- Acceptable for MVP

## 6. Optimistic UI for Toggle (Not Loading States)

**Decision**: Implement optimistic updates for subscription toggle.

**Reasoning**:
- Instant visual feedback improves UX
- Toggle is low-risk operation
- Server sync happens in background
- Revert on error is simple

**Tradeoffs**:
- Slight complexity for error handling
- Better perceived performance
- Worth the UX improvement

## 7. Axios for HTTP (Not fetch API)

**Decision**: Use Axios for API calls.

**Reasoning**:
- Interceptors for auth token handling
- Automatic JSON parsing
- Better error handling
- PRD specifies Axios

**Tradeoffs**:
- Additional dependency
- Built-in interceptors save code

## 8. Vite for Build Tool (Not CRA/Webpack)

**Decision**: Use Vite as the build tool.

**Reasoning**:
- Fastest dev server startup
- Instant HMR
- Modern ESM-based
- PRD specifies Vite

**Tradeoffs**:
- Newer than CRA
- Better performance

## 9. Design Tokens Pattern (Not Hardcoded Values)

**Decision**: Implement design tokens in `theme/tokens/` directory.

**Reasoning**:
- Single source of truth for design values
- Easy to swap themes (dark mode later)
- Consistent spacing/typography/colors
- PRD specifies token architecture

**Tradeoffs**:
- Extra directory structure
- Better maintainability and consistency

## 10. Module-Based Structure (Not Feature Folders)

**Decision**: Organize by feature modules (`auth/`, `subscriptions/`).

**Reasoning**:
- Co-locates related code
- Easy to add new features
- Clear separation of concerns
- PRD specifies module structure

**Tradeoffs**:
- More directories than flat structure
- Better scalability and navigation

## 11. ProtectedRoute Component (Not Higher-Order Component)

**Decision**: Use a wrapper component for route protection.

**Reasoning**:
- Clear intent in route definitions
- Composable with other providers
- Easy to add loading states
- More modern than HOC pattern

**Tradeoffs**:
- Slightly more nesting
- Better readability and flexibility

## 12. Semantic Color Aliases

**Decision**: Add semantic aliases to color tokens (e.g., `warningAmber`).

**Reasoning**:
- Clearer intent in component code
- Easier to change colors globally
- Self-documenting component styles
- PRD specifies semantic aliases

**Tradeoffs**:
- Extra layer of indirection
- Better code readability
