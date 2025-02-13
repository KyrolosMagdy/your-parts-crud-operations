# CRUD Application

This is a CRUD (Create, Read, Update, Delete) application built with Next.js, TypeScript, and TailwindCSS. It demonstrates full CRUD operations for Posts and Users, with a responsive design.

## Features

- Next.js App Router
- TypeScript
- TailwindCSS for styling
- React Query for data fetching
- Axios for API calls
- ESLint and Prettier for code quality
- Vitest for unit testing
- Storybook for component documentation
- Responsive design
- Form validation using React Hook Form and Zod

## Getting Started

1. Clone the repository:
   \`\`\`
   git clone https://github.com/your-username/crud-application.git
   cd crud-application
   \`\`\`

2. Install dependencies:
   \`\`\`
   bun install
   \`\`\`

3. Run the development server:
   \`\`\`
   bun run dev
   \`\`\`

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Available Scripts

- `bun run dev`: Runs the app in development mode
- `bun run build`: Builds the app for production
- `bun run start`: Runs the built app in production mode
- `bun run lint`: Runs ESLint
- `bun run test`: Runs unit tests with Vitest
- `bun run storybook`: Starts Storybook server
- `bun run build-storybook`: Builds Storybook for deployment

## Folder Structure

\`\`\`
src/
├── app/
│   ├── posts/
│   │   ├── [id]/
│   │   │   └── edit/
│   │   │       └── page.tsx
│   │   ├── new/
│   │   │   └── page.tsx
│   │   └── page.tsx
│   ├── users/
│   │   ├── [id]/
│   │   │   └── edit/
│   │   │       └── page.tsx
│   │   ├── new/
│   │   │   └── page.tsx
│   │   └── page.tsx
│   └── page.tsx
├── components/
│   ├── PostForm.tsx
│   ├── PostList.tsx
│   ├── UserForm.tsx
│   └── UserList.tsx
├── services/
│   └── api.ts
└── styles/
    └── globals.css
\`\`\`

## Deployment

This application can be easily deployed to Vercel. Simply connect your GitHub repository to Vercel and it will automatically deploy your application.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

