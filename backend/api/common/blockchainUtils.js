const ether = require("ethers"),
  TronWeb = require("tronweb"),
  { Program } = require("@project-serum/anchor"),
  { SEPOLIA_JSON_RPC_URL, PRIVATE_KEY } = require("../config/env"),
  { ConstantMembers } = require("./members"),
  { SepoliaQueries } = require("../deals/sepolia-deals/deal.queries");

const BlockchainUtils = (() => {
  /**
   * @description Sets up and returns a JSON-RPC provider for Sepolia.
   * @returns {ether.providers.JsonRpcBatchProvider} A JSON-RPC provider for Sepolia.
   */
  const setProviderForSepolia = () =>
    new ether.providers.JsonRpcProvider(SEPOLIA_JSON_RPC_URL);

  const initializeSepoliaContract = (
    contractAddress,
    contractAbi,
    senderPrivKey = null
  ) =>
    new ether.Contract(
      contractAddress,
      contractAbi,
      senderPrivKey ? setSenderWallet(senderPrivKey) : setProviderForSepolia()
    );

  /**
   * @description This function creates a wallet object for sending transactions by using a provided private key and Ethereum provider.
   * @param {string} senderPrivKey - The private key of the sender's wallet.
   * @param {object} provider - The Ethereum provider used to connect to the blockchain.
   * @returns {object} - A wallet object that can be used to sign and send transactions.
   */
  const setSenderWallet = (senderPrivKey) =>
    new ether.Wallet(senderPrivKey, setProviderForSepolia());

  /**
   * @description Instantiates and returns a contract instance for the TRON blockchain with the provided contract address, ABI, and TronWeb object.
   * @param {string} contractAddress - The address of the contract on the TRON blockchain.
   * @param {Array} contractAbi - The ABI (Application Binary Interface) of the contract.
   * @param {Object} tronWebObject - An object containing TronWeb configuration options.
   * @returns {Object} A contract instance for interacting with the specified TRON contract.
   */
  const instantiateTronContract = async (
    contractAddress,
    contractAbi,
    tronWebObject
  ) => await new TronWeb(tronWebObject).contract(contractAbi, contractAddress);

  /**
   * @description Converts a hexadecimal TRON address to its base58 representation using TronWeb.
   * @param {string} address - The hexadecimal TRON address to convert.
   * @param {Object} tronWebObject - An object containing TronWeb configuration options.
   * @returns {string} The base58 representation of the TRON address.
   */
  const fromHex = (address, tronWebObject) =>
    new TronWeb(tronWebObject).address.fromHex(address);

  /**
   * @description Initializes and returns a program instance for a Solana program with the provided IDL (Interface Definition Language), program ID, and provider.
   * @param {Object} IDL - The IDL object describing the program's interface.
   * @param {string} PROGRAM_ID - The Solana program ID.
   * @param {Object} provider - The Solana web3 provider.
   * @returns {Object} A program instance for interacting with the specified Solana program.
   */
  const initializeSolanaProgram = (IDL, PROGRAM_ID, provider) =>
    new Program(IDL, PROGRAM_ID, provider);

  /**
   * @description Creates an event listener for a specific event on a proxy contract instance.
   * @param {ProxyContract} proxyContractInstance - The instance of the proxy contract.
   * @param {string} eventName - The name of the event to listen for.
   * @param {Function} updateDetailsCallback - A callback function to process event arguments and return updated details.
   * @param {string} escrowWallet - The escrow wallet associated with the event.
   */
  const createEventListener = (
    proxyContractInstance,
    eventName,
    updateDetailsCallback,
    escrowWallet
  ) => {
    proxyContractInstance.on(
      eventName,
      async (...args) =>
        await SepoliaQueries.updateDealDetails(updateDetailsCallback(...args), {
          escrow_wallet: escrowWallet,
        })
    );
  };

  /**
   * @description Handles different contract events and returns details based on the event type.
   * @param {string} eventname - The name of the contract event.
   * @param {any[]} args - The arguments associated with the contract event.
   * @returns {object} An object containing details based on the contract event type.
   */
  const handleContractEvent = (eventname, args) => {
    switch (eventname) {
      case ConstantMembers.CONTRACT_EVENTS.SEPOLIA.FUNDED:
        return {
          buyer_wallet: args[0],
          deal_status: ConstantMembers.DEAL_STATUS.FUNDED,
          escrow_amount: args[2].toString(),
          fund_tx_hash: args[3].transactionHash,
        };
      case ConstantMembers.CONTRACT_EVENTS.SEPOLIA.ACCEPTED:
        return {
          seller_wallet: args[1],
          deal_status: ConstantMembers.DEAL_STATUS.ACCEPTED,
          isDealLinkActive: false,
        };
      case ConstantMembers.CONTRACT_EVENTS.SEPOLIA.RELEASE_FUND:
        return {
          released_by: args[0],
          released_amount: args[2].toString(),
          commission_amount: args[3].toString(),
          deal_status: ConstantMembers.DEAL_STATUS.RELEASED,
          release_tx_hash: args[4].transactionHash,
        };
      case ConstantMembers.CONTRACT_EVENTS.SEPOLIA.WITHDRAW:
        return {
          released_by: args[0],
          released_amount: args[2].toString(),
          commission_amount: args[3].toString(),
          deal_status: ConstantMembers.DEAL_STATUS.REFUNDED,
          release_tx_hash: args[4].transactionHash,
          isDealLinkActive: false,
        };
      case ConstantMembers.CONTRACT_EVENTS.SEPOLIA.SIX_MONTHS:
        return {
          released_by: args[0],
          released_amount: args[2].toString(),
          commission_amount: args[2].toString(),
          deal_status: ConstantMembers.DEAL_STATUS.WITHDRAWN_BY_OWNER,
          release_tx_hash: args[3].transactionHash,
          isDealLinkActive: false,
        };
    }
  };

  /**
   * @description Sets up event listeners for various contract events on a new proxy address.
   * @param {string} NewProxyAddress - The address of the new proxy contract.
   * @returns {Promise<void>} A promise that resolves when the event listeners are set up.
   */
  const setupEventListeners = (NewProxyAddress, EscrowAbi) =>
    Object.values(ConstantMembers.CONTRACT_EVENTS.SEPOLIA)
      .filter(
        (eventName) =>
          eventName !==
          ConstantMembers.CONTRACT_EVENTS.SEPOLIA.NEW_PROXY_ADDRESS
      )
      .forEach((eventname) =>
        createEventListener(
          initializeSepoliaContract(NewProxyAddress, EscrowAbi),
          eventname,
          (...args) => handleContractEvent(eventname, args),
          NewProxyAddress
        )
      );

  /**
   * @description Transfers tokens to a specified wallet address using the provided token contract details.
   * @param {string} tokenAddress - The address of the token contract.
   * @param {object} tokenABI - The ABI (Application Binary Interface) of the token contract.
   * @param {string} walletAddress - The recipient wallet address.
   * @param {number} amount - The amount of tokens to transfer.
   * @returns {Promise<number | undefined>} The transaction status code or undefined if an error occurs.
   */
  const transferTokenToAddress = async (
    tokenAddress,
    tokenABI,
    walletAddress,
    amount
  ) => {
    try {
      const contractInstance = initializeSepoliaContract(
        tokenAddress,
        tokenABI,
        PRIVATE_KEY
      );

      return (
        await (
          await contractInstance.transfer(
            walletAddress,
            weiFunctions(
              amount.toString(),
              ConstantMembers.ETHERS_WEI_CONSTANTS.TO_WEI
            )
          )
        ).wait()
      ).status;
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * @description This function is a utility for converting an amount to or from Wei, which is the smallest denomination of Ether in Ethereum.
   * @param {string} amount - The amount to be converted.
   * @param {string} toOrFromWei - A string indicating the direction of conversion, either 'toWei' or 'fromWei'.
   * @returns {string} - The converted amount as a string.
   */
  const weiFunctions = (amount, toOrFromWei) =>
    ether.utils[toOrFromWei](amount).toString();

  return {
    initializeSepoliaContract,
    instantiateTronContract,
    fromHex,
    initializeSolanaProgram,
    setupEventListeners,
    transferTokenToAddress,
  };
})();

module.exports = { BlockchainUtils };
