import React from "react";
import Button from "./button";
import Card from "./card";

interface Props {
  onClose: VoidFunction;
}

function TournamentForm({ onClose }: Props) {
  return (
    <Card isActive>
      <h1 className="text-xl text-center font-bold">New Tournament 🏆</h1>
      <div className="flex justify-around mt-4">
        <Button
          onClick={() => {
            onClose();
          }}
          textSize="text-base"
          backgroundColor="bg-slate-700"
        >
          cancel
        </Button>
        <Button
          backgroundColor="bg-green-700"
          textSize="text-base"
          onClick={() => {}}
        >
          create
        </Button>
      </div>
    </Card>
  );
}

export default TournamentForm;
