import { useState } from "react";
import Input from "../ui/Input";
import FormModal from "./FormModal";

interface AddScoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (scoreData: {
    domain: string;
    score: number;
    totalScore: number;
  }) => void;
}

const AddScoreModal = ({ isOpen, onClose, onSave }: AddScoreModalProps) => {
  const [domain, setDomain] = useState("Neatness");
  const [score, setScore] = useState("0.0");
  const [totalScore, setTotalScore] = useState("0.0");

  const handleSubmit = () => {
    onSave({
      domain,
      score: parseFloat(score),
      totalScore: parseFloat(totalScore),
    });
    // Reset form
    setDomain("Neatness");
    setScore("0.0");
    setTotalScore("0.0");
    onClose();
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Score"
      onSave={handleSubmit}
      onCancel={onClose}
      saveText="Submit"
      cancelText="Cancel"
      maxWidth="max-w-md"
    >
      <div className="space-y-4">
        <Input
          label="Domain"
          name="domain"
          value={domain}
          onChange={(value) => setDomain(value)}
          placeholder="Neatness"
          required
        />

        <Input
          label="Score"
          name="score"
          type="number"
          value={score}
          onChange={(value) => setScore(value)}
          placeholder="0.0"
          required
        />

        <Input
          label="Total Score"
          name="totalScore"
          type="number"
          value={totalScore}
          onChange={(value) => setTotalScore(value)}
          placeholder="0.0"
          required
        />
      </div>
    </FormModal>
  );
};

export default AddScoreModal;
