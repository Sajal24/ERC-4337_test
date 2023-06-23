const { ethers } = require("ethers");
const HDWalletProvider = require("@truffle/hdwallet-provider");
const SmartAccount = require("@biconomy/smart-account").default;
const { ChainId, Environments } = require("@biconomy/core-types");
const { ERC_721_ABI } = require("./constants");
require("dotenv").config();
// const config = require("../config.json");

const batchMintNft = async () => {
  let provider = new HDWalletProvider(
    process.env.PRIVATE_KEY,
    process.env.RPC_URL
  );
  const walletProvider = new ethers.providers.Web3Provider(provider);
  // create SmartAccount instance
  const wallet = new SmartAccount(walletProvider, {
    activeNetworkId: process.env.CHAIN_ID,
    supportedNetworksIds: [ChainId.GOERLI, ChainId.POLYGON_MUMBAI],
    networkConfig: [
      {
        chainId: process.env.CHAIN_ID,
        dappAPIKey: process.env.DAPP_API_KEY,
      },
    ],
  });
  const smartAccount = await wallet.init();

  //   const nftInterface = new ethers.utils.Interface([
  //     "function safeMint(address _to)",
  //   ]);
  //   const data = nftInterface.encodeFunctionData("safeMint", [
  //     smartAccount.address,
  //   ]);

  const erc721Interface = new ethers.utils.Interface(ERC_721_ABI);
  const data = erc721Interface.encodeFunctionData("safeMint", [
    "0xea6a5858e05d74173ad58f8843b59e98c971aa5d",
    2,
    uri,
  ]);
  const nftAddress = "0xc83b0bD814D82e20D769f9a632C33E6c468a1F53";

  const txs = [];
  const tx1 = {
    to: nftAddress,
    data: data,
  };

  txs.push(tx1);

  const tx2 = {
    to: nftAddress,
    data: data,
  };

  txs.push(tx2);

  // Transaction events subscription
  //   smartAccount.on("txHashGenerated", (response) => {
  //     console.log("txHashGenerated event received via emitter", response);
  //   });
  //   smartAccount.on("txMined", (response) => {
  //     console.log("txMined event received via emitter", response);
  //   });
  //   smartAccount.on("error", (response) => {
  //     console.log("error event received via emitter", response);
  //   });

  // Sending transaction
  const txResponse = await smartAccount.sendTransactionBatch({
    transactions: txs,
  });
  console.log("Tx Response", txResponse);
  const txReciept = await txResponse.wait();
  console.log("Tx hash", txReciept.transactionHash);
};

module.exports = { batchMintNft };
