# Security

## Admin Credentials

The admin panel uses a default username and password for development:

```
Username: admin
Password: lupalearn2024
```

**Before deploying to production, you MUST change these:**

1. Set `ADMIN_USERNAME` and `ADMIN_PASSWORD` in your `.env.local`
2. Set a strong `ADMIN_SECRET` (32+ characters)
3. Optional: Integrate Clerk for role-based authentication

## Environment Variables

- Never commit `.env.local` or `.env` to version control
- Use `.env.example` as a template for required variables
- Rotate API keys regularly

## Reporting Vulnerabilities

Open an issue on GitHub for any security concerns.
