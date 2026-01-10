import React, { useContext, useState, useEffect } from "react";

import Choose from "./Choose";
import { Input } from "./ui/input";
import { RpsContext } from "@/context/RpsContext";
import { TextRevealCard } from "./ui/text-reveal-effect";
import { Separator } from "./ui/separator";
import { Label } from "@/components/ui/label";

const Player = () => {
  const { opponentAddr, setOpponentAddr, stakeP1, setStakeP1 } =
    useContext(RpsContext);

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      {isClient ? (
        <div>
          <div className='flex flex-col justify-center items-center gap-[20px]'>
            <div className='flex mt-[10px] justify-center rounded-2xl w-full'>
              <TextRevealCard
                text='Select a move'
                revealText='Try your luck'
              ></TextRevealCard>
            </div>

            <Choose player='player1' />

            <div className='relative flex flex-row gap-[30px] mt-[50px] items-center justify-center'>
              <div className='grid w-full max-w-sm items-center gap-1.5'>
                <Label htmlFor='opp'>Opponent</Label>
                <Input
                  type='text'
                  id='opp'
                  placeholder="Enter opponent's address"
                  className='w-[350px]'
                  onChange={(e) => setOpponentAddr(e.target.value)}
                />
              </div>

              <Separator
                orientation='vertical'
                className='h-[50px] opacity-50 absolute right-[164px] top-[18px]'
              />

              <div className='grid w-full max-w-sm items-center gap-1.5'>
                <Label htmlFor='stake'>Stake</Label>
                <Input
                  type='number'
                  id='stake'
                  placeholder='Enter stake'
                  className='w-[150px]'
                  onChange={(e) => setStakeP1(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default Player;
