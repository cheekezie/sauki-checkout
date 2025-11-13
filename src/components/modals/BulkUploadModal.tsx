import { useEffect, useState } from "react";
import { X, Download, Trash2, Upload, FileText } from "lucide-react";
import { Portal } from "../layout/Portal";
import Modal from "./Modal";
import Button from "../ui/Button";

interface UploadedFile {
  name: string;
  size: string;
  progress: number;
}

interface BulkUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  templateName?: string;
  downloadTemplate?: () => void;
  showConfirmation?: boolean;
  confirmationTitle?: string;
  confirmationMessage?: string;
}

const BulkUploadModal = ({
  isOpen,
  onClose,
  onSave,
  templateName = "template",
  downloadTemplate,
  showConfirmation = true,
  confirmationTitle = "Upload successful",
  confirmationMessage = "Your file has been uploaded successfully.",
}: BulkUploadModalProps) => {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [showSuccessConfirmation, setShowSuccessConfirmation] = useState(false);

  const handleSave = () => {
    onSave();
    if (showConfirmation) {
      setShowSuccessConfirmation(true);
    } else {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      setUploadedFile(null);
      setShowSuccessConfirmation(false);
    }
  }, [isOpen]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        progress: 0,
      });
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadedFile((prev) => {
          if (prev && prev.progress < 100) {
            return { ...prev, progress: prev.progress + 10 };
          }
          clearInterval(interval);
          return prev;
        });
      }, 200);
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
  };

  const handleDownloadTemplate = () => {
    if (downloadTemplate) {
      downloadTemplate();
    } else {
      // Default template download
      const templateContent = `Sample Template`;
      const blob = new Blob([templateContent], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${templateName}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  if (!isOpen && !showSuccessConfirmation) return null;

  // Show only confirmation modal if showSuccessConfirmation is true
  if (showSuccessConfirmation) {
    return (
      <Modal
        isOpen={showSuccessConfirmation}
        onClose={() => {
          setShowSuccessConfirmation(false);
          onClose();
        }}
        title={confirmationTitle}
        message={confirmationMessage}
        type="success"
        autoCloseDelay={3000}
      />
    );
  }

  return (
    <Portal>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
      >
        <div 
          className="bg-white rounded-lg shadow-xl w-full max-w-2xl animate-in fade-in-0 zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-900">
              Bulk Upload
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            <p className="text-sm text-gray-600">
              Lorem ipsum dolor sit amet consectetur adipiscing elit Ut et massa
              mi. Aliquam in hendrerit urna.
            </p>

            {/* Bulk Template Section */}
            <div className="space-y-3">
              <h3 className="text-base font-semibold text-gray-900">
                Bulk Template
              </h3>
              <div className="border border-gray-200 rounded-lg p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {templateName}_Template.pdf
                    </p>
                    <p className="text-xs text-gray-500">16 MB</p>
                  </div>
                </div>
                <button
                  onClick={handleDownloadTemplate}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Download className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Upload Area */}
            <div>
              <label
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-10 h-10 text-gray-400 mb-3" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    CSV, XLSX, or XLS (MAX. 10MB)
                  </p>
                </div>
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileUpload}
                />
              </label>

              {/* Uploaded File Display */}
              {uploadedFile && (
                <div className="mt-4 bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-5 h-5 text-gray-600" />
                      <span className="text-sm font-medium text-gray-900">
                        {uploadedFile.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        ({uploadedFile.size})
                      </span>
                    </div>
                    <button
                      onClick={handleRemoveFile}
                      className="text-red-600 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  {uploadedFile.progress < 100 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <span>Uploading...</span>
                        <span>{uploadedFile.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadedFile.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  {uploadedFile.progress === 100 && (
                    <p className="text-sm text-green-600 font-medium">
                      Upload complete! (100%)
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
            <Button
              type="button"
              onClick={onClose}
              variant="secondary"
              size="sm"
              fullWidth={false}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              variant="secondary"
              size="sm"
              fullWidth={false}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </Portal>
  );
};

export default BulkUploadModal;
