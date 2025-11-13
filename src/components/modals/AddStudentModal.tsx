import { useState, useEffect } from "react";
import { X, Upload } from "lucide-react";
import { Portal } from "../layout/Portal";
import {
  GENDER_OPTIONS,
  STUDENT_CLASS_OPTIONS,
} from "@/constants/sharedOptions";

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (studentData: StudentFormData) => void;
  editMode?: boolean;
  studentData?: any;
}

interface StudentFormData {
  fullName: string;
  gender: string;
  class: string;
  subclass: string;
}

interface CSVFormData {
  class: string;
  subclass: string;
  file: File | null;
}

const AddStudentModal = ({
  isOpen,
  onClose,
  onSave,
  editMode = false,
  studentData,
}: AddStudentModalProps) => {
  const [activeTab, setActiveTab] = useState("Single Student");
  const [formData, setFormData] = useState<StudentFormData>({
    fullName: editMode && studentData ? studentData.name : "",
    gender: editMode && studentData ? studentData.gender : "",
    class: editMode && studentData ? studentData.class : "",
    subclass: "",
  });
  const [csvData, setCsvData] = useState<CSVFormData>({
    class: "",
    subclass: "",
    file: null,
  });

  // Update form data when modal opens in edit mode
  useEffect(() => {
    if (isOpen && editMode && studentData) {
      setFormData({
        fullName: studentData.name || "",
        gender: studentData.gender || "",
        class: studentData.class || "",
        subclass: "",
      });
    } else if (isOpen && !editMode) {
      // Reset form when opening in add mode
      setFormData({
        fullName: "",
        gender: "",
        class: "",
        subclass: "",
      });
    }
  }, [isOpen, editMode, studentData]);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleSave = () => {
    if (activeTab === "Single Student") {
      if (formData.fullName.trim() && formData.gender && formData.class) {
        onSave(formData);
        setFormData({
          fullName: "",
          gender: "",
          class: "",
          subclass: "",
        });
        onClose();
      }
    } else {
      if (csvData.file && csvData.class) {
        setCsvData({
          class: "",
          subclass: "",
          file: null,
        });
        onClose();
      }
    }
  };

  const handleInputChange = (field: keyof StudentFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCsvInputChange = (field: keyof CSVFormData, value: string) => {
    setCsvData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileChange = (file: File) => {
    setCsvData((prev) => ({
      ...prev,
      file: file,
    }));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileChange(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileChange(files[0]);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const tabs = ["Single Student", "Multiple Students (CSV)"];

  return (
    <Portal>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        onClick={handleBackdropClick}
      >
        <div className="bg-white rounded-lg p-6 w-[500px] max-w-lg mx-4 relative shadow-xl">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg transition-colors hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4 text-dark" />
          </button>

          {/* Title */}
          <h2 className="text-xl font-bold text-gray-900 text-center mb-6">
            {editMode ? "Edit Student" : "Add Student"}
          </h2>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab
                      ? "border-secondary text-secondary"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          {/* Form Fields */}
          <div className="space-y-4 mb-6">
            {activeTab === "Single Student" ? (
              <>
                {/* Full Name */}
                <div>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) =>
                      handleInputChange("fullName", e.target.value)
                    }
                    placeholder="Student full name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    autoFocus
                  />
                </div>

                {/* Gender */}
                <div>
                  <select
                    value={formData.gender}
                    onChange={(e) =>
                      handleInputChange("gender", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  >
                    <option value="">Gender</option>
                    {GENDER_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Class */}
                <div>
                  <select
                    value={formData.class}
                    onChange={(e) => handleInputChange("class", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  >
                    <option value="">--Select class--</option>
                    {STUDENT_CLASS_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Subclass */}
                <div>
                  <input
                    type="text"
                    value={formData.subclass}
                    onChange={(e) =>
                      handleInputChange("subclass", e.target.value)
                    }
                    placeholder="Select Subclass"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
              </>
            ) : (
              <>
                {/* Download Sample File */}
                <div className="text-sm text-gray-600 mb-4">
                  Download Sample File Here. Do not change the headers !
                </div>

                {/* File Upload Area */}
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    isDragOver
                      ? "border-green-400 bg-green-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <Upload className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">
                    Drop your students file here or{" "}
                    <label className="text-pink-500 cursor-pointer hover:underline">
                      Browse
                      <input
                        type="file"
                        accept=".csv,.xls,.xlsx"
                        onChange={handleFileInputChange}
                        className="hidden"
                      />
                    </label>
                  </p>
                  <p className="text-xs text-gray-500">
                    Supports: CSV, XLS, XLSX
                  </p>
                  {csvData.file && (
                    <p className="text-sm text-green-600 mt-2">
                      Selected: {csvData.file.name}
                    </p>
                  )}
                </div>

                {/* Class Selection for CSV */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Class
                  </label>
                  <select
                    value={csvData.class}
                    onChange={(e) =>
                      handleCsvInputChange("class", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  >
                    <option value="">--Select class--</option>
                    {STUDENT_CLASS_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Subclass Selection for CSV */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subclass
                  </label>
                  <input
                    type="text"
                    value={csvData.subclass}
                    onChange={(e) =>
                      handleCsvInputChange("subclass", e.target.value)
                    }
                    placeholder="Select Subclass"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
              </>
            )}
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="w-full border border-pink-500 text-pink-500 py-3 px-4 rounded-lg hover:bg-pink-50 transition-colors font-medium"
          >
            Save
          </button>
        </div>
      </div>
    </Portal>
  );
};

export default AddStudentModal;
