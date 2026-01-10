import React, { useContext, useEffect, useState } from "react";
import { ConnectKitButton } from "connectkit";
import Image from "next/image";
import { useRouter } from "next/router";
import { useTimer } from "use-timer";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import logo from "../assets/logo.svg";
import { Label } from "@/components/ui/label";
import { TextRevealCard } from "@/components/ui/text-reveal-effect";
import Choose from "@/components/Choose";
import { Button } from "@/components/ui/button";
import { RpsContext } from "@/context/RpsContext";
import { Input } from "@/components/ui/input";
import { AnimatedButton } from "@/components/AnimatedButton";
import Hint from "@/components/Hint";

const Player2 = () => {
  const {
    play,
    moveNumber,
    playLoad,
    setPlayLoad,
    checkTimerParams,
    setCheckTimerParams,
    j2Timeout,
    checkJ1Timeout,
    setCheckJ1Timeout,
  } = useContext(RpsContext);
  const { start } = useTimer({
    initialTime: 0,
    endTime: 300,
    timerType: "INCREMENTAL",
    onTimeOver: () => {
      if (checkTimerParams) {
        j2Timeout();
        router.push("/");
      }
    },
  });
  const [stakeAmt, setStakeAmt] = useState(0);

  useEffect(() => {
    if (checkTimerParams) {
      start();
    }
    setStakeAmt(localStorage.getItem("stakeP1"));
  }, []);

  const router = useRouter();

  const handlePlay = async () => {
    try {
      const p2move = localStorage.getItem("player2Move");

      if (p2move == null) return toast.error("No move selected.");
      const stakeAmt = localStorage.getItem("stakeP1");

      setCheckTimerParams(false);
      const isPlayed = await play(p2move, stakeAmt);

      if (isPlayed) {
        setCheckJ1Timeout(true);
        router.push("/winner");
      } else {
        setPlayLoad(false);
      }
    } catch (error) {
      toast.error("Something went wrong");
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
        <div className='flex flex-col justify-center items-center gap-[20px]'>
          <div className='flex mt-[10px] justify-center rounded-2xl w-full'>
            <TextRevealCard
              text='Select a move'
              revealText='Be the winner'
            ></TextRevealCard>
          </div>
        </div>

        <Choose player='player2' />

        <div className='relative flex flex-row gap-[30px] mt-[80px] items-center justify-center text-white'>
          <div className='grid w-full justify-center items-center gap-1.5'>
            <Label htmlFor='stake'>Stake</Label>
            <Hint
              label='Stake amount of both players must be same.'
              side='bottom'
              align='center'
              sideOffset={5}
            >
              <Input
                type='number'
                id='stake'
                placeholder='Enter stake'
                className='w-[200px]'
                value={stakeAmt}
                readOnly
              />
            </Hint>
          </div>
        </div>

        <div className='absolute top-[600px] w-full flex justify-center'>
          {playLoad ? (
            <Button disabled variant='load'>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Please wait
            </Button>
          ) : (
            <>
              <AnimatedButton btnName='Play game' onClick={handlePlay} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Player2;
