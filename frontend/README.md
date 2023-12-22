# Escrow Frontend

![Project Logo](https://scro.theblockchain.team/static/media/escrowproject-logo.bf84d5bf18f01f60a109.webp)

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/react-%5E17.0.1-blue)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/node-%5E14.0.0-green)](https://nodejs.org/)
[![npm](https://img.shields.io/badge/npm-%5E6.0.0-orange)](https://www.npmjs.com/)

# Description

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

# Table of Contents

- [Getting Started](#getting-started)

  - [Prerequisites](#prerequisites)
  - [Installation](#installation)

# Getting Started

# Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js and npm:** React applications are typically built and managed using Node.js and npm. Download and install Node.js, which includes npm.

  - [Download Node.js](https://nodejs.org/)

  Verify the installation by running the following commands in the terminal:

  ```bash
  node -v
  npm -v
  ```

- **Code Editor:** You will need a code editor for working with React.js code. Popular choices include Visual Studio Code, Atom, or Sublime Text.
  - [Download Visual Studio Code](https://code.visualstudio.com/)

- **Git:** Git is commonly used for version control. You will need Git installed to clone the repository and contribute changes.
  - [Download Git](https://git-scm.com/)

    Verify the installation by running:
    ```bash
    git --version
    ```
- **Blockchain Wallet Extensions:** 
  - MetaMask (For Ethereum):

    - Install the MetaMask extension for your browser.
      - [Metamask for Chrome](https://metamask.io/download/)
      
  - Phantom (For Solana):
  
    - Install the Phantom extension for your browser.
       - [Phantom for Chrome](https://phantom.app/download)

  - TronLink (For TRON):

    - Install the TronLink extension for your browser.
       - [TronLink for Chrome](https://www.tronlink.org/)

# Installation

Now that you have met the prerequisites, follow these steps to install and run the project:

1. Clone the repository:

    - **Clone with HTTPS:**

        ```bash
        git clone https://github.com/kevalsayar/Escrow2.0.git
        ```
        
    **OR**

    - **Clone with SSH:**

        ```bash
        git clone git@github.com:kevalsayar/Escrow2.0.git
        ```

2. Navigate to the project directory:

    ```bash
    cd frontend
    ```
3. Install dependencies

    ```bash
    $ npm install
    ```

4. Configuration

    1. Environment Variables:

        Create a new file named .env in the root of the project. Copy the variable names from the example.env file and populate their values in the .env file.

5. Start server

    ```bash
    $ npm start
    ```
    Open http://localhost:3000 (or the appropriate port) to view the app in your browser.

    Note: The development server may run on a different port if port 3000 is already in use. Check the terminal for the correct URL.