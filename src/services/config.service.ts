import { RequestService } from './api/client';
import { ConfigEndpoints } from './api/endpoints';

// File upload response interface
export interface UploadedFile {
  url: string;
  publicId: string;
  name: string;
  mimeType: string;
  fileSize: number;
  fileFormat?: string;
}

export interface FileUploadResponse {
  data: UploadedFile[];
  status: string;
}

// Config enums response interface
export interface ConfigEnums {
  adminRoleEnums: string[];
  organizationCategoryEnums: string[];
  schoolCategoryBoardEnums: string[];
  schoolTypeEnums: string[];
  kycDocumentStatusEnums: string[];
}

export interface ConfigEnumsResponse {
  data: ConfigEnums;
  status: string;
}

// Domain config response interface
export interface DomainConfig {
  publicUrl: string;
  adminUrl: string;
  logo: string;
  logoDark: string;
  logoLight: string;
  favicon: string;
  htmlMetaTitle: string;
  htmlMetaDescription: string;
  primaryColor: string;
  secondaryColor: string;
  slogan: string;
  poweredBy: string;
  poweredByUrl: string;
  backgroundImage: string;
  images: string[];
  name: string;
  shortName: string;
  isDefault: boolean;
}

export interface DomainConfigResponse {
  data: DomainConfig;
  status: string;
}

// Verify account response interface
export interface VerifyAccountData {
  accountNumber: string;
  accountName: string;
  bankCode: string;
}

export interface VerifyAccountResponse {
  data: VerifyAccountData;
  status: string;
}

// Verify account request body
export interface VerifyAccountRequest {
  bankCode: string;
  accountNumber: string;
}

/**
 * Config Service
 * Provides methods for file uploads, config enums, domain config, and account verification
 */
class ConfigService {
  /**
   * Upload one or more files
   * @param files - Array of File objects to upload
   * @param additionalFields - Optional additional form fields
   * @returns Response with uploaded file URLs and metadata
   */
  async uploadFiles(
    files: File[],
    additionalFields?: Record<string, string>
  ): Promise<FileUploadResponse> {
    const formData = new FormData();
    
    // Append all files with the 'upload' field name
    files.forEach((file) => {
      formData.append('upload', file);
    });
    
    // Append additional form fields if provided
    if (additionalFields) {
      Object.entries(additionalFields).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }
    
    const response = await RequestService.postFile<FileUploadResponse>(
      ConfigEndpoints.fileUpload,
      formData
    );
    
    return response;
  }

  /**
   * Upload a single file
   * @param file - File object to upload
   * @param additionalFields - Optional additional form fields
   * @returns Response with uploaded file URL and metadata
   */
  async uploadFile(
    file: File,
    additionalFields?: Record<string, string>
  ): Promise<FileUploadResponse> {
    return this.uploadFiles([file], additionalFields);
  }

  /**
   * Convert CSV file
   * @param file - CSV File object to convert
   * @returns Promise that resolves when conversion is complete
   */
  async convertCsv(file: File): Promise<void> {
    const formData = new FormData();
    formData.append('upload', file);
    
    await RequestService.postFile<void>(
      ConfigEndpoints.convertCsv,
      formData
    );
  }

  /**
   * Get configuration enums
   * @returns Response with all config enums
   */
  async getEnums(): Promise<ConfigEnumsResponse> {
    const response = await RequestService.get<ConfigEnumsResponse>(
      ConfigEndpoints.getEnums
    );
    
    return response;
  }

  /**
   * Get domain configuration
   * @returns Response with domain config data
   */
  async getDomain(): Promise<DomainConfigResponse> {
    const response = await RequestService.get<DomainConfigResponse>(
      ConfigEndpoints.getDomain
    );
    
    return response;
  }

  /**
   * Verify bank account number
   * @param accountNumber - Bank account number to verify
   * @param bankCode - Bank code
   * @param requestBody - Optional request body with bankCode and accountNumber (alternative to query params)
   * @returns Response with verified account details
   */
  async verifyAccount(
    accountNumber: string,
    bankCode: string,
    requestBody?: VerifyAccountRequest
  ): Promise<VerifyAccountResponse> {
    // If requestBody is provided, use POST with body
    if (requestBody) {
      const response = await RequestService.post<VerifyAccountResponse>(
        ConfigEndpoints.verifyAccount,
        requestBody
      );
      return response;
    }
    
    // Otherwise, use POST with query params (API expects POST, not GET)
    const queryParams = new URLSearchParams({
      accountNumber,
      bankCode,
    });
    
    // Use POST with query params in URL
    const url = `${ConfigEndpoints.verifyAccount}?${queryParams.toString()}`;
    const response = await RequestService.post<VerifyAccountResponse>(
      url,
      {} // Empty body for POST with query params
    );
    
    return response;
  }

  /**
   * Get list of banks
   * @returns Response with list of banks
   */
  async getBankList(): Promise<{ data: Array<{ code: string; name: string }>; status: string }> {
    const response = await RequestService.get<{ data: Array<{ code: string; name: string }>; status: string }>(
      ConfigEndpoints.getBankList
    );
    
    return response;
  }
}

export default new ConfigService();

