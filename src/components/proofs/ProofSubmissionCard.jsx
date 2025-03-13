import { useState } from "react";
import ViewProof from "../../pages/proofs/ViewProof"; // ✅ Correct import path

const ProofSubmissionCard = ({ proof }) => {
  const [isViewing, setIsViewing] = useState(false); // ✅ Track whether the proof details should be shown

  return (
    <div>
      {/* ✅ Show ViewProof if viewing, otherwise show the card */}
      {isViewing ? (
        <ViewProof proof={proof} onClose={() => setIsViewing(false)} />
      ) : (
        <div
          className="p-5 rounded-lg bg-bg-light cursor-pointer hover:shadow-lg transition"
          onClick={() => setIsViewing(true)} // ✅ Open ViewProof on click
        >
          <div className="flex justify-between items-center mb-2">
            <p className="text-gray-700 font-medium">#{proof.id}</p>
            <p
              className={`inline-block px-2 py-1 text-sm rounded-full ${
                proof.status === "Verified"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {proof.status}
            </p>
          </div>
          <p className="text-lg font-semibold text-gray-900">{proof.challengeName}</p>
          <p className="text-sm text-gray-500">Submitted by: {proof.submitter}</p>
        </div>
      )}
    </div>
  );
};

export default ProofSubmissionCard;
