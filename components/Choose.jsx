import React, { useContext, useState } from "react";
import {
  faHandRock,
  faHandScissors,
  faHandPaper,
  faHandSpock,
  faHandLizard,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAccount } from "wagmi";

import { RpsContext } from "@/context/RpsContext";
import { cn } from "@/utils/cn";
import { toast } from "sonner";

export default function Choose({ player }) {
  const {
    moveNumber,
    setMoveNumber,
    setPlayer1Move,
    setPlayer2Move,
    opponentAddr,
  } = useContext(RpsContext);
  const { address } = useAccount();

  const handleSelectMove = (num, move) => {
    try {
      if (player == "player2" && address == opponentAddr) {
        localStorage.setItem("player2Move", num);
        setMoveNumber(num);
        setPlayer2Move(num);
        toast.success(`Player 2: ${move} selected.`);
      } else if (player === "player1") {
        setMoveNumber(num);
        setPlayer1Move(num);
        toast.success(`Player 1: ${move} selected.`);
      } else {
        toast.error("Please change player address.");
      }
    } catch (error) {
      toast.error("Something went wrong.");
    }
  };

  return (
    <div className='flex flex-row w-[100vw] justify-evenly items-center text-white'>
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-[10px] border-[2px] rounded-lg p-[20px] hover:cursor-pointer",
          moveNumber === 1 ? "border-[#9012FE]" : "border-transparent"
        )}
        onClick={() => handleSelectMove(1, "Rock")}
      >
        <FontAwesomeIcon icon={faHandRock} size='4x' color='#fff' />
        <div>
          <p className='text-sm font-medium leading-none'>Rock</p>
        </div>
      </div>

      <div
        className={cn(
          "flex flex-col items-center justify-center gap-[10px] border-[2px] rounded-lg p-[20px] hover:cursor-pointer",
          moveNumber === 2 ? "border-[#9012FE]" : "border-transparent"
        )}
        onClick={() => handleSelectMove(2, "Paper")}
      >
        <FontAwesomeIcon icon={faHandPaper} size='4x' color='#fff' />
        <div>
          <p className='text-sm font-medium leading-none'>Paper</p>
        </div>
      </div>

      <div
        className={cn(
          "flex flex-col items-center justify-center gap-[10px] border-[2px] rounded-lg p-[20px] hover:cursor-pointer",
          moveNumber === 3 ? "border-[#9012FE]" : "border-transparent"
        )}
        onClick={() => handleSelectMove(3, "Scissors")}
      >
        <FontAwesomeIcon icon={faHandScissors} size='4x' color='#fff' />
        <div>
          <p className='text-sm font-medium leading-none'>Scissors</p>
        </div>
      </div>

      <div
        className={cn(
          "flex flex-col items-center justify-center gap-[10px] border-[2px] rounded-lg p-[20px] hover:cursor-pointer",
          moveNumber === 4 ? "border-[#9012FE]" : "border-transparent"
        )}
        onClick={() => handleSelectMove(4, "Spock")}
      >
        <FontAwesomeIcon icon={faHandSpock} size='4x' color='#fff' />
        <div>
          <p className='text-sm font-medium leading-none'>Spock</p>
        </div>
      </div>

      <div
        className={cn(
          "flex flex-col items-center justify-center gap-[10px] border-[2px] rounded-lg p-[20px] hover:cursor-pointer",
          moveNumber === 5 ? "border-[#9012FE]" : "border-transparent"
        )}
        onClick={() => handleSelectMove(5, "Lizard")}
      >
        <FontAwesomeIcon icon={faHandLizard} size='4x' color='#fff' />
        <div>
          <p className='text-sm font-medium leading-none'>Lizard</p>
        </div>
      </div>
    </div>
  );
}
