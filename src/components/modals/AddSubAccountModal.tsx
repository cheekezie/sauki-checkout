import { useState, useEffect } from "react";
import { Building2 } from "lucide-react";
import Input from "../ui/Input";
import SearchableSelect from "../ui/SearchableSelect";
import FormModal from "./FormModal";
import ConfigService from "@/services/config.service";
import { ComponentLoading } from "../ui/LoadingSpinner";
import { useFormValidation } from "@/hooks/useFormValidation";
import { subAccountSchema } from "@/schemas/subAccountSchemas";

interface AddSubAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { bankCode: string; accountNumber: string }) => Promise<void>;
}

interface Bank {
  code?: string;
  bankCode?: string;
  id?: string;
  name?: string;
  bankName?: string;
  [key: string]: any; // Allow for other properties
}

const AddSubAccountModal = ({ isOpen, onClose, onSave }: AddSubAccountModalProps) => {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [isLoadingBanks, setIsLoadingBanks] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const {
    formData,
    errors,
    updateFieldWithValidation,
    validateForm,
    setFormData,
    clearErrors,
  } = useFormValidation({
    bankCode: "",
    accountNumber: "",
  });

  // Fetch banks list when modal opens and reset form
  useEffect(() => {
    if (isOpen) {
      fetchBanks();
    } else {
      // Reset form when modal closes
      setFormData({
        bankCode: "",
        accountNumber: "",
      });
      clearErrors();
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

  const handleSave = async () => {
    // Validate form using schema
    if (!validateForm(subAccountSchema)) {
      return;
    }

    setIsSaving(true);
    
    try {
      await onSave({
        bankCode: formData.bankCode as string,
        accountNumber: formData.accountNumber as string,
      });
      // Reset form on success
      setFormData({
        bankCode: "",
        accountNumber: "",
      });
      clearErrors();
      onClose();
    } catch (error) {
    } finally {
      setIsSaving(false);
    }
  };

  const bankOptions = banks
    .filter((bank) => {
      // Check if bank has required properties (handle different possible property names)
      const hasCode = bank.code || bank.bankCode || bank.id;
      const hasName = bank.name || bank.bankName;
      return hasCode && hasName;
    })
    .map((bank) => ({
      value: bank.code || bank.bankCode || bank.id || "",
      label: bank.name || bank.bankName || "",
    }))
    .filter((option) => option.value && option.label);

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Sub Account"
      icon={<Building2 className="w-5 h-5" />}
      onSave={handleSave}
      onCancel={onClose}
      saveText={isSaving ? "Saving..." : "Save"}
      cancelText="Cancel"
      saveDisabled={isSaving || isLoadingBanks || !formData.bankCode || !formData.accountNumber}
      maxWidth="max-w-md"
    >
      <div className="space-y-4">
        {/* Select Bank */}
        <div className="relative">
          {isLoadingBanks ? (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Select Bank
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <div className="w-full rounded-lg border border-gray-300 px-4 py-4 bg-gray-50 flex items-center justify-center">
                  <ComponentLoading size="sm" />
                  <span className="ml-2 text-sm text-gray-500">Loading banks...</span>
                </div>
              </div>
            </div>
          ) : (
            <SearchableSelect
              name="bank"
              label="Select Bank"
              value={formData.bankCode as string}
              onChange={(value) => {
                updateFieldWithValidation("bankCode", value, subAccountSchema);
              }}
              disabled={isSaving}
              required
              error={errors.bankCode}
              placeholder="Select Bank"
              options={bankOptions}
              searchable={true}
              maxHeight="450px"
            />
          )}
        </div>

        {/* Bank Account Number */}
        <div>
          <Input
            name="accountNumber"
            label="Account Number"
            type="tel"
            value={formData.accountNumber as string}
            onChange={(value) => {
              // Limit to 10 digits (Input component with type="tel" already formats to digits)
              const numericValue = value.replace(/\D/g, "").substring(0, 10);
              updateFieldWithValidation("accountNumber", numericValue, subAccountSchema);
            }}
            placeholder="10 digit bank account number"
            disabled={isSaving}
            maxLength={10}
            required
            error={errors.accountNumber}
          />
        </div>
      </div>
    </FormModal>
  );
};

export default AddSubAccountModal;

