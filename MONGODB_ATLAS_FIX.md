# MongoDB Atlas Connection Issue Fix Guide

Based on the error message you're seeing, your MongoDB Atlas cluster is having connection issues. Here's how to fix it:

## 1. Check Your MongoDB Atlas Cluster Status

1. Log in to your MongoDB Atlas account: https://cloud.mongodb.com
2. Navigate to your cluster
3. Check if the cluster is running (not paused)
4. If it's paused, click "Resume Cluster"

## 2. Verify IP Whitelist Settings

MongoDB Atlas restricts connections to specific IP addresses by default:

1. In MongoDB Atlas, go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. You have two options:
   - Add your current IP address (click "ADD CURRENT IP ADDRESS")
   - Allow access from anywhere (NOT recommended for production):
     - Click "ALLOW ACCESS FROM ANYWHERE"
     - This adds 0.0.0.0/0 to your whitelist

## 3. Verify Database Credentials

1. In MongoDB Atlas, go to "Database Access" in the left sidebar
2. Check if your user "hubCar" exists
3. Verify the password is correct
4. Ensure the user has read/write permissions

## 4. Check Your Connection String

Your current connection string format looks correct:
```
mongodb+srv://hubCar:luis13258@cluster0.lkafneq.mongodb.net/hubcar?retryWrites=true&w=majority
```

Verify:
- Username: hubCar
- Password: luis13258
- Cluster: cluster0.lkafneq.mongodb.net
- Database: hubcar

## 5. Test Connection Locally

Run the diagnostic script to test your connection:
```bash
npx ts-node diagnose-db-connection.ts
```

## 6. For Vercel Deployment

When deploying to Vercel, make sure to:

1. Set the DATABASE_URL environment variable in Vercel:
   - Go to your Vercel project
   - Settings > Environment Variables
   - Add DATABASE_URL with your connection string

2. If you're still having issues, try using Vercel's environment:
   - In MongoDB Atlas, add Vercel's IP addresses to your whitelist
   - Or temporarily allow access from anywhere (0.0.0.0/0) for testing

## Common Error Codes

- **P1001**: Can't reach database server
- **Server selection timeout**: Network connectivity issue

## Need Help?

If you're still having issues:

1. Check MongoDB Atlas status: https://status.mongodb.com/
2. Verify your cluster region matches your Vercel deployment region
3. Contact MongoDB support if the issue persists