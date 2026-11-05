#!/usr/bin/env bash

# Legacy development helper; uses an older endpoint and authentication method.
curl -X POST \
  -H "Authorization: Bearer $WAKE_API_TOKEN" \
  https://bmc.corasfein.com/wake