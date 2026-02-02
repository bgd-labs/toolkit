import { Polly } from "@pollyjs/core";
import FetchAdapter from "@pollyjs/adapter-fetch";
import FSPersister from "@pollyjs/persister-fs";
import { beforeAll, afterAll, afterEach } from "vitest";

// Register adapters and persisters globally
Polly.register(FetchAdapter);
Polly.register(FSPersister);

let polly: Polly | null = null;

function getFilename(filePath) {
  // Handle empty or invalid input
  if (!filePath || typeof filePath !== 'string') {
    return '';
  }

  // Get the last part of the path (filename with extension)
  const parts = filePath.split('/');
  const filenameWithExt = parts[parts.length - 1];

  // Remove the extension(s)
  // This handles cases like 'verified.spec.ts' -> 'verified'
  const firstDotIndex = filenameWithExt.indexOf('.');

  if (firstDotIndex === -1) {
    // No extension found
    return filenameWithExt;
  }

  // Return everything before the first dot
  return filenameWithExt.substring(0, firstDotIndex);
}

// Global setup - runs once before all tests
beforeAll(async (context) => {
  // Generate a unique name based on the test file path
  const name = context.name && getFilename(context.name) || "unknown";

  polly = new Polly(name, {
    adapters: ["fetch"],
    persister: "fs",
    // Record if missing in local env, replay only in CI
    recordIfMissing: !process.env.CI,
    recordFailedRequests: true,
    mode: process.env.CI ? "replay" : "record",
    matchRequestsBy: {
      method: true,
      headers: false,
      body: true, // Match by body content instead of URL
      order: true,
      url: false, // Don't match by URL since we're redacting it
    },
  });

  // Sanitize API keys before persisting recordings
  polly.server.any().on("beforePersist", (req, recording) => {
    // rpc url redactor
    if(recording.request.postData?.text?.includes('"method":"eth_')) {
      recording.request.url = "https://redacted-rpc-endpoint.example.com/redacted";
    }

    // Remove API keys from query parameters
    if (recording.request.queryString) {
      recording.request.queryString = recording.request.queryString.map((param) => {
        if (param.name === 'apikey' || param.name === 'apiKey' || param.name === 'api_key') {
          return { ...param, value: 'REDACTED_API_KEY' };
        }
        return param;
      });
    }

    // Remove API keys from the URL string itself
    if (recording.request.url) {
      recording.request.url = recording.request.url
        .replace(/([?&])(apikey|apiKey|api_key)=([^&]+)/gi, '$1$2=REDACTED_API_KEY');
    }

    // Remove API keys from headers
    if (recording.request.headers) {
      recording.request.headers = recording.request.headers.map((header) => {
        const lowerName = header.name.toLowerCase();
        if (lowerName === 'authorization') {
          return { ...header, value: 'REDACTED_AUTHORIZATION' };
        }
        if (lowerName === 'x-api-key') {
          return { ...header, value: 'REDACTED_API_KEY' };
        }
        if (lowerName === 'x-access-key') {
          return { ...header, value: 'REDACTED_API_KEY' };
        }
        return header;
      });
    }
  });
});

// Flush after each test to ensure recordings are saved
afterEach(async () => {
  if (polly) {
    await polly.flush();
  }
});

// Global teardown - runs once after all tests
afterAll(async () => {
  if (polly) {
    await polly.stop();
    polly = null;
  }
});

// Export polly instance for advanced usage in tests
export function getPolly() {
  return polly;
}
