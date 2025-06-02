# Ripple Blockchain REST API

A TypeScript Node.js RESTful API for interacting with the Ripple blockchain.

## Features

- Generate test wallets
- Fund test wallets
- Get wallet information
- Get transaction history

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the root directory with the following variables:

```
PORT=3001
RIPPLE_NODE_URL=wss://s.altnet.rippletest.net:51233
FAUCET_URL=https://faucet.altnet.rippletest.net/accounts
```

3. Build the project:

```bash
npm run build
```

4. Start the server:

```bash
npm start
```

For development:

```bash
npm run dev
```

## API Endpoints

### Generate Wallet

- **POST** `/api/ripple/wallet/generate`
- Generates a new test wallet
- Response: `{ success: true, data: { address: string, seed: string } }`

### Fund Wallet

- **POST** `/api/ripple/wallet/:address/fund`
- Funds a test wallet with XRP
- Response: `{ success: true, data: { address: string, balance: string } }`

### Get Wallet Info

- **GET** `/api/ripple/wallet/:address`
- Gets information about a wallet
- Response: `{ success: true, data: { address: string, balance: string, sequence: number } }`

### Get Transaction History

- **GET** `/api/ripple/wallet/:address/transactions`
- Gets the transaction history for a wallet
- Response: `{ success: true, data: Transaction[] }`

## Error Handling

All endpoints return a consistent error format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error message"
  }
}
```

## Development

- Run tests: `npm test`
- Lint code: `npm run lint`
- Build: `npm run build`
- Development mode: `npm run dev`
