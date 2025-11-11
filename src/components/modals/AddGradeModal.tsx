import { useState } from "react";
import Input from "../ui/Input";
import FormModal from "./FormModal";

interface AddGradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (gradeData: {
    subject: string;
    test1: string;
    test2: string;
    test3: string;
    examScore: string;
    totalGradeScore: string;
  }) => void;
}

const AddGradeModal = ({ isOpen, onClose, onSave }: AddGradeModalProps) => {
  const [subject, setSubject] = useState("English Language");
  const [test1, setTest1] = useState("0.0");
  const [test2, setTest2] = useState("0.0");
  const [test3, setTest3] = useState("0.0");
  const [examScore, setExamScore] = useState("0.0");
  const [totalGradeScore, setTotalGradeScore] = useState("0.0");

  const handleSubmit = () => {
    onSave({
      subject,
      test1,
      test2,
      test3,
      examScore,
      totalGradeScore,
    });
    // Reset form
    setSubject("English Language");
    setTest1("0.0");
    setTest2("0.0");
    setTest3("0.0");
    setExamScore("0.0");
    setTotalGradeScore("0.0");
    onClose();
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Grade"
      onSave={handleSubmit}
      onCancel={onClose}
      saveText="Submit"
      cancelText="Cancel"
      maxWidth="max-w-md"
    >
      <div className="space-y-4">
        <Input
          label="Subject"
          name="subject"
          value={subject}
          onChange={(value) => setSubject(value)}
          placeholder="English Language"
          required
        />

        <div className="grid grid-cols-3 gap-4">
          <Input
            label="Test 1"
            name="test1"
            type="number"
            value={test1}
            onChange={(value) => setTest1(value)}
            placeholder="0.0"
            required
          />
          <Input
            label="Test 2"
            name="test2"
            type="number"
            value={test2}
            onChange={(value) => setTest2(value)}
            placeholder="0.0"
            required
          />
          <Input
            label="Test 3"
            name="test3"
            type="number"
            value={test3}
            onChange={(value) => setTest3(value)}
            placeholder="0.0"
            required
          />
        </div>

        <Input
          label="Exam Score"
          name="examScore"
          type="number"
          value={examScore}
          onChange={(value) => setExamScore(value)}
          placeholder="0.0"
          required
        />

        <Input
          label="Total Grade Score"
          name="totalGradeScore"
          type="number"
          value={totalGradeScore}
          onChange={(value) => setTotalGradeScore(value)}
          placeholder="0.0"
          required
        />
      </div>
    </FormModal>
  );
};

export default AddGradeModal;
