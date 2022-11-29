import Image from "next/image";
import React from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { Ichange } from "../../assets/images";
import { AppContext } from "../../context";
import { GasPolygon, PriceToken } from "../../utils";
import ImageToken from "../ImageToken";
import InputText from "../InputText";
import SelectToken from "../SelectToken";
import SelectToken2 from "../SelectToken2";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { BigNumber } from "@0x/utils";

import {
  useAccount,
  useConnect,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
} from "wagmi";
import {
  useConnectModal,
  useAccountModal,
  useChainModal,
} from "@rainbow-me/rainbowkit";
import { useState } from "react";
import { ERC20TokenContract } from "@0x/contract-wrappers";
import Web3 from "web3";
import { Web3Wrapper } from "@0x/web3-wrapper";

const ProductSwap = () => {
  const { address, connector, isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();
  const { openChainModal } = useChainModal();
  const [needApprove, setNeedApprove] = useState(false);
  const [allowanceTarget, setAllowanceTarget] = useState();
  const [estimatedPriceImpact, setEstimatedPriceImpact] = useState(0);
  const [buttonSwap, setButtonSwap] = useState(false);
  const [gasPricePolygon, setGasPricePolygon] = useState();
  const {
    tokenOneName,
    tokenTwoName,
    tokenOneImage,
    tokenTwoImage,
    tokenOneAmount,
    tokenTwoAmount,
    setTokenOneAmount,
    setTokenTwoAmount,
    tokenOneDecimals,
    tokenTwoDecimals,
    contractTokenOne,
    contractTokenTwo,
    setQuote,
    quote,
  } = useContext(AppContext);
  const approveFunction = async (
    allowanceTarget,
    address,
    contractTokenOne
  ) => {
    const erc20abi = [
      {
        inputs: [
          { internalType: "string", name: "name", type: "string" },
          { internalType: "string", name: "symbol", type: "string" },
          { internalType: "uint256", name: "max_supply", type: "uint256" },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "spender",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
        ],
        name: "Approval",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "from",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
        ],
        name: "Transfer",
        type: "event",
      },
      {
        inputs: [
          { internalType: "address", name: "owner", type: "address" },
          { internalType: "address", name: "spender", type: "address" },
        ],
        name: "allowance",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "spender", type: "address" },
          { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        name: "approve",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [{ internalType: "address", name: "account", type: "address" }],
        name: "balanceOf",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
        name: "burn",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "account", type: "address" },
          { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        name: "burnFrom",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "decimals",
        outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "spender", type: "address" },
          { internalType: "uint256", name: "subtractedValue", type: "uint256" },
        ],
        name: "decreaseAllowance",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "spender", type: "address" },
          { internalType: "uint256", name: "addedValue", type: "uint256" },
        ],
        name: "increaseAllowance",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "name",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "symbol",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "totalSupply",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "recipient", type: "address" },
          { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        name: "transfer",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "sender", type: "address" },
          { internalType: "address", name: "recipient", type: "address" },
          { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        name: "transferFrom",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
      },
    ];

    const web3e = new Web3();

    const web3 = new Web3(Web3.givenProvider);

    const ERC20TokenContract = new web3.eth.Contract(
      erc20abi,
      contractTokenOne
    );

    const maxApproval = new BigNumber(2).pow(256).minus(1);

    const getGas = await GasPolygon.get("").then((res) => {
      setGasPricePolygon(res);
    });

    const tx = await ERC20TokenContract.methods
      .approve(allowanceTarget, maxApproval)
      .send({
        from: address,
        maxPriorityFeePerGas: 40000000000,
      })
      .then((tx) => {});
    swapToken(allowanceTarget, address, contractTokenOne);
    setNeedApprove(false);
    setButtonSwap(true);
  };
  const swapToken = async (allowanceTarget, address, contractTokenOne) => {
    let tokenAmount = tokenOneAmount * 10 ** tokenOneDecimals;
    const swapQuote = await PriceToken.get(
      `/quote?sellToken=${tokenOneName}&buyToken=${tokenTwoName}&sellAmount=${tokenAmount}&takerAddress=${address}`
    );
    const web3 = new Web3(Web3.givenProvider);
    // Perform the swap

    const { data, to, value, gas, gasPrice } = swapQuote.data;
    const swapTxHash = await web3.eth.sendTransaction({
      from: address,
      to,
      data,
      value,
      gas,
      gasPrice,
    });
  };
  const fecthQuote = async (
    tokenOneName,
    tokenTwoName,
    address,
    tokenOneDecimals
  ) => {
    const erc20abi = [
      {
        inputs: [
          { internalType: "string", name: "name", type: "string" },
          { internalType: "string", name: "symbol", type: "string" },
          { internalType: "uint256", name: "max_supply", type: "uint256" },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "spender",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
        ],
        name: "Approval",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "from",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
        ],
        name: "Transfer",
        type: "event",
      },
      {
        inputs: [
          { internalType: "address", name: "owner", type: "address" },
          { internalType: "address", name: "spender", type: "address" },
        ],
        name: "allowance",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "spender", type: "address" },
          { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        name: "approve",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [{ internalType: "address", name: "account", type: "address" }],
        name: "balanceOf",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
        name: "burn",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "account", type: "address" },
          { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        name: "burnFrom",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "decimals",
        outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "spender", type: "address" },
          { internalType: "uint256", name: "subtractedValue", type: "uint256" },
        ],
        name: "decreaseAllowance",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "spender", type: "address" },
          { internalType: "uint256", name: "addedValue", type: "uint256" },
        ],
        name: "increaseAllowance",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "name",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "symbol",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "totalSupply",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "recipient", type: "address" },
          { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        name: "transfer",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "sender", type: "address" },
          { internalType: "address", name: "recipient", type: "address" },
          { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        name: "transferFrom",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
      },
    ];

    try {
      let tokenAmount = tokenOneAmount * 10 ** tokenOneDecimals;
      const result = PriceToken.get(
        `/quote?sellToken=${tokenOneName}&buyToken=${tokenTwoName}&sellAmount=${tokenAmount}&takerAddress=${address}`
      )
        .then((res) => {
          setQuote(res);

          setButtonSwap(true);
        })
        .catch((err) => {
          if (err.response.data.reason === "SenderNotAuthorizedError") {
            setNeedApprove(true);
          }
          if (err.response.data.reason === "Error") {
            setNeedApprove(true);
          }
        });
    } catch (err) {
      if (err.response.data.reason === "SenderNotAuthorizedError") {
      }
      if (err.response.data.reason === "Error") {
        setNeedApprove(true);
      }
    }
  };
  const fetchPrice = async (tokenOneName, tokenTwoName, tokenOneDecimals) => {
    setNeedApprove(false);
    let tokenAmount = tokenOneAmount * 10 ** tokenOneDecimals;

    try {
      const result = PriceToken.get(
        `/price?sellToken=${tokenOneName}&buyToken=${tokenTwoName}&sellAmount=${tokenAmount}`
      )
        .then((res) => {
          setAllowanceTarget(res.data.allowanceTarget);
          setEstimatedPriceImpact(res.data.estimatedPriceImpact);
          setTokenTwoAmount(res.data.buyAmount / 10 ** tokenTwoDecimals);
        })
        .catch((err) => {
          setTokenTwoAmount(0);
        });
    } catch (err) {}
  };
  useEffect(() => {
    fetchPrice(tokenOneName, tokenTwoName, tokenOneDecimals);
    setButtonSwap(false);
    setNeedApprove(false);
  }, [tokenOneName, tokenTwoName, tokenOneAmount, tokenTwoAmount]);
  return (
    <div class="relative block overflow-hidden rounded-lg border border-gray-100 p-8">
      <span class="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-green-300 via-blue-500 to-purple-600"></span>
      <div class="flex flex-row justify-between sm:flex  shadow-sm"></div>
      <div class="flex flex-row justify-between sm:flex  shadow-sm">
        <ImageToken image={tokenOneImage} />
        <InputText
          amount={tokenOneAmount}
          onChange={(value) => setTokenOneAmount(value.target.value)}
        />
        <SelectToken token={tokenOneName} />
      </div>
      <div className="flex justify-center items-center py-5 hover: ">
        <Image src={Ichange} width={20} height={20}></Image>
      </div>
      <div class="flex flex-row justify-between sm:flex shadow-sm">
        <ImageToken image={tokenTwoImage} />
        <InputText
          amount={tokenTwoAmount}
          onChange={(value) => setTokenTwoAmount(value.target.value)}
        />
        <SelectToken2 token={tokenTwoName} />
      </div>

      <div class="flex flex-row justify-center p-10 sm:flex shadow-sm">
        {openConnectModal && !needApprove && (
          <div class="flex items-center justify-center rounded-xl border-4 border-black bg-teal-300 px-8 py-4 font-bold shadow-[6px_6px_0_0_#000] transition hover:shadow-none focus:outline-none focus:ring active:bg-pink-50">
            <button onClick={openConnectModal} type="button">
              Connect Wallet
            </button>
            <span aria-hidden="true" class="ml-1.5" role="img"></span>
          </div>
        )}
        {!openConnectModal && !needApprove && !buttonSwap && (
          <div
            onClick={() =>
              fecthQuote(tokenOneName, tokenTwoName, address, tokenOneDecimals)
            }
            class="flex items-center justify-center rounded-xl border-4 border-black bg-teal-300 px-8 py-4 font-bold shadow-[6px_6px_0_0_#000] transition hover:shadow-none focus:outline-none focus:ring active:bg-pink-50"
          >
            Review Order
            <span aria-hidden="true" class="ml-1.5" role="img"></span>
          </div>
        )}
        {!openConnectModal && !buttonSwap && needApprove && (
          <div
            onClick={() =>
              approveFunction(allowanceTarget, address, contractTokenOne)
            }
            class="flex items-center justify-center rounded-xl border-4 border-black bg-teal-300 px-8 py-4 font-bold shadow-[6px_6px_0_0_#000] transition hover:shadow-none focus:outline-none focus:ring active:bg-pink-50"
          >
            Approve
            <span aria-hidden="true" class="ml-1.5" role="img"></span>
          </div>
        )}
        {!openConnectModal && !needApprove && buttonSwap && (
          <div
            onClick={() =>
              swapToken(allowanceTarget, address, contractTokenOne)
            }
            class="flex items-center justify-center rounded-xl border-4 border-black bg-teal-300 px-8 py-4 font-bold shadow-[6px_6px_0_0_#000] transition hover:shadow-none focus:outline-none focus:ring active:bg-pink-50"
          >
            Swap
            <span aria-hidden="true" class="ml-1.5" role="img"></span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductSwap;
