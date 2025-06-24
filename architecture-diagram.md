# Lupisori Web Application Architecture

```
                                   ┌─────────────────┐
                                   │                 │
                                   │  Client Browser │
                                   │                 │
                                   └────────┬────────┘
                                            │
                                            │ HTTP Requests
                                            │ (Port 81)
                                            ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                           Docker Network                                │
│                                                                         │
│  ┌─────────────────────────────────┐                                    │
│  │                             │                                    │
│  │  Nginx (Port 80)            │                                    │
│  │  Load Balancer + Cache      │                                    │
│  │  ┌─────────────────────┐   │                                    │
│  │  │ Movie Cache Storage │   │                                    │
│  │  └─────────────────────┘   │                                    │
│  │                             │                                    │
│  └───────────────┬─────────────┘                                    │
│                │                                                      │
│                │ Proxy Requests                                       │
│                │                                                      │
│                ▼                                                      │
│  ┌───────────────────────────────────────────────────────────┐         │
│  │                                                           │         │
│  │                 Node.js Application Instances             │         │
│  │                                                           │         │
│  │  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐   │         │
│  │  │             │    │             │    │             │   │         │
│  │  │    app1     │    │    app2     │    │    app3     │   │         │
│  │  │  (Port 3000)│    │  (Port 3000)│    │  (Port 3000)│   │         │
│  │  │             │    │             │    │             │   │         │
│  │  └──────┬──────┘    └──────┬──────┘    └──────┬──────┘   │         │
│  │         │                  │                  │          │         │
│  └─────────┼──────────────────┼──────────────────┼──────────┘         │
│            │                  │                  │                    │
│            │                  │                  │                    │
│            │                  ▼                  │                    │
│            │          ┌───────────────┐          │                    │
│            │          │               │          │                    │
│            └─────────▶│   MongoDB     │◀─────────┘                    │
│                       │  (Port 27017) │                               │
│                       │               │                               │
│                       └───────────────┘                               │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

## Key Components

1. **Client Browser**: Sends HTTP requests to the application
2. **Nginx Load Balancer with Cache**: 
   - Distributes incoming requests across multiple Node.js instances
   - Caches movie API responses based on URL parameters
   - Stores cache in a persistent volume
3. **Node.js Application Instances**: Three identical instances of the application
4. **MongoDB**: Database for storing movie data
5. **Docker Network**: Bridge network connecting all components

## Request Flow

1. Client sends HTTP request to Nginx (Port 81)
2. For movie API requests:
   - Nginx checks if the response is in the cache
   - If cached and valid, Nginx returns the cached response immediately
   - If not cached or expired, Nginx routes the request to a Node.js instance
3. For other API requests:
   - Nginx routes the request to one of the Node.js instances using round-robin load balancing
4. Node.js instance processes the request, interacting with MongoDB if needed
5. For cacheable responses:
   - Nginx caches the response before sending it to the client
   - Cache key includes the full URL with parameters
6. Response is sent back to the client

## External Port Mapping

- Nginx: 81:80
- Node.js Instances: 3001:3000, 3002:3000, 3003:3000
- MongoDB: 27018:27017
