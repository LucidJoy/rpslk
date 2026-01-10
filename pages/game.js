import React, { useContext, useState, useEffect } from "react";
import Image from "next/image";
import { useAccount } from "wagmi";
import { ConnectKitButton } from "connectkit";
import { useRouter } from "next/router";

import { Button } from "@/components/ui/button";
import logo from "../assets/logo.svg";
import { convertToHex } from "@/utils/convertToHex";
import { bytesToUint256 } from "@/utils/bytesToUint256";
import Player from "@/components/Player";
import { RpsContext } from "@/context/RpsContext";
import { Loader2 } from "lucide-react";
import { AnimatedButton } from "@/components/AnimatedButton";
import { toast } from "sonner";

const Game = () => {
  const {
    hash,
    moveNumber,
    hashLoad,
    setHashLoad,
    deployRPSContract,
    opponentAddr,
    stakeP1,
    j2Timeout,
    setMoveNumber,
    setCheckTimerParams,
  } = useContext(RpsContext);
  const { address } = useAccount();

  const router = useRouter();

  const [saltValue, setSaltValue] = useState(null);

  useEffect(() => {
    const savedSalt = localStorage.getItem("saltValue");
    setSaltValue(savedSalt);
  }, []);

  const handleStartGame = async () => {
    if (moveNumber == 0 || opponentAddr == null || stakeP1 <= 0)
      return toast.error("Insuffient data provided.");

    if (opponentAddr == address)
      return toast.error("Opponent address must be different.");

    try {
      localStorage.setItem("stakeP1", stakeP1);

      const res = await fetch("https://kleros-rps.lucidjoy.xyz/api/salt-hash");
      const data = await res.json();
      const hex = convertToHex(data.slice(5));
      const salt = bytesToUint256(hex);
      setSaltValue(salt);
      localStorage.setItem("saltValue", salt._hex);

      // Create a temporary anchor element to trigger the file download
      const content = `Move: ${moveNumber}\nSalt: ${salt._hex}`;

      const link = document.createElement("a");
      link.download = "secret_salt.txt";
      link.href = URL.createObjectURL(
        new Blob([content], { type: "text/plain;charset=utf-8" })
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      const c1Hash = await hash(moveNumber, salt);
      localStorage.setItem("c1Hash", c1Hash);

      // Deploy the RPS contract
      const isDeployed = await deployRPSContract(c1Hash, opponentAddr, stakeP1);

      if (isDeployed) {
        setMoveNumber(0);
        localStorage.setItem("player1Addr", address);

        // start timer
        setCheckTimerParams(true);

        router.push("/player2");
      } else {
        toast.error("Something went wrong.");
        setHashLoad(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className='w-[100vw] h-[100vh] bg-black'>
      <div className='absolute border-b border-b-[#FFFFFF40] w-full px-[15px] py-[15px] flex items-center justify-between'>
        <div onClick={() => router.push("/")} className='hover:cursor-pointer'>
          <Image src={logo} height={30} alt='logo' />
        </div>

        <ConnectKitButton />
      </div>

      <div className='absolute mt-[70px] w-full h-[calc(100vh-70px)] text-white'>
        <div className='flex-1 h-[calc(100vh-70px)]'>
          <div className='flex flex-col items-center gap-[20px]'>
            <Player address={address} />

            <div className='absolute top-[600px] w-full flex justify-center'>
              {hashLoad ? (
                <Button disabled variant='load'>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Please wait
                </Button>
              ) : (
                <>
                  <AnimatedButton
                    btnName='Start game'
                    onClick={handleStartGame}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Game;
