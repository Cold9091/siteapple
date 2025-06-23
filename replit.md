# DigitalPrime E-commerce Application

## Overview

DigitalPrime is a modern full-stack e-commerce application built for selling premium digital products in Angola. The application features a sleek, Apple-inspired design with a Node.js/Express backend, React frontend, and PostgreSQL database using Drizzle ORM.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with Radix UI components
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state management, custom hooks for local state
- **Build Tool**: Vite with ESM modules
- **UI Components**: Comprehensive shadcn/ui component library with Apple-inspired design

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ESM modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Management**: Express sessions with PostgreSQL store
- **Development**: Hot reloading with tsx

### Data Storage
- **Database**: PostgreSQL via Neon Database
- **ORM**: Drizzle ORM with type-safe schema definitions
- **Migration**: Drizzle Kit for schema migrations
- **Local Storage**: Browser localStorage for cart persistence

## Key Components

### Database Schema
Located in `shared/schema.ts`:
- **Users Table**: Authentication with username/password
- **Products Table**: Product catalog with pricing in Angolan Kwanza (AOA)
- **Validation**: Zod schemas for runtime type validation

### Frontend Components
- **Navigation**: Apple-inspired navigation with mega menus and search overlay
- **Product Display**: Featured products grid with shopping cart integration
- **Cart System**: Sidebar cart with quantity management and local persistence
- **UI Library**: Complete set of accessible components (buttons, dialogs, forms, etc.)

### Backend Services
- **Storage Layer**: Abstracted storage interface with in-memory implementation
- **API Routes**: RESTful endpoints for product management
- **Development Server**: Vite integration for hot reloading

## Data Flow

1. **Product Catalog**: Backend serves product data via REST API endpoints
2. **Cart Management**: Frontend manages cart state with localStorage persistence
3. **User Interface**: React components consume product data via TanStack Query
4. **Database Operations**: Drizzle ORM handles type-safe database interactions
5. **Session Management**: Express sessions stored in PostgreSQL

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL client
- **drizzle-orm**: Type-safe ORM with PostgreSQL dialect
- **@tanstack/react-query**: Server state management
- **wouter**: Lightweight React router
- **@radix-ui/***: Accessible UI primitives

### Development Tools
- **Vite**: Fast build tool with HMR
- **TypeScript**: Type safety across the stack
- **Tailwind CSS**: Utility-first styling
- **Replit Integration**: Development environment optimization

## Deployment Strategy

### Production Build
- **Frontend**: Vite builds optimized static assets to `dist/public`
- **Backend**: esbuild bundles server code to `dist/index.js`
- **Database**: Drizzle migrations ensure schema consistency

### Environment Configuration
- **Development**: `npm run dev` - concurrent frontend/backend with HMR
- **Production**: `npm run build && npm run start` - optimized build and server
- **Database**: `npm run db:push` - schema synchronization

### Replit Configuration
- **Modules**: Node.js 20, Web, PostgreSQL 16
- **Auto-deployment**: Configured for autoscale deployment
- **Port Configuration**: Development on 5000, production on 80

## Changelog
```
Changelog:
- June 21, 2025. Initial setup
- June 21, 2025. Removed hero headphone image and applied global blue theme
  * Removed product image from hero section
  * Applied consistent blue gradient background across all sections
  * Added animated background elements throughout the site
  * Updated glassmorphism effects with blue tinting
  * Maintained Apple-inspired design with cohesive color scheme
- June 22, 2025. Enhanced hero section with dynamic product showcase
  * Implemented smooth text animation cycling through different products
  * Added 4-second interval automatic transitions between products
  * Created interactive indicators allowing manual product selection
  * Maintained smooth fade and slide transitions for professional feel
- June 22, 2025. Added elegant loading screen with progressive animation
  * Created 3-second loading screen with "Bem-vindo ao Futuro" message
  * Implemented SVG-based circular progress indicator with gradient colors
  * Added smooth completion animation with expanding rings effect
  * Integrated seamless transition from loading screen to main application
- June 22, 2025. Created animated testimonials section with infinite carousel
  * Added testimonials section below "Tecnologia que inspira" 
  * Implemented infinite horizontal scrolling carousel with 5 customer testimonials
  * Created smooth continuous animation that pauses on hover
  * Included authentic customer data from various Angolan locations
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```