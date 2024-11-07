# API Documentation for Developers

## Introduction
The PiStable API provides developers with the tools to interact with the PiStable smart contracts and integrate the stablecoin functionality into their applications. This document outlines the available endpoints, request formats, and response structures.

## Base URL

[https://api.pistable.com/v1](https://api.pistable.com/v1) 


## Authentication
All API requests require an API key. Include your API key in the request headers:

```
Authorization: Bearer YOUR_API_KEY
```


## Endpoints

### 1. Get StableCoin Balance
- **Endpoint**: `/balance`
- **Method**: `GET`
- **Parameters**:
  - `address` (string): The wallet address to check the balance for.
- **Response**:
   ```json
   1 {
   2   "address": "0x1234567890abcdef",
   3   "balance": "100.00"
   4 }
   ```

2. Transfer StableCoin
- **Endpoint**: /transfer
- **Method**: POST
- **Request Body**:
   ```json
   1 {
   2   "from": "0x1234567890abcdef",
   3   "to": "0xfedcba0987654321",
   4   "amount": "10.00"
   5 }
   ```

- Response
{
  "transactionId": "0xabcdef1234567890",
  "status": "success"
}
