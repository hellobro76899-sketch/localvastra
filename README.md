# LocalVastra

A local clothing discovery platform that helps users find nearby clothing shops and products. Connects clothing shop owners (sellers) with customers (users).

## Tech Stack

- **Frontend:** React, Next.js 14 (App Router), TypeScript, Tailwind CSS
- **UI:** shadcn/ui components, Framer Motion
- **Backend:** Next.js API routes
- **Database:** Firebase Firestore
- **Storage:** Firebase Storage
- **Auth:** Firebase Authentication (role-based: User/Seller)
- **Maps:** Google Maps API

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Copy `.env.local.example` to `.env.local` and fill in:

- Firebase config (from Firebase Console > Project Settings)
- Google Maps API key (from Google Cloud Console)

### 3. Firebase Setup

1. Create a project at [Firebase Console](https://console.firebase.google.com)
2. Enable **Authentication** (Email/Password)
3. Create **Firestore Database**
4. Create **Storage** bucket
5. Deploy Firestore rules: `firebase deploy --only firestore:rules`

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Features

- **Homepage:** Hero, search (products & shops), categories, product grid, map
- **Auth:** Signup (User/Seller), Login, Logout, Forgot Password
- **Products:** Browse, filter by category/radius, view details, get directions
- **Shops:** Search, map markers, directions
- **Seller Dashboard:** Add/Edit/Delete products, shop profile, location on map

## Project Structure

```
src/
├── app/           # Next.js App Router pages & API
├── components/    # React components
├── contexts/      # Auth context
├── hooks/         # Custom hooks (toast)
├── lib/           # Utils, Firebase config
└── types/         # TypeScript types
```

## License

MIT
# localvastra
# localvastra
