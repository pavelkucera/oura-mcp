# Oura MCP Server

This is a pet project to get my hands on making an MCP server and to get access
to my Oura data.

## Supported Functionality

The server provides the following MCP tools that access Oura Ring API endpoints:

- **fetch_daily_sleep_scores** - Retrieves daily sleep scores with contributors
- **fetch_daily_enhanced_tags** - Fetches enhanced tags with tag type codes,
  start days, and custom names
- **fetch_daily_readiness_scores** - Gets daily readiness scores with
  contributors
- **fetch_sleep_information** - Provides detailed sleep information including
  bedtime start/end times

All tools accept `start_date` and `end_date` parameters in ISO date format
(YYYY-MM-DD) and automatically handle pagination to return all available data
for the Range.

## Oura API

The MCP server uses the Oura v2 API, which has rate limiting -- don't go crazy
with this.

## Requirements

* Node.js 22+

## Install

1. Install dependencies
    ```
    npm ci
    ```
2. Get a Personal Access Token https://cloud.ouraring.com/personal-access-tokens
3. Put it into `.env` file in the directory
    ```
    OURA_ACCESS_TOKEN={Your token}
    ```
4. Connect the MCP server with your Claude, replacing path references to the
   path of where you cloned the repository to.
    ```json5
    {
      "mcpServers": {
        "oura": {
          "command": "node",
          "args": [
            "--env-file",
            ".../oura-mcp/.env",          // Update path here!
            "--experimental-strip-types",
            ".../oura-mcp/src/main.ts"    // Update path here!
          ]
        }
      }
    }
    ```

## Access Token

Oura has deprecated the use of personal access tokens and in the future you
might have to get an OAuth access token.
