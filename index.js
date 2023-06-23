const { ethers } = require("ethers");
const { utils } = require("ethers");
const HDWalletProvider = require("@truffle/hdwallet-provider");
const { ChainId } = require("@biconomy/core-types");
const SmartAccount = require("@biconomy/smart-account").default;
const { ERC_721_ABI } = require("./constants");
require("dotenv").config();

const privateKey = process.env.PRIVATE_KEY;
const rpcUrl = process.env.RPC_URL;

async function main() {
  let provider = new HDWalletProvider(privateKey, rpcUrl);
  const walletProvider = new ethers.providers.Web3Provider(provider);
  // get EOA address from wallet provider
  const eoa = await walletProvider.getSigner().getAddress();
  console.log(`EOA address: ${eoa}`);

  // get SmartAccount address from wallet provider
  const wallet = new SmartAccount(walletProvider, {
    activeNetworkId: ChainId.POLYGON_MUMBAI,
    supportedNetworksIds: [
      ChainId.GOERLI,
      ChainId.POLYGON_MAINNET,
      ChainId.POLYGON_MUMBAI,
    ],
    networkConfig: [
      {
        chainId: ChainId.POLYGON_MUMBAI,
        dappAPIKey: process.env.DAPP_API_KEY,
        providerUrl: process.env.RPC_URL,
        networkCheckTimeout: 10000,
        timeoutBlocks: 200,
        allowUnlimitedContractSize: true,
      },
    ],
  });
  const smartAccount = await wallet.init();
  const address = await smartAccount.getSmartAccountState();
  console.log(`SmartAccount address: ${address.address}`);

  const erc721Interface = new utils.Interface(JSON.stringify(ERC_721_ABI));
  const data1 = erc721Interface.encodeFunctionData("safeMint", [
    "0xea6a5858e05d74173ad58f8843b59e98c971aa5d",
    0,
    "ipfs://bafkreigvmahwkhdzcwldhv3uoqur3727o24lo4n5e3dqwd5gmyag3igutu",
  ]);

  const data2 = erc721Interface.encodeFunctionData("safeMint", [
    "0x9eb17A51380D7C2f5aC17f640809bbD08174ec65",
    1,
    "ipfs://bafkreig67hed5yrzx7kfo25aasyyqyqjmvzm4olkbpkstcn4wsf5nap2ay",
  ]);
  const nftAddress = "0x422F7De4598076B931502ddC247Cd6db317d6B79";

  const txs = [];
  const tx1 = {
    to: nftAddress,
    data: data1,
    gasLimit: 250000,
  };

  txs.push(tx1);

  const tx2 = {
    to: nftAddress,
    data: data2,
    gasLimit: 250000,
  };

  txs.push(tx2);

  // Sending transaction
  const txResponse = await smartAccount.sendTransactionBatch({
    transactions: txs,
  });

  console.log("Tx Response", txResponse);
  const txReciept = await txResponse.wait();
  console.log("Tx hash", txReciept.transactionHash);

  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
