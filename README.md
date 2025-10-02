# ISB Medical Society Website

A modern full-stack web application for the ISB Medical Society featuring a React frontend and Express backend.

## Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite build tool  
- TailwindCSS + Shadcn/ui components
- TanStack Query for data fetching
- Wouter for routing

**Backend:**
- Node.js + Express
- PostgreSQL database
- Drizzle ORM
- Express sessions with PostgreSQL store
- Image processing with Sharp

## Prerequisites

- Node.js 20 or higher
- PostgreSQL database

## Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env` file based on `.env.example`:
   ```bash
   DATABASE_URL=postgresql://user:password@localhost:5432/dbname
   SESSION_SECRET=your-secret-key-here
   SENDGRID_API_KEY=your-sendgrid-key (optional)
   NODE_ENV=development
   PORT=5000
   ```

3. **Run database migrations:**
   ```bash
   npm run db:push
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

   The app will be available at http://localhost:5000

## Production Deployment

### Frontend (Vercel)

1. **Connect your GitHub repo to Vercel**

2. **Configure build settings:**
   - Build Command: `npm run build`
   - Output Directory: `dist/public`
   - Install Command: `npm install`

3. **Environment Variables:** Not needed for frontend

4. **Deploy:** Vercel will automatically deploy on push to main

### Backend (Render)

1. **Create a new Web Service on Render**

2. **Configure service:**
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Environment: Node

3. **Add environment variables:**
   ```
   DATABASE_URL=<your-render-postgres-url>
   SESSION_SECRET=<generate-a-secure-secret>
   SENDGRID_API_KEY=<your-sendgrid-key>
   NODE_ENV=production
   PORT=5000
   ```

4. **Database Setup:**
   - Create a PostgreSQL database on Render
   - Copy the Internal Database URL to DATABASE_URL
   - Run migrations: `npm run db:push`

5. **Deploy:** Render will automatically build and deploy

### Admin Access

- Default admin credentials:
  - Username: `admin`
  - Password: `password`
  - **Important:** Change these in production!

## Project Structure

```
├── client/          # React frontend
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── pages/       # Page components
│   │   └── lib/         # Utilities
├── server/          # Express backend
│   ├── routes.ts    # API routes
│   ├── storage.ts   # Data access layer
│   ├── db.ts        # Database connection
│   └── index.ts     # Server entry
├── shared/          # Shared types/schemas
└── public/          # Static assets & uploads
```

## Features

- Content management system for news and programs
- Member directory with image optimization
- Hero image carousel
- Admin dashboard
- Email integration (SendGrid)
- Responsive design with dark mode

## License

MIT
