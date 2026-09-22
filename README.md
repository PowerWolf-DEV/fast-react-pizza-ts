# Fast React Pizza Co. 🍕

A modern, full-stack pizza ordering application built with React 19, TypeScript, Redux Toolkit, and React Router v8. Features real-time geolocation, priority ordering, and a complete cart/checkout flow.

**Live Demo:** [https://fast-pizza-react-ts.netlify.app/](https://fast-pizza-react-ts.netlify.app/)

---

## Features

### 🍽️ Menu & Ordering
- **Dynamic menu** loaded from external API (`react-fast-pizza-api`)
- **Add/remove pizzas** with quantity controls
- **Real-time cart** with persistent state via Redux
- **Sold-out handling** with visual indicators
- **Ingredient lists** for each pizza

### 🛒 Cart Management
- Add/remove items with quantity adjustment
- Auto-removes items when quantity reaches 0
- Cart overview in header with total price/quantity
- Clear cart functionality

### 👤 User Profile
- Username persistence via Redux
- Geolocation address autocomplete (BigDataCloud API)
- Permission denied / timeout error handling

### 📦 Order Flow
- **Create order** with customer details (name, phone, address)
- Phone number validation
- **Priority ordering** (20% surcharge for faster delivery)
- Order confirmation with estimated delivery time
- Order lookup by ID

### 🔍 Order Tracking
- Real-time order status (preparing/delivered)
- Countdown timer to estimated delivery
- Priority badge for expedited orders
- Upgrade to priority post-creation
- Price breakdown (pizza + priority surcharge)

---

## Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | React 19 + TypeScript |
| **Build Tool** | Vite 8 |
| **State Management** | Redux Toolkit 2 |
| **Routing** | React Router v8 (data APIs: loaders/actions) |
| **Styling** | Tailwind CSS 4 |
| **Testing** | Vitest + React Testing Library |
| **Linting** | ESLint 9 (flat config) + TypeScript ESLint |
| **Formatting** | Prettier + prettier-plugin-tailwindcss |
| **React Compiler** | Enabled via Babel plugin |
| **Deployment** | Netlify |

---

## Project Structure

```
src/
├── features/
│   ├── cart/           # Cart slice, components (Cart, CartItem, CartOverview)
│   ├── menu/           # Menu components (Menu, MenuItem)
│   ├── order/          # Order flow (CreateOrder, Order, OrderItem, SearchOrder, UpdateOrder)
│   └── user/           # User slice, components (CreateUser, Username)
├── services/
│   ├── apiRestaurant.ts    # Pizza API client (menu, orders)
│   └── apiGeocoding.ts     # Geocoding API client (address lookup)
├── ui/                 # Shared UI components (Button, LinkButton, Header, Loader, ErrorMessage)
├── hooks.ts            # Typed Redux hooks (useAppDispatch, useAppSelector)
├── store.ts            # Redux store configuration
├── utils/
│   └── helpers.ts      # Currency/date formatting, time calculations
└── test/               # Vitest setup & type declarations
```

---

## Getting Started

### Prerequisites
- Node.js 20+
- npm 10+

### Installation
```bash
git clone https://github.com/yourusername/fast-react-pizza-ts.git
cd fast-react-pizza-ts
npm install
```

### Environment Variables
Create `.env` file (already in `.gitignore`):
```env
VITE_API_URL=https://react-fast-pizza-api.jonas.io/api
```

### Development
```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run preview      # Preview production build
```

### Testing
```bash
npm run test         # Watch mode
npm run test:run     # CI mode (32 tests)
npm run test:ui      # Visual test UI
npm run test:coverage # Coverage report
```

### Linting & Formatting
```bash
npm run lint         # ESLint
npx prettier --check .  # Check formatting
npx prettier --write .  # Fix formatting
```

---

## Key Implementation Details

### Data Fetching (React Router Loaders/Actions)
- **Menu**: `Menu.loader` fetches from API
- **Order Details**: `Order.loader` fetches by ID
- **Create Order**: `CreateOrder.action` validates & submits
- **Update Order**: `UpdateOrder.action` patches priority
- **Menu Caching**: Module-level cache prevents redundant fetches

### State Management (Redux Toolkit)
- **Cart Slice**: Normalized cart items with memoized selectors (`createSelector`)
- **User Slice**: Async thunk for geolocation with typed error handling
- **Typed Hooks**: `useAppDispatch` / `useAppSelector` for type safety

### Type Safety Highlights
- Discriminated union for `Button` props (`to` vs `onClick`)
- Optional fields in `Address` type for partial API responses
- Strict TypeScript config (`verbatimModuleSyntax`, `erasableSyntaxOnly`)

### Path Aliases
```ts
// tsconfig.app.json / vite.config.ts
"@/*": ["src/*"]
```
Usage: `import Button from '@/ui/Button'`

---

## API Integration

### Pizza API (`react-fast-pizza-api.jonas.io`)
- `GET /menu` — List all pizzas
- `GET /order/:id` — Get order details
- `POST /order` — Create new order
- `PATCH /order/:id` — Update order (priority)

### Geocoding API (`bigdatacloud.net`)
- Reverse geocode: `latitude` + `longitude` → address components

---

## Deployment

### Netlify (Current)
1. Connect repository to Netlify
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Add environment variable: `VITE_API_URL`

### Other Platforms
The build outputs static assets to `dist/` — compatible with any static hosting (Vercel, Cloudflare Pages, GitHub Pages, etc.)

---

## Scripts Reference

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Type-check + production build |
| `npm run preview` | Preview built app |
| `npm run lint` | Run ESLint |
| `npm run test` | Vitest watch mode |
| `npm run test:run` | Vitest CI mode |
| `npm run test:ui` | Vitest visual UI |
| `npm run test:coverage` | Coverage report |

---

## License

MIT — Feel free to use for learning or as a project starter.