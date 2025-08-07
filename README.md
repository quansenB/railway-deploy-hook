# Railway Deploy Hook

## Overview

This service provides a webhook endpoint that triggers redeployment of Railway services. It uses the Railway GraphQL API and is designed to be deployed as a Railway Function.

## Setup & Deployment

### 1. Create Railway Function

1. Go to [Railway](https://railway.app) and log in
2. Create a new project or select an existing one
3. Click "New" → "Function"

### 2. Add Code

Copy the entire contents of the `index.js` file from this repository and paste it into your Railway Function:

### 3. Configure Environment Variable

1. Go to the "Variables" tab in your Railway Function
2. Add a new variable:
   - **Name**: `RAILWAY_API_TOKEN`
   - **Value**: Your Railway API Token

#### Creating a Railway API Token

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click on your profile (top right) → "Account Settings"
3. Navigate to "Tokens" in the sidebar
4. Click "Create New Token"
5. Give the token a name (e.g., "Deploy Hook")
6. Copy the generated token and add it as the `RAILWAY_API_TOKEN` variable

### 4. Deploy Function

1. Click "Deploy" in your Railway Function
2. Wait for the deployment to complete
3. Copy the URL of your deployed Function

## Usage

### Calling the Webhook

Send a POST request to your webhook endpoint with the required query parameters:

```http
POST https://your-function-subdomain.railway.app/webhook?environmentId=ENVIRONMENT_ID&serviceId=SERVICE_ID
```

#### Parameters

- `environmentId`: The ID of the Railway environment where the service is located
- `serviceId`: The ID of the Railway service to redeploy

#### Example Request

```bash
curl -X POST "https://your-function-url.railway.app/webhook?environmentId=c3b077f3-feb0-448f-80b4-ccdae37a6fb5&serviceId=952f84ee-e0e7-4c76-92df-88e3cfe52e0d"
```

### Finding Service and Environment IDs

1. Go to your Railway project
2. Select the desired environment
3. Click on the service you want to deploy
4. Go to "Settings" → "General"
5. You'll find the IDs under "Service ID" and "Environment ID"

### Health Check

Check if your service is running:

```bash
curl https://your-function-url.railway.app/health
```

Expected response:

```json
{
  "status": "ok"
}
```

## API Responses

### Successful Request

```json
{
  "success": true,
  "message": "Service 952f84ee-e0e7-4c76-92df-88e3cfe52e0d redeployed in environment c3b077f3-feb0-448f-80b4-ccdae37a6fb5"
}
```

### Bad Request

```json
{
  "error": "Missing required query parameters: environmentId, serviceId"
}
```

### Server Error

```json
{
  "error": "Error message",
  "details": "Detailed error information"
}
```

## Automation

You can integrate this webhook into various CI/CD pipelines or automation tools:

- **GitHub Actions**: Call the webhook after successful tests
- **Zapier/Make**: Connect with other services
- **Cron Jobs**: Schedule regular deployments
- **Monitoring Tools**: Trigger deployments based on metrics

## Troubleshooting

### Common Issues

1. **401 Unauthorized**: Check your `RAILWAY_API_TOKEN`
2. **400 Bad Request**: Make sure both query parameters (`environmentId` and `serviceId`) are present
3. **500 Internal Server Error**: Check the logs in your Railway Function

### Viewing Logs

1. Go to your Railway Function
2. Click on the "Deployments" tab
3. Click on the current deployment
4. Scroll to the "Logs" to diagnose errors

## Security

- ⚠️ Keep your `RAILWAY_API_TOKEN` secret
- 🔒 The token has access to your entire Railway account
- 🛡️ Consider implementing authentication for the webhook endpoint in production environments

## Support

For issues or questions:

1. Check the Railway Function logs
2. Make sure all environment variables are set correctly
3. Verify that the service and environment IDs are correct

---

**Note**: This service uses the Railway GraphQL API v2. Make sure your API token has the necessary permissions for service deployments.