import React, { useState } from "react";
import { Trophy, PaintBucket, X } from "lucide-react";

const ButtonComp = () => {
  const [showGoalsModal, setShowGoalsModal] = useState(false);
  const [showBucketListModal, setShowBucketListModal] = useState(false);

  return (
    <div>
      <div className="flex justify-end w-full pb-4 gap-4 px-2">
        <div
          className="btn btn-sm btn-primary rounded-2xl"
          onClick={() => setShowGoalsModal(true)}
        >
          <Trophy className="w-4 h-4" />
          Goals
        </div>
        <div
          className="btn btn-sm btn-primary rounded-2xl"
          onClick={() => setShowBucketListModal(true)}
        >
          <PaintBucket className="w-4 h-4" />
          Bucket List
        </div>
      </div>

      {showGoalsModal && (
        <div className="modal modal-open">
          <div className="modal-box modalContainer">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Goals</h2>
              <button
                className="btn btn-sm btn-circle btn-ghost"
                onClick={() => setShowGoalsModal(false)}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p>Example content for the Goals modal.</p>
            <div className="modal-action"></div>
          </div>
        </div>
      )}

      {showBucketListModal && (
        <div className="modal modal-open">
          <div className="modal-box modalContainer">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Bucket List</h2>
              <button
                className="btn btn-sm btn-circle btn-ghost"
                onClick={() => setShowBucketListModal(false)}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p>Example content for the Bucket List modal.</p>
            <div className="modal-action"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ButtonComp;
