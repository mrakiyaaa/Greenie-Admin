import { useState } from "react";
import ProofSubmissionCard from "../../components/proofs/ProofSubmissionCard";
import Sidebar from "../../components/layout/Sidebar";
import Header from "../../components/layout/Header";

const proofsData = [
  { id: "00001", status: "Verified", submitter: "Dizppy", challengeName: "Challenge A" },
  { id: "00002", status: "Issue", submitter: "Dizppy", challengeName: "Challenge B" },
  { id: "00003", status: "Issue", submitter: "Dizppy", challengeName: "Challenge C" },
  { id: "00004", status: "Verified", submitter: "Dizppy", challengeName: "Challenge D" },
  { id: "00005", status: "Pending", submitter: "Alex", challengeName: "Challenge E" },
  { id: "00006", status: "Verified", submitter: "JohnDoe", challengeName: "Challenge F" },
  { id: "00007", status: "Issue", submitter: "JaneSmith", challengeName: "Challenge G" },
  { id: "00008", status: "Verified", submitter: "CodeMaster", challengeName: "Challenge H" },
  { id: "00009", status: "Pending", submitter: "Dizppy", challengeName: "Challenge I" },
  { id: "00010", status: "Issue", submitter: "Alex", challengeName: "Challenge J" },
];

const ProofSubmission = () => {
  const [selectedProof, setSelectedProof] = useState(null);
  const [proofs, setProofs] = useState(proofsData);
  const [filter, setFilter] = useState("All");

  const openProof = (proof) => {
    setSelectedProof(proof);
  };

  const closeProof = () => {
    setSelectedProof(null);
  };

  const updateStatus = (id, newStatus) => {
    setProofs((prevProofs) =>
      prevProofs.map((proof) =>
        proof.id === id ? { ...proof, status: newStatus } : proof
      )
    );
  };

  const filteredProofs = filter === "All" ? proofs : proofs.filter((proof) => proof.status === filter);

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <Sidebar />

      <div className="flex-1">
        {/* Header */}
        <Header />
    <div className="p-6">
      <p className="mb-4">Filter by: 
        <button className="ml-2 px-3 py-1 bg-gray-200 rounded" onClick={() => setFilter("All")}>All</button>
        <button className="ml-2 px-3 py-1 bg-green-200 text-green-700 rounded" onClick={() => setFilter("Verified")}>Verified</button>
        <button className="ml-2 px-3 py-1 bg-lightRed text-darkRed rounded" onClick={() => setFilter("Issue")}>With Issue</button>
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredProofs.map((proof) => (
          <ProofSubmissionCard 
            key={proof.id} 
            proof={proof} 
            onClick={() => openProof(proof)} 
            updateStatus={updateStatus} 
          />
        ))}
      </div>

     
    </div>
      </div>
    </div>
  );
};

export default ProofSubmission;
