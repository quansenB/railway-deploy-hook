import { Hono } from "hono@4";
import { cors } from "hono/cors";
import { GraphQLClient } from "graphql-request@7";

const app = new Hono();
app.use("/*", cors());

// Initialize GraphQL client
const API_ENDPOINT = "https://backboard.railway.com/graphql/v2";
const client = new GraphQLClient(API_ENDPOINT, {
  headers: {
    Authorization: `Bearer ${import.meta.env.RAILWAY_API_TOKEN}`,
  },
});

// GraphQL mutation to redeploy service instance
const REDEPLOY_MUTATION = `
  mutation serviceInstanceRedeploy($environmentId: String!, $serviceId: String!) {
    serviceInstanceRedeploy(environmentId: $environmentId, serviceId: $serviceId)
  }
`;

app.post("/webhook", async (c) => {
  try {
    const serviceId = c.req.query().serviceId;
    const environmentId = c.req.query().environmentId;

    if (!environmentId || !serviceId) {
      return c.json(
        {
          error: "Missing required query parameters: environmentId, serviceId",
        },
        400
      );
    }

    // Redeploy service instance
    const variables = { environmentId, serviceId };
    const redeployData = await client.request(REDEPLOY_MUTATION, variables);

    if (!redeployData.serviceInstanceRedeploy) {
      return c.json({ error: "Service redeploy failed", redeployData }, 500);
    }

    return c.json(
      {
        success: true,
        message: `Service ${serviceId} redeployed in environment ${environmentId}`,
      },
      200
    );
  } catch (error) {
    console.error("Error:", error.message);
    return c.json({ error: error.message, details: error }, 500);
  }
});

// Health check endpoint
app.get("/health", (c) => c.json({ status: "ok" }));

Bun.serve({
  port: import.meta.env.PORT ?? 3000,
  fetch: app.fetch,
});
