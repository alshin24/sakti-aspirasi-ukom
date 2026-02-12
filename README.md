# SAKTI - Sarana Aspirasi Komunikasi Terpadu Intra-sekolah

Production-ready platform for school aspiration management using Next.js, TypeScript, Tailwind CSS, shadcn/ui, and Supabase.

## Prerequisites

- Node.js 18+ and pnpm
- Supabase account
- Modern browser

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd sakti-aspirasi
pnpm install
```

### 2. Set Up Supabase Database

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** in your Supabase Dashboard
3. Copy the entire contents of `schema.sql`
4. Paste and run the SQL script
5. Verify tables created: `profiles`, `aspirasi`, `feedback`

### 3. Configure Environment Variables

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Get these values from Supabase Dashboard > Settings > API

### 4. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

## Creating Test Accounts

### Murid (Student)

1. Go to `/signup`
2. Fill in: NIS, Nama, Email, Password
3. Submit (default role will be `murid`)

### Admin

1. Create a murid account first via signup
2. Go to Supabase Dashboard > Table Editor > profiles
3. Find the user by email
4. Update `role` column to `'admin'`

### Master

Same as Admin, but update `role` to `'master'`

## Testing Workflow

1. **Sign up** as a new murid
   - Verify profile created with NIS and nama
   - Default role should be `murid`

2. **Login** as murid
   - Should redirect to `/murid`
   - Stats should show zeros (no aspirasi yet)
   - Charts should show empty state

3. **Submit aspirasi**:
   - Go to "Kirim Aspirasi"
   - Select category (fasilitas, akademik, etc.)
   - Fill title, content, optional location
   - Submit → status should be `pending`

4. **Login as admin**:
   - Should redirect to `/admin`
   - See all aspirasi from all users
   - Approve or reject aspirasi
   - Add feedback

5. **Login as master**:
   - Should redirect to `/master`
   - See system-wide stats
   - Manage admins (promote/demote)

## Project Structure

```
app/
├── (auth)/         # Login & Signup pages
├── murid/          # Student dashboard
├── admin/          # Admin dashboard
├── master/         # Master dashboard
└── page.tsx        # Landing page

components/
├── auth/           # Authentication forms
├── sidebar/        # Navigation components
├── dashboard/      # Dashboard-specific components
├── aspirasi/     # Aspirasi CRUD components
├── charts/         # Chart components
└── ui/             # shadcn components

lib/
├── supabase/
│   ├── client.ts   # Supabase client
│   └── queries.ts  # All database queries
└── utils.ts
```

## Database Schema

### profiles
- `id` (uuid) - Links to auth.users
- `nis` (varchar) - Student ID number
- `nama` (varchar) - Full name
- `kelas` (varchar) - Student class (e.g., "10 IPA 1")
- `email` (varchar) - Email address
- `role` (enum) - murid | admin | master

### aspirasi
- id, submitter_id, category, title, content, location
- `status` (enum) - pending | approved | rejected

### feedback
- id, aspirasi_id, admin_id, content, created_at

## Key Features

- ✅ Role-based authentication (murid, admin, master)
- ✅ NIS-based signup
- ✅ Real-time data from Supabase
- ✅ Aspirasi submission and management
- ✅ Admin approval/rejection workflow
- ✅ Feedback system
- ✅ Charts for data visualization
- ✅ Responsive design
- ✅ Production-ready code

## Development Notes

- No gradients or heavy shadows (minimalist design)
- All queries in `lib/supabase/queries.ts` (no inline SQL)
- Components are modular and separated
- Default Tailwind colors only
- Empty states when no data exists

## Troubleshooting

**Login not working?**
- Check `.env.local` exists with correct values
- Verify Supabase project is active
- Check browser console for errors

**Profile not created?**
- Verify trigger `on_auth_user_created` exists
- Check RLS policies are enabled
- Manually insert profile if needed

**Aspirasi not showing?**
- Check RLS policies allow SELECT
- Verify user is logged in
- Check browser network tab

## License

MIT
