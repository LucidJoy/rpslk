import React, { createContext, useState, useEffect } from "react";
import { ethers } from "ethers";
import { toast } from "sonner";
import { getParsedEthersError } from "@enzoferey/ethers-error-parser";

import HasherABI from "../contract/Hasher.json";
import RpsABI from "../contract/RPS.json";
import RpsBytecode from "../contract/RpsBytecode.json";
import HashOnlyABI from "../contract/Hash.json";

export const RpsContext = createContext({});

export const RpsProvider = ({ children }) => {
  const [moveNumber, setMoveNumber] = useState(0);
  const [opponentAddr, setOpponentAddr] = useState(null);
  const [rpsContractAddr, setRpsContractAddr] = useState(null);
  const [stakeP1, setStakeP1] = useState(0);
  const [player1Move, setPlayer1Move] = useState(0);
  const [player2Move, setPlayer2Move] = useState(0);
  const [checkTimerParams, setCheckTimerParams] = useState(false); //j2timeout
  const [checkJ1Timeout, setCheckJ1Timeout] = useState(false);

  // LOADERS
  const [hashLoad, setHashLoad] = useState(false);
  const [playLoad, setPlayLoad] = useState(false);
  const [solveLoad, setSolveLoad] = useState(false);
  const [winLoad, setWinLoad] = useState(false);

  // MODAL
  const [tieModal, setTieModal] = useState(false);
  const [winnerP1Modal, setWinnerP1Modal] = useState(false);
  const [winnerP2Modal, setWinnerP2Modal] = useState(false);

  const hasherContractAddr = "0xb0846aBCB645EB49C51C697806c23181B4A093f9";
  const hashOnlyContractAddr = "0xDe96818C7C16d967E679321ad683D81D7e5dAB4b";

  // Check if it is connected to wallet
  const checkIfWalletIsConnect = async () => {
    // While installing metamask, it has an ethereum object in the window
    if (!window.ethereum) return alert("Please install MetaMask.");

    // Fetch all the eth accounts
    const accounts = await window.ethereum.request({ method: "eth_accounts" });

    // Connecting account if exists
    if (!accounts.length) {
      console.log("No accounts found");
    }
  };

  // Checking if wallet is there in the start
  useEffect(() => {
    checkIfWalletIsConnect();
  }, []);

  const hash = async (c, salt) => {
    try {
      if (window.ethereum) {
        setHashLoad(true);
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();

        const hasherContract = new ethers.Contract(
          hasherContractAddr,
          HasherABI,
          signer
        );

        const hashedValue = await hasherContract.hash(c, salt, {
          gasLimit: 500000,
        });
        // setHashLoad(false);
        toast.success("Salt downloaded.");
        return hashedValue;
      }
    } catch (error) {
      const parsedEthersError = getParsedEthersError(error);
      toast.error(
        `${parsedEthersError.errorCode} -> ${parsedEthersError.context}`
      );
      setHashLoad(false);
    }
  };

  const hashOnly = async (c, salt) => {
    try {
      if (window.ethereum) {
        // setHashLoad(true);
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();

        const hashOnlyContract = new ethers.Contract(
          hashOnlyContractAddr,
          HashOnlyABI,
          signer
        );

        const hashedValue = await hashOnlyContract.hash(c, salt, {
          gasLimit: 500000,
        });
        // setHashLoad(false);
        // toast.success("Hashing successful.");
        return hashedValue;
      }
    } catch (error) {
      // const parsedEthersError = getParsedEthersError(error);
      // toast.error(
      //   `${parsedEthersError.errorCode} -> ${parsedEthersError.context}`
      // );
      // setHashLoad(false);
      console.log(error);
    }
  };

  const play = async (c, stake) => {
    try {
      if (window.ethereum) {
        setPlayLoad(true);
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();

        const rpsContractAddr = localStorage.getItem("rpsContractAddr");

        const rpsContract = new ethers.Contract(
          rpsContractAddr,
          RpsABI,
          signer
        );

        const tx = await rpsContract.play(c, {
          value: ethers.utils.parseEther(stake.toString()),
          gasLimit: 500000,
        });

        await tx.wait();
        setPlayLoad(false);
        toast.success("Play success.");

        return true;
      }
    } catch (error) {
      // const parsedEthersError = getParsedEthersError(error);
      // toast.error(
      //   `${parsedEthersError.errorCode} -> ${parsedEthersError.context}`
      // );
      console.log(error);
      setPlayLoad(false);
      return false;
    }
  };

  const solve = async (c1, salt) => {
    try {
      if (window.ethereum) {
        setSolveLoad(true);
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();

        const rpsContractAddr = localStorage.getItem("rpsContractAddr");
        console.log(rpsContractAddr);

        const rpsContract = new ethers.Contract(
          rpsContractAddr,
          RpsABI,
          signer
        );

        const tx = await rpsContract.solve(c1, salt.toString(), {
          gasLimit: 500000,
        });

        await tx.wait();
        toast.success("Transferred ethers successfully.");
        setSolveLoad(false);

        return true;
      }
    } catch (error) {
      // const parsedEthersError = getParsedEthersError(error);
      toast.error("Something went wrong.");
      setSolveLoad(false);
      return false;
    }
  };

  const win = async (c1, c2) => {
    try {
      if (window.ethereum) {
        setWinLoad(true);
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();

        const rpsContractAddr = localStorage.getItem("rpsContractAddr");

        const rpsContract = new ethers.Contract(
          rpsContractAddr,
          RpsABI,
          signer
        );

        const res = await rpsContract.win(+c1, +c2, {
          gasLimit: 500000,
        });

        setWinLoad(false);
        // toast.success("Solved successfully");
        return res;
      }
    } catch (error) {
      // const parsedEthersError = getParsedEthersError(error);
      // toast.error(
      //   `${parsedEthersError.errorCode} -> ${parsedEthersError.context}`
      // );
      // setWinLoad(false);
      console.log(error);
    }
  };

  // if j2 doesn't play a move within 5 mins
  const j2Timeout = async () => {
    console.log("j2 timeout");
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const rpsContractAddr = localStorage.getItem("rpsContractAddr");

      const rpsContract = new ethers.Contract(rpsContractAddr, RpsABI, signer);

      const tx = await rpsContract.j2Timeout({
        gasLimit: 500000,
      });

      await tx.wait();
      toast.success("Staked ether transferred back.");
    } catch (error) {
      console.log(error);
    }
  };
  // if j1 doesnt reveal after comitting within 5 mins, j2 will get both stakes
  const j1Timeout = async () => {
    console.log("j2 timeout");
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const rpsContractAddr = localStorage.getItem("rpsContractAddr");

      const rpsContract = new ethers.Contract(rpsContractAddr, RpsABI, signer);

      const tx = await rpsContract.j1Timeout({
        gasLimit: 500000,
      });

      await tx.wait();
      toast.success("2x staked ether transferred.");
    } catch (error) {
      console.log(error);
    }
  };

  const deployRPSContract = async (c1Hash, opponentAddress, stake) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      console.log("Signer: ", signer._address);

      const rpsContract = new ethers.ContractFactory(
        RpsABI,
        RpsBytecode.bytecode,
        signer
      );

      const deployedContract = await rpsContract.deploy(
        c1Hash,
        opponentAddress,
        {
          value: ethers.utils.parseEther(stake.toString()),
        }
      );
      await deployedContract.deployed();
      setRpsContractAddr(deployedContract.address);

      localStorage.setItem("rpsContractAddr", deployedContract.address);

      toast.success("Game launched successfully.");
      setHashLoad(false);

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  return (
    <RpsContext.Provider
      value={{
        hashLoad,
        setHashLoad,
        hash,
        moveNumber,
        setMoveNumber,
        opponentAddr,
        setOpponentAddr,
        deployRPSContract,
        rpsContractAddr,
        play,
        solve,
        playLoad,
        solveLoad,
        stakeP1,
        setStakeP1,
        player1Move,
        setPlayer1Move,
        win,
        hashOnly,
        tieModal,
        setTieModal,
        winnerP1Modal,
        setWinnerP1Modal,
        winnerP2Modal,
        setWinnerP2Modal,
        j2Timeout,
        checkTimerParams,
        setCheckTimerParams,
        j1Timeout,
        checkJ1Timeout,
        setCheckJ1Timeout,
        player2Move,
        setPlayer2Move,
      }}
    >
      {children}
    </RpsContext.Provider>
  );
};
