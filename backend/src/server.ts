/**
 * TerraShield AI — Local Development Server
 * Runs standard AWS Lambda handlers locally on port 4000 using Node's native HTTP module.
 */

import http from 'http';
import url from 'url';
import { healthHandler } from './handlers/health';
import { readingsHandler } from './handlers/readings';
import { riskHandler } from './handlers/risk';
import { alertsHandler } from './handlers/alerts';
import { devicesHandler } from './handlers/devices';
import { CORS_HEADERS } from './auth';
import type { ApiGatewayEvent, LambdaResponse } from './types';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;

const server = http.createServer(async (req, res) => {
  // Handle CORS pre-flight
  if (req.method === 'OPTIONS') {
    res.writeHead(200, CORS_HEADERS);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url || '', true);
  const rawPath = parsedUrl.pathname || '';
  const query = parsedUrl.query as Record<string, string>;

  // Collect request body
  const chunks: Buffer[] = [];
  req.on('data', chunk => chunks.push(chunk));
  req.on('end', async () => {
    const rawBody = Buffer.concat(chunks).toString('utf-8');

    // Build event object compatible with AWS API Gateway v2
    const event: ApiGatewayEvent = {
      rawPath,
      headers: req.headers as Record<string, string>,
      queryStringParameters: query,
      body: rawBody || undefined,
      requestContext: {
        http: {
          method: req.method || 'GET',
          path: rawPath,
          sourceIp: req.socket.remoteAddress || '127.0.0.1',
        },
      },
    };

    let response: LambdaResponse;

    try {
      // Normalise paths (support both /api/... and direct /...)
      const cleanPath = rawPath.replace(/^\/api/, '');

      if (cleanPath === '/health') {
        response = await healthHandler(event);
      } else if (cleanPath.startsWith('/readings')) {
        response = await readingsHandler(event);
      } else if (cleanPath.startsWith('/risk')) {
        response = await riskHandler(event);
      } else if (cleanPath.startsWith('/alerts')) {
        response = await alertsHandler(event);
      } else if (cleanPath.startsWith('/devices')) {
        response = await devicesHandler(event);
      } else {
        response = {
          statusCode: 404,
          headers: CORS_HEADERS,
          body: JSON.stringify({ success: false, error: `Route ${req.method} ${rawPath} not found` }),
        };
      }
    } catch (err: any) {
      console.error('Local server error:', err);
      response = {
        statusCode: 500,
        headers: CORS_HEADERS,
        body: JSON.stringify({ success: false, error: 'Internal Server Error' }),
      };
    }

    res.writeHead(response.statusCode, response.headers);
    res.end(response.body);
  });
});

if (process.env.NODE_ENV !== 'test') {
  server.listen(PORT, () => {
    console.log(`[TerraShield AI Backend] Local API server active on http://localhost:${PORT}`);
    console.log(`[TerraShield AI Backend] Endpoints available under /api or root path`);
  });
}

export { server };
