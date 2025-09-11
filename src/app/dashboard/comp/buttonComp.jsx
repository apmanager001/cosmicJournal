import React from "react";
import { Trophy, PaintBucket } from "lucide-react";

const ButtonComp = () => {
  return (
    <div className="flex justify-end w-full pb-4 gap-4 px-2">
      <div className="btn btn-sm btn-primary rounded-2xl">
        <Trophy className="w-4 h-4" />
        Goals
      </div>
      <div className="btn btn-sm btn-primary rounded-2xl">
        <PaintBucket className="w-4 h-4" />
        Bucket List
      </div>
    </div>
  );
};

export default ButtonComp;
