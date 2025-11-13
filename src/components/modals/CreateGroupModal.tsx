import { useState, useEffect } from "react";
import { ArrowLeft, X, Users } from "lucide-react";
import Input from "../ui/Input";
import Select from "../ui/Select";
import SearchableSelect from "../ui/SearchableSelect";
import Button from "../ui/Button";
import { Portal } from "../layout/Portal";
import ConfigService from "@/services/config.service";
import { ComponentLoading } from "../ui/LoadingSpinner";
import { useToast } from "@/hooks/useToast";
import { useFormValidation } from "@/hooks/useFormValidation";

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    name: string;
    organizationType: string;
    email: string;
    phone: string;
    description?: string;
    managePayment: boolean;
    bankCode?: string;
    accountNumber?: string;
    accountName?: string;
  }) => Promise<void>;
}

interface Bank {
  code?: string;
  bankCode?: string;
  id?: string;
  name?: string;
  bankName?: string;
  [key: string]: any;
}

const CreateGroupModal = ({
  isOpen,
  onClose,
  onSave,
}: CreateGroupModalProps) => {
  const { showError, showSuccess } = useToast();
  const [step, setStep] = useState(1);
  const [banks, setBanks] = useState<Bank[]>([]);
  const [isLoadingBanks, setIsLoadingBanks] = useState(false);
  const [isVerifyingAccount, setIsVerifyingAccount] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    formData,
    errors,
    updateField,
    setFormData,
    clearErrors,
  } = useFormValidation({
    name: "",
    organizationType: "",
    email: "",
    phone: "07030000000",
    description: "",
    managePayment: false,
    bankCode: "",
    accountNumber: "",
    accountName: "",
  });

  // Fetch banks list when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchBanks();
    } else {
      // Reset form when modal closes
      setFormData({
        name: "",
        organizationType: "",
        email: "",
        phone: "07030000000",
        description: "",
        managePayment: false,
        bankCode: "",
        accountNumber: "",
        accountName: "",
      });
      clearErrors();
      setStep(1);
    }
  }, [isOpen, setFormData, clearErrors]);

  const fetchBanks = async () => {
    setIsLoadingBanks(true);
    try {
      const response = await ConfigService.getBankList();
      if (response && response.data && Array.isArray(response.data)) {
        setBanks(response.data);
      } else {
        setBanks([]);
      }
    } catch (error) {
      setBanks([]);
    } finally {
      setIsLoadingBanks(false);
    }
  };

  const handleVerifyAccount = async () => {
    const accountNumber = formData.accountNumber as string;
    if (
      !formData.bankCode ||
      !accountNumber ||
      accountNumber.length !== 10 ||
      !/^\d{10}$/.test(accountNumber)
    ) {
      return;
    }

    setIsVerifyingAccount(true);
    try {
      const response = await ConfigService.verifyAccount(
        formData.accountNumber as string,
        formData.bankCode as string,
        {
          accountNumber: formData.accountNumber as string,
          bankCode: formData.bankCode as string,
        }
      );
      if (response && response.data && response.data.accountName) {
        setFormData({
          ...formData,
          accountName: response.data.accountName,
        });
        showSuccess(
          "Account Verified",
          "Account name has been auto-filled successfully."
        );
      }
    } catch (error: any) {
      const errorMessage =
        error?.message ||
        error?.response?.data?.message ||
        "Failed to verify account. Please enter the account name manually.";
      showError("Verification Failed", errorMessage);
    } finally {
      setIsVerifyingAccount(false);
    }
  };

  const handleNext = () => {
    // Validate step 1 fields
    if (
      !formData.name ||
      !formData.organizationType ||
      !formData.email ||
      !formData.phone
    ) {
      showError("Validation Error", "Please fill in all required fields.");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email as string)) {
      showError("Validation Error", "Please enter a valid email address.");
      return;
    }

    // Basic phone validation (10 digits)
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.phone as string)) {
      showError(
        "Validation Error",
        "Please enter a valid 10-digit phone number."
      );
      return;
    }

    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const managePayment = formData.managePayment as boolean;
      await onSave({
        name: formData.name as string,
        organizationType: formData.organizationType as string,
        email: formData.email as string,
        phone: formData.phone as string,
        description: formData.description as string,
        managePayment,
        ...(managePayment && {
          bankCode: formData.bankCode as string,
          accountNumber: formData.accountNumber as string,
          accountName: formData.accountName as string,
        }),
      });
      onClose();
    } catch (error) {
    } finally {
      setIsSubmitting(false);
    }
  };

  const bankOptions = banks
    .filter((bank) => {
      const hasCode = bank.code || bank.bankCode || bank.id;
      const hasName = bank.name || bank.bankName;
      return hasCode && hasName;
    })
    .map((bank) => ({
      value: bank.code || bank.bankCode || bank.id || "",
      label: bank.name || bank.bankName || "",
    }))
    .filter((option) => option.value && option.label);

  const organizationTypeOptions = [
    { value: "school", label: "School" },
    { value: "other", label: "Other" },
  ];

  if (!isOpen) return null;

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
          className="relative w-full max-w-2xl bg-white rounded-xl shadow-lg max-h-[95vh] flex flex-col animate-in fade-in-0 zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-offwhite flex-shrink-0">
            <div className="flex items-center space-x-3">
              {step === 2 && (
                <button
                  onClick={handleBack}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
              )}
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-primary" />
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Create Group
                  </h2>
                  {step === 2 && (
                    <p className="text-sm text-primary">Resource Management</p>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors text-primary"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {step === 1 && (
              <div className="space-y-4">
                <Input
                  label="Name"
                  name="name"
                  value={formData.name as string}
                  onChange={(value) => updateField("name", value)}
                  placeholder="Group name"
                  required
                  error={errors.name}
                />

                <Select
                  label="Organizations Type"
                  name="organizationType"
                  value={formData.organizationType as string}
                  onChange={(value) => updateField("organizationType", value)}
                  options={organizationTypeOptions}
                  placeholder="-- Organizations Type --"
                  required
                  error={errors.organizationType}
                />

                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email as string}
                  onChange={(value) => updateField("email", value)}
                  placeholder="e.g admin@group.com"
                  required
                  error={errors.email}
                />

                <Input
                  label="Phone (will be used default admin)"
                  name="phone"
                  type="tel"
                  value={formData.phone as string}
                  onChange={(value) => {
                    const numericValue = value
                      .replace(/\D/g, "")
                      .substring(0, 10);
                    updateField("phone", numericValue);
                  }}
                  placeholder="10 digit phone number"
                  required
                  maxLength={10}
                  error={errors.phone}
                />

                <Input
                  label="Description (optional)"
                  name="description"
                  value={formData.description as string}
                  onChange={(value) => updateField("description", value)}
                  placeholder="Description"
                />
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <p className="text-base font-medium text-gray-900 mb-4">
                    Do you want to manage fees/payment for all organizations ?
                  </p>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="managePayment"
                        checked={formData.managePayment === true}
                        onChange={() =>
                          setFormData({ ...formData, managePayment: true })
                        }
                        className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                      />
                      <span
                        className={
                          formData.managePayment === true
                            ? "text-primary font-medium"
                            : "text-gray-700"
                        }
                      >
                        Yes
                      </span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="managePayment"
                        checked={formData.managePayment === false}
                        onChange={() =>
                          setFormData({ ...formData, managePayment: false })
                        }
                        className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                      />
                      <span
                        className={
                          formData.managePayment === false
                            ? "text-primary font-medium"
                            : "text-gray-700"
                        }
                      >
                        No
                      </span>
                    </label>
                  </div>
                </div>

                {formData.managePayment === true && (
                  <div className="space-y-4 pt-4 border-t border-gray-200">
                    <div>
                      {isLoadingBanks ? (
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-900">
                            Bank
                          </label>
                          <div className="relative">
                            <div className="w-full rounded-lg border border-gray-300 px-4 py-4 bg-gray-50 flex items-center justify-center">
                              <ComponentLoading size="sm" />
                              <span className="ml-2 text-sm text-gray-500">
                                Loading banks...
                              </span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <SearchableSelect
                          name="bank"
                          label="Bank"
                          value={formData.bankCode as string}
                          onChange={(value) =>
                            setFormData({
                              ...formData,
                              bankCode: value,
                              accountName: "",
                            })
                          }
                          disabled={isSubmitting || isVerifyingAccount}
                          placeholder="Select Bank"
                          options={bankOptions}
                          searchable={true}
                          maxHeight="450px"
                        />
                      )}
                    </div>

                    <Input
                      label="Account Number"
                      name="accountNumber"
                      type="tel"
                      value={formData.accountNumber as string}
                      onChange={(value) => {
                        const numericValue = value
                          .replace(/\D/g, "")
                          .substring(0, 10);
                        setFormData({
                          ...formData,
                          accountNumber: numericValue,
                          accountName: "",
                        });
                      }}
                      placeholder="10 digit bank account number"
                      disabled={isSubmitting || isVerifyingAccount}
                      maxLength={10}
                      helperText={
                        isVerifyingAccount ? "Verifying account..." : ""
                      }
                    />

                    <div>
                      <Input
                        label="Account Name"
                        name="accountName"
                        value={formData.accountName as string}
                        onChange={(value) =>
                          setFormData({ ...formData, accountName: value })
                        }
                        placeholder="Enter account name or click verify"
                        disabled={isSubmitting || isVerifyingAccount}
                        helperText={
                          isVerifyingAccount
                            ? "Verifying account..."
                            : "Enter account name manually or click 'Verify Account' to auto-fill"
                        }
                      />
                    </div>

                    <div className="flex justify-end">
                      <Button
                        onClick={handleVerifyAccount}
                        disabled={
                          isSubmitting ||
                          isVerifyingAccount ||
                          !formData.bankCode ||
                          !formData.accountNumber ||
                          (formData.accountNumber as string).length !== 10 ||
                          !/^\d{10}$/.test(formData.accountNumber as string)
                        }
                        className="px-6"
                        fullWidth={false}
                      >
                        {isVerifyingAccount ? "Verifying..." : "Verify Account"}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 p-4 border-t border-gray-200 bg-offwhite flex-shrink-0">
            {step === 1 ? (
              <Button
                onClick={handleNext}
                disabled={isSubmitting}
                className="px-8"
                fullWidth={false}
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={
                  isSubmitting ||
                  (formData.managePayment === true &&
                    (!formData.bankCode ||
                      !formData.accountNumber ||
                      !formData.accountName))
                }
                className="px-8"
                fullWidth={false}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </Portal>
  );
};

export default CreateGroupModal;
