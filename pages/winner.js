import React, { useContext, useState, useEffect } from "react";
import { ConnectKitButton } from "connectkit";
import Image from "next/image";
import { useRouter } from "next/router";
import Confetti from "react-confetti";
import useWindowSize from "react-use/lib/useWindowSize";
import { useTimer } from "use-timer";
import { useAccount } from "wagmi";

import logo from "../assets/logo.svg";
import { TextRevealCard } from "@/components/ui/text-reveal-effect";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RpsContext } from "@/context/RpsContext";
import { Label } from "@/components/ui/label";
import { AnimatedButton } from "@/components/AnimatedButton";
import { Loader2 } from "lucide-react";
import { DialogModal } from "@/components/DialogModal";
import { toast } from "sonner";

const Winner = () => {
  const {
    solve,
    solveLoad,
    win,
    hashOnly,
    tieModal,
    setTieModal,
    winnerP1Modal,
    setWinnerP1Modal,
    winnerP2Modal,
    setWinnerP2Modal,
    getTimeout,
    checkJ1Timeout,
    setCheckJ1Timeout,
    j1Timeout,
  } = useContext(RpsContext);
  const { width, height } = useWindowSize();
  const { start } = useTimer({
    initialTime: 0,
    endTime: 300,
    timerType: "INCREMENTAL",
    onTimeOver: () => {
      if (checkJ1Timeout) {
        j1Timeout();
        router.push("/");
      }
    },
  });
  const { address } = useAccount();

  const router = useRouter();

  const [moveNumberP1, setMoveNumberP1] = useState(0);
  const [saltP1, setSaltP1] = useState(null);

  useEffect(() => {
    if (checkJ1Timeout) {
      start();
    }
  }, []);

  const handleWinner = async () => {
    if (moveNumberP1 <= 0 || saltP1 == null)
      return toast.error("Insuffient data provided.");

    setCheckJ1Timeout(false);
    const player1Addr = localStorage.getItem("player1Addr");
    if (address != player1Addr) {
      console.log(address);
      console.log(player1Addr.toString());
      return toast.error("Only Player 1 can call.");
    }

    const p2Move = localStorage.getItem("player2Move");
    // console.log(+moveNumberP1, +p2Move);

    const keccHash = await hashOnly(moveNumberP1, saltP1);
    const c1HashOriginal = localStorage.getItem("c1Hash");

    if (keccHash !== c1HashOriginal) return;

    const boolWin = await win(moveNumberP1, p2Move);

    const isSolved = await solve(moveNumberP1, saltP1);
    if (isSolved === false) return toast.error("Something went wrong.");

    if (isSolved === true) {
      if (+moveNumberP1 == +p2Move) {
        console.log("Game is tie");
        setTieModal(true);
      } else if (+moveNumberP1 == 0) {
        console.log("P2 is winner");
        setWinnerP2Modal(true);
      } else if (boolWin === true) {
        console.log("P1 is winner");
        setWinnerP1Modal(true);
      } else {
        console.log("P2 is winner");
        setWinnerP2Modal(true);
      }
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

      <div className='absolute w-full h-[calc(100vh-70px)] mt-[70px] text-white flex flex-col justify-center items-center'>
        {tieModal && (
          <>
            <Confetti
              width={width}
              height={height}
              opacity={0.5}
              numberOfPieces={150}
            />
            <div className='absolute'>
              <DialogModal result='Game is a tie' />
            </div>
          </>
        )}
        {winnerP1Modal && (
          <>
            <Confetti
              width={width}
              height={height}
              opacity={0.5}
              numberOfPieces={150}
            />
            <div className='absolute'>
              <DialogModal result='Player 1 is winner' />
            </div>
          </>
        )}
        {winnerP2Modal && (
          <>
            <Confetti
              width={width}
              height={height}
              opacity={0.5}
              numberOfPieces={150}
            />
            <div className='absolute'>
              <DialogModal result='Player 2 is winner' />
            </div>
          </>
        )}

        <div className='flex justify-center -mt-[220px] w-full'>
          <TextRevealCard
            text='Ready to win?'
            revealText='Check the winner'
          ></TextRevealCard>
        </div>

        <div className='max-w-[450px] min-w-[450px] flex flex-col gap-[20px]'>
          <div className='grid w-full justify-start items-center gap-1.5'>
            <Label htmlFor='p1move'>Move</Label>
            <Input
              type='number'
              id='p1move'
              placeholder='Enter move number'
              className='w-[450px]'
              onChange={(e) => setMoveNumberP1(e.target.value)}
            />
          </div>

          <div className='grid w-full justify-start items-center gap-1.5'>
            <Label htmlFor='p1hash'>Salt</Label>
            <Input
              type='text'
              id='p1hash'
              placeholder='Enter salt'
              className='w-[450px]'
              onChange={(e) => setSaltP1(e.target.value)}
            />
          </div>
        </div>

        <div className='absolute top-[600px] w-full flex justify-center'>
          {solveLoad ? (
            <Button disabled variant='load'>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Please wait
            </Button>
          ) : (
            <>
              <AnimatedButton btnName='Check winner' onClick={handleWinner} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Winner;
