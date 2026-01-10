import { useContext } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RpsContext } from "@/context/RpsContext";
import { useRouter } from "next/router";
import { Loader2 } from "lucide-react";

export function DialogModal({ result }) {
  const {
    tieModal,
    setTieModal,
    solveLoad,
    winnerP1Modal,
    winnerP2Modal,
    setWinnerP1Modal,
    setWinnerP2Modal,
    setPlayer1Move,
    setPlayer2Move,
    setStakeP1,
    setMoveNumber,
  } = useContext(RpsContext);

  const router = useRouter();

  const handleClose = () => {
    setTieModal(false);
    setWinnerP1Modal(false);
    setWinnerP2Modal(false);
    setPlayer1Move(0);
    setPlayer2Move(0);
    setStakeP1(0);
    setMoveNumber(0);

    localStorage.removeItem("rpsContractAddr");
    localStorage.removeItem("c1Hash");
    localStorage.removeItem("saltValue");
    localStorage.removeItem("player2Move");
    localStorage.removeItem("stakeP1");
    localStorage.removeItem("player1Addr");

    router.push("/");
  };

  return (
    <>
      <Dialog
        className='z-50'
        open={tieModal || winnerP1Modal || winnerP2Modal}
      >
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Results</DialogTitle>
            <DialogDescription>
              Make sure to check your wallet for any prizes.
            </DialogDescription>
          </DialogHeader>
          <div className='grid gap-4 py-4 h-2 font-bold text-[25px] justify-center'>
            {result}
          </div>
          <DialogFooter className='flex mt-[20px]'>
            {solveLoad ? (
              <Button disabled variant='load'>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Transferring...
              </Button>
            ) : (
              <>
                <Button onClick={handleClose}>Close</Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
