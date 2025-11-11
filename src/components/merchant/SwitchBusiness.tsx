import { useState } from "react";
import { Check, Plus } from "lucide-react";
import { useDecodedAuth } from "@/hooks/useDecodedAuth";
import { useOrg } from "@/hooks/useOrg";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import AddOrganizationModal from "../modals/AddOrganizationModal";
import { logger } from "@/services/logger.service";

interface prop {
  onClose: () => void;
}
const SwitchBusiness = ({ onClose }: prop) => {
  const { user, hasPermission } = useDecodedAuth();
  const { activeOrgId, setActiveOrgId } = useOrg();
  const { switchOrganization } = useAuth();
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();
  const [isSwitching, setIsSwitching] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Check if user has permission to create organizations
  const canAddOrganization = hasPermission("organization.write");

  const admin: any = user || {};
  const organizations: any[] = Array.isArray(admin?.organizations)
    ? admin.organizations
    : [];
  
  // Get current organization ID - handle both object and string formats
  let currentOrgId: string | undefined = activeOrgId || undefined;
  if (!currentOrgId) {
    if (admin?.organization?._id) {
      currentOrgId = admin.organization._id;
    } else if (typeof admin?.organization === 'string') {
      currentOrgId = admin.organization;
    }
  }

  // Filter out the current organization - use strict comparison to handle different formats
  const otherOrganizations = organizations.filter((o) => {
    const orgId = o?._id || o?.id;
    
    // If no current org ID, show all organizations
    if (!currentOrgId) return true;
    
    // If no org ID, exclude it (shouldn't happen, but safety check)
    if (!orgId) return false;
    
    // Compare as strings to handle any type mismatches
    return String(orgId) !== String(currentOrgId);
  });

  const onSelectBusiness = async (orgId: string) => {
    if (isSwitching) return;

    setIsSwitching(orgId);

    logger.debug("Starting organization switch", {
      orgId: orgId,
      currentOrgId: activeOrgId,
      organizationCount: organizations.length,
    });

    try {
      // Use the context method to switch organization (handles auth state update)
      await switchOrganization(orgId);

      // Update active organization ID in context and localStorage
      setActiveOrgId(orgId);

      // Clear all React Query caches
      queryClient.clear();

      // Remove all student-related queries
      queryClient.removeQueries({ queryKey: ["students"] });

      // Clear all cookies that might cache organization-specific data
      if (typeof window !== "undefined" && window.document) {
        const cookiesToClear = [
          "_students_list",
          "_businessConfig",
          "_merchant",
        ];
        cookiesToClear.forEach((cookieName) => {
          // Remove cookie for all paths
          document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
          document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
        });
      }

      // Clear localStorage items that might be organization-specific
      const keysToKeep = ["auth_token", "active_org_id"]; // Keep these, they're updated by the service
      Object.keys(localStorage).forEach((key) => {
        if (!keysToKeep.includes(key)) {
          // Clear any cached data that might be organization-specific
          if (key.startsWith("react-query") || key.startsWith("_cache")) {
            localStorage.removeItem(key);
          }
        }
      });

      // Show success message
      const selectedOrg = organizations.find((o) => o._id === orgId);
      showSuccess(
        "Organization Switched",
        `Successfully switched to ${
          selectedOrg?.organizationName || "selected organization"
        }`
      );

      onClose();

      // NO PAGE RELOAD - The auth context handles state updates
      // Data will refresh automatically via React Query refetching
      logger.debug("Organization switch completed successfully", {
        orgId: orgId,
        orgName: selectedOrg?.organizationName,
      });
    } catch (error: unknown) {
      // Log error details
      logger.error("Organization switch failed", error);

      const errorMessage = error instanceof Error 
        ? error.message 
        : "Failed to switch organization. Please try again.";
      showError("Switch Failed", errorMessage);
      setIsSwitching(null);
    }
  };

  // Helper function to get logo URL from organization object
  // Logo can be at: org.kycDocument?.logo or org.logo
  const getOrgLogo = (org: any): string | null => {
    if (org?.kycDocument?.logo) {
      return org.kycDocument.logo;
    }
    if (org?.logo) {
      return org.logo;
    }
    return null;
  };

  // Helper function to get initials from organization name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const onAddBusiness = () => {
    setIsAddModalOpen(true);
  };

  const handleAddSuccess = () => {
    // Refresh organizations list - the user context should update
    // You might want to refresh the auth context or refetch organizations
    showSuccess(
      "Organization Created",
      "The new organization has been added. You may need to refresh to see it in the list."
    );
    // Optionally refresh the page or refetch user data
    // window.location.reload(); // Uncomment if you want to refresh
  };

  // Check if user only has one organization (the current one)
  const hasOnlyOneOrg = organizations.length === 1;
  const isOnlyOrgCurrent = hasOnlyOneOrg && currentOrgId && organizations.some(
    (o) => String(o?._id || o?.id) === String(currentOrgId)
  );

  return (
    <>
      <div className="max-h-72 overflow-y-auto">
        {isOnlyOrgCurrent ? (
          <div className="px-4 py-3 text-sm text-slate-500">
            You only have access to this Business
          </div>
        ) : otherOrganizations.length === 0 ? (
          canAddOrganization ? (
            <button
              onClick={onAddBusiness}
              className="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-medium text-blue-600 hover:bg-blue-50"
            >
              <Plus className="w-4 h-4" />
              Add Business
            </button>
          ) : (
            <div className="px-4 py-3 text-sm text-slate-500">
              No other businesses available
            </div>
          )
        ) : null}
        {otherOrganizations.map((org) => {
          const isActive = org?._id === currentOrgId;
          const isSwitchingThisOrg = isSwitching === org?._id;
          const logoUrl = getOrgLogo(org);
          return (
            <button
              key={org?._id}
              onClick={() => onSelectBusiness(org?._id)}
              disabled={isSwitching !== null || isActive}
              className={`w-full px-4 py-3 text-left text-sm border-b-2 border-slate-100 truncate flex items-center gap-2 transition-colors ${
                isActive
                  ? "text-blue-600 bg-blue-50 cursor-default"
                  : isSwitchingThisOrg
                  ? "text-slate-400 cursor-not-allowed opacity-60"
                  : isSwitching !== null
                  ? "text-slate-700 cursor-not-allowed opacity-50"
                  : "text-slate-700 hover:bg-blue-50 cursor-pointer"
              }`}
              title={
                isActive
                  ? "Current organization"
                  : isSwitchingThisOrg
                  ? "Switching organization..."
                  : isSwitching !== null
                  ? "Please wait for the current switch to complete"
                  : "Switch to this organization"
              }
            >
              {isActive && (
                <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
              )}
              {isSwitchingThisOrg && (
                <div className="w-4 h-4 border-2 border-slate-300 border-t-transparent rounded-full animate-spin flex-shrink-0" />
              )}
              {/* Logo or Initials */}
              {!isActive && !isSwitchingThisOrg && (
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {logoUrl ? (
                    <img
                      src={logoUrl}
                      alt={org?.organizationName || "Organization"}
                      className="w-full h-full object-cover rounded-full"
                      onError={(e) => {
                        // Fallback to initials if image fails to load
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = `<span class="text-blue-600 font-semibold text-xs">${getInitials(
                            org?.organizationName || "ORG"
                          )}</span>`;
                        }
                      }}
                    />
                  ) : (
                    <span className="text-blue-600 font-semibold text-xs">
                      {getInitials(org?.organizationName || "ORG")}
                    </span>
                  )}
                </div>
              )}
              <span className="truncate">
                {org?.organizationName || "Unnamed Organization"}
              </span>
            </button>
          );
        })}
      </div>

      {/* ➕ Add new - Only show if user has permission */}
      {canAddOrganization && otherOrganizations.length > 0 && (
        <div className="border-t border-slate-200">
          <button
            onClick={onAddBusiness}
            className="flex items-center justify-center gap-2 w-full py-3 text-sm font-medium text-blue-600 hover:bg-blue-50"
          >
            <Plus className="w-4 h-4" />
            Add Business
          </button>
        </div>
      )}

      {/* Add Organization Modal */}
      <AddOrganizationModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleAddSuccess}
      />
    </>
  );
};

export default SwitchBusiness;
