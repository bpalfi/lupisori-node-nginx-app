#!/bin/bash

# Script to test the Nginx load balancer
# It makes multiple requests to the health endpoint and displays which instance handled each request

echo "Testing load balancer with multiple requests to /health endpoint..."
echo "Press Ctrl+C to stop"
echo ""

counter=1

while true; do
  echo "Request $counter:"
  response=$(curl -s http://localhost/health)
  status=$(echo $response | grep -o '"status":"ok"')
  hostname=$(echo $response | grep -o '"hostname":"[^"]*"' | cut -d'"' -f4)

  if [ -n "$status" ] && [ -n "$hostname" ]; then
    echo "Status: OK, Handled by: $hostname"
  else
    echo "Error: Could not parse response"
  fi

  echo ""
  counter=$((counter+1))
  sleep 1
done
