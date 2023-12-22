# Escrow Backend

![Project Logo](https://scro.theblockchain.team/static/media/escrowproject-logo.bf84d5bf18f01f60a109.webp)

v2.0.0

[![Node.js](https://img.shields.io/badge/node-%5E14.0.0-green)](https://nodejs.org/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE.md)
[![npm](https://img.shields.io/badge/npm-%5E6.0.0-orange)](https://www.npmjs.com/)

## Overview

Our project introduces a cutting-edge blockchain-based escrow system designed to facilitate secure and transparent transactions between buyers and sellers. Leveraging the power of smart contracts, our system allows users to create and engage in deals with confidence, ensuring that funds are locked in escrow until predetermined conditions are met.

## Key Features

### 1. Deal Creation

- Users can initiate transactions by creating smart contracts that define the terms of the deal.
- Smart contracts encode conditions, ensuring a clear understanding of when funds will be released.

### 2. Funds Locking

- Buyers can securely lock funds in the smart contract, signaling their commitment to the transaction.
- Cryptocurrency or digital assets are held in escrow until specified conditions are satisfied.

### 3. Smart Contract Management

- The heart of our system is a meticulously crafted smart contract that securely manages and holds the funds on behalf of the dealer.
- The smart contract is decentralized, reducing the need for intermediaries and enhancing security.

### 4. Condition Verification

- Conditions for fund release are predefined within the smart contract.
- The blockchain network validates and confirms the fulfillment of these conditions through its decentralized consensus mechanism.

### 5. Automated Funds Release

- Upon successful verification of conditions, the smart contract autonomously releases the locked funds to the dealer.
- This automated process ensures efficiency and minimizes the risk of fraud.

### 6. Transparency and Traceability

- The entire transaction lifecycle is transparent and traceable on the blockchain.
- Participants can verify deal details, conditions, and fund releases by inspecting the smart contract and the blockchain's immutable transaction history.

## Benefits

- **Security:** Utilizes blockchain's cryptographic features to enhance the security of transactions.
- **Efficiency:** Automates the escrow process, reducing the time and complexity of traditional systems.
- **Transparency:** Provides a transparent and auditable record of transactions on the blockchain.

Our blockchain-based escrow system revolutionizes the way transactions are conducted, offering a secure, efficient, and transparent solution for users engaging in deals. The integration of smart contracts ensures that funds are held and released with precision, fostering trust between parties involved in transactions. Experience the future of secure transactions with our innovative escrow system.

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)

# Getting Started

# Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js:** This project is built with Node.js. Make sure you've Node.js installed on your machine. You can download it from [nodejs.org](https://nodejs.org/).

- **npm (Node Package Manager):** npm is the default package manager for Node.js. It is usually included with the Node.js installation. You can check if you have npm installed by running:

  ```bash
  npm -v
  ```

- **MySQL:** This project uses MySQL as the database. Make sure you have MySQL installed and running. You can download MySQL from [mysql.com.](https://www.mysql.com/) Follow the installation instructions for your operating system.

# Installation

Now that you have met the prerequisites, follow these steps to install and run the project:

**Clone with HTTPS:**

```bash
# Clone the repository with HTTPS.
git clone https://github.com/kevalsayar/Escrow2.0.git
```

**Clone with SSH:**

```bash
# Clone the repository with SSH.
git clone git@github.com:kevalsayar/Escrow2.0.git
```

## Navigate to the project directory

```bash
cd backend
```

## Install dependencies

```bash
$ npm install
```

## Configuration

### 1. Environment Variables:

Create a new file named .env in the root of the project. Copy the variable names from the example.env file and populate their values in the .env file.

## Start server

```bash
$ npm start
```

 Open http://localhost:3000 (or the appropriate port) to view the app in your browser.

Note: The development server may run on a different port if port 3000 is already in use. Check the terminal for the correct URL.

## Generate API documentation

```bash
$ npm run gen:doc
```
