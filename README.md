This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Database

This project uses Neon Postgres for user authentication and data persistence.

## Configuration

To run this project, you need to set up the following environment variables. Copy `.env.example` to `.env.local` and fill in the values:

- `GEMINI_API_KEY`: Your Google Gemini API Key.
- `GOOGLE_PROJECT_ID`: Your Google Cloud Project ID.
- `GOOGLE_LOCATION`: Google Cloud region (e.g., `us-central1`).
- `GCS_BUCKET_NAME`: Google Cloud Storage bucket name for temporary images/videos.
- `GOOGLE_APPLICATION_CREDENTIALS_JSON`: JSON content of your Service Account Key (for Veo/Vertex AI access).
- `POSTGRES_URL`: Connection string for your Neon Database.
- `RESEND_API_KEY`: (Optional) For email notifications.

## Troubleshooting

Run `node scripts/verify-full-env.js` to check if your environment is correctly configured.

## Repository Cleanup

During development the project generates a number of log and debug files at the repository root (e.g. `debug_*.txt`, `test_output*.txt`, `models_list.txt`). These are not part of the application and are ignored by Git.

A helper script is available to archive or remove them:

```bash
npm run cleanup           # moves matching files into a `logs/` directory
npm run cleanup -- --delete  # permanently deletes them instead
```

The `logs/` folder itself is gitignored so you can run the task freely.

