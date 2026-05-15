# ZamAdmit

Zambia's centralised digital admissions platform for higher learning institutions.

> **CBU CS400 Final Year Project** · Emmanuel Siamoonga

---

## Tech Stack

- **Next.js 15** (App Router) + **React 19**
- **TypeScript** (strict mode)
- **Tailwind CSS** with a custom design token system
- **shadcn/ui** primitives built on Radix UI
- **React Hook Form** + **Zod** for forms and validation
- **lucide-react** for icons

## Getting Started

### Prerequisites
- **Node.js 18.18+** (or 20+)
- **npm** (or pnpm / yarn)

### Setup

```bash
# Install dependencies
npm install

# Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Other commands

```bash
npm run build       # Production build
npm run start       # Run the production build
npm run lint        # Lint
npm run type-check  # TypeScript without emit
```

---

## Project Structure

```
zamadmit/
├── app/                              # Next.js App Router
│   ├── layout.tsx                    # Root layout (fonts, metadata)
│   ├── (public)/                     # Public route group
│   │   ├── layout.tsx                # PublicNavbar + PublicFooter
│   │   ├── page.tsx                  # Landing page
│   │   ├── login/
│   │   ├── register/
│   │   ├── institutions/[slug]/
│   │   └── programmes/[slug]/
│   ├── (applicant)/                  # Applicant portal
│   │   ├── layout.tsx                # AppShell wrapper
│   │   ├── dashboard/
│   │   ├── profile/
│   │   ├── discover/
│   │   ├── recommendations/
│   │   ├── applications/[id]/
│   │   ├── apply/[programmeSlug]/
│   │   ├── documents/
│   │   └── notifications/
│   └── (institution)/                # Institution admin portal
│       └── institution/
│           ├── dashboard/
│           ├── programmes/
│           ├── applications/[id]/
│           └── decisions/
│
├── components/
│   ├── ui/                           # shadcn primitives (Button, Input, Card…)
│   ├── layout/                       # Logo, Navbar, Sidebar, Topbar, Shells
│   ├── landing/                      # One file per landing-page section
│   ├── shared/                       # Domain components (StatusBadge, …)
│   └── forms/                        # React Hook Form components
│
├── lib/
│   ├── utils.ts                      # cn() helper
│   ├── routes.ts                     # Centralised route map
│   ├── format.ts                     # Status labels, date/byte formatters
│   ├── mock-data.ts                  # In-memory data (swap for API later)
│   └── schemas/
│       └── auth.ts                   # Zod schemas for forms
│
├── types/
│   └── domain.ts                     # Institution, Programme, Application, …
│
└── styles/
    └── globals.css                   # Tailwind + shadcn HSL tokens
```

### Routing groups

The three `(group)` folders separate concerns without affecting URLs:

- **`(public)`** — marketing pages, login, register
- **`(applicant)`** — student portal (auth required, eventually)
- **`(institution)`** — admin portal (different role, different shell)

Each group has its own `layout.tsx`, so the navbar/sidebar/footer are decided once at the group level — never repeated per page.

---

## Design System

### Colour tokens

All colours live in `tailwind.config.ts`. **Do not hardcode hex values in components.**

| Token            | Hex         | Use                         |
|------------------|-------------|-----------------------------|
| `brand-600`      | `#1B6B3A`   | Primary brand colour        |
| `brand-700`      | `#155730`   | Hover / pressed state       |
| `brand-50`       | `#F0FAF4`   | Soft backgrounds            |
| `ink`            | `#0F1C14`   | Primary text                |
| `ink-50`         | `#5C6B62`   | Secondary text              |
| `ink-30`         | `#94A19A`   | Disabled / placeholder      |
| `ink-10`         | `#E5EBE7`   | Borders                     |
| `surface`        | `#FFFFFF`   | Page background             |
| `surface-subtle` | `#FAFCFB`   | Section background          |
| `success`        | `#1B6B3A`   | Accepted, verified          |
| `warning`        | `#E07B39`   | Under review                |
| `info`           | `#4F46E5`   | Submitted                   |
| `danger`         | `#B91C1C`   | Rejected, errors            |

### Typography

- **DM Serif Display** (`font-display`) — H1, H2, hero titles, large numbers
- **DM Sans** (`font-sans`) — everything else

Type scale presets: `text-display-2xl` (72px) → `text-display-sm` (26px).

### Spacing & radius

- Base unit: 4px (Tailwind's default)
- Border radius: 10px (`--radius`), within the 8–12px brief
- Cards use `shadow-card`; floating elements use `shadow-elevate`

### Adding a new colour

1. Add it to `tailwind.config.ts` under `theme.extend.colors`
2. Use it as a Tailwind class: `bg-your-colour-500`

---

## Components

### When to create a new component

- **Used in 2+ places** → put in `components/shared/`
- **Used only in one section** → keep it inline or alongside that section
- **Generic UI primitive** → `components/ui/` (follow shadcn pattern)
- **Page-level layout** → `components/layout/`

### Forms

All forms use **React Hook Form + Zod**:

```tsx
const schema = z.object({ email: z.string().email() });
const form = useForm({ resolver: zodResolver(schema) });
```

Use the `<Form>`, `<FormField>`, `<FormItem>`, `<FormLabel>`, `<FormControl>`, `<FormMessage>` primitives in `components/ui/form.tsx`. They handle accessibility (aria-describedby, aria-invalid) automatically.

### Routing

Use `ROUTES.x` from `lib/routes.ts`, **never** hardcode paths:

```tsx
import { ROUTES } from '@/lib/routes';

<Link href={ROUTES.dashboard}>Dashboard</Link>
<Link href={ROUTES.application(app.id)}>View</Link>
```

---

## What's Built

### Phase 1 — Foundation
- [x] Design tokens (colours, typography, spacing, shadows)
- [x] shadcn/ui primitives: Button, Input, Label, Card, Badge, Avatar, Separator, Progress, Form
- [x] Layout components: Logo, PublicNavbar, PublicFooter, Sidebar, AppTopbar, AppShell, AuthShell, PageHeader
- [x] Shared components: StatusBadge, StatCard, InstitutionCard, ApplicationRow, OfferCard

### Phase 2 — First pages
- [x] **Landing page** — hero, impact strip, how-it-works, audience panels, featured institutions, testimonials, FAQ, CTA banner
- [x] **Login page** — split-screen with brand panel + RHF form
- [x] **Register page** — same layout, full validation (incl. NRC format)
- [x] **Applicant Dashboard** — KPI cards, recent applications, offer card, profile completion, quick actions

### Phase 3 — Coming next
- [ ] Institutions listing + filters
- [ ] Institution details page
- [ ] Programmes listing + details
- [ ] Multi-step Apply flow
- [ ] Recommendations page
- [ ] Documents upload page
- [ ] Profile page (multi-section)
- [ ] Notifications
- [ ] Institution portal pages

---

## Future Backend Integration

The mock data in `lib/mock-data.ts` mirrors the eventual database schema in `types/domain.ts`. To swap for a real API:

1. Replace `mock-data.ts` exports with `async` functions that call your API
2. Mark page components as `async` and `await` the data
3. **Zero component changes required** — the types stay the same

---

## License

Academic project — Copperbelt University, School of ICT.
