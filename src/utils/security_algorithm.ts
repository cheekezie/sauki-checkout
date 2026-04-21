/**
 * Security module powered by the native Web Crypto API (SubtleCrypto).
 * Replaces Node.js crypto polyfills for better performance and smaller bundle sizes.
 */

// Basic base64 conversion helpers for browsers
const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
};

const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
};

// Key derivation helper
const getEncryptionKey = async (key: string): Promise<CryptoKey> => {
  const encoder = new TextEncoder();
  const encodedKey = encoder.encode(key);

  // Revert to original truncation method for backend compatibility
  const keyData = new Uint8Array(32);
  keyData.set(encodedKey.slice(0, 32));

  if (import.meta.env.DEV) {
    console.log('🔑 [getEncryptionKey] Key bytes length:', keyData.length);
  }

  return await window.crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'AES-GCM' },
    false,
    ['encrypt', 'decrypt']
  );
};

const security = {
  /**
   * Encryption with AES-256-GCM (Authenticated Encryption)
   * @param data - utf8 string to encrypt
   * @param key - The encryption key (32 bytes for AES-256)
   * @returns Output is a base64 string (IV + auth tag + encrypted data)
   */
  encrypt: async (data: string, key: string): Promise<string> => {
    try {
      const cryptoKey = await getEncryptionKey(key);
      const iv = window.crypto.getRandomValues(new Uint8Array(12));
      const encoder = new TextEncoder();
      const encodedData = encoder.encode(data);

      const encryptedBuffer = await window.crypto.subtle.encrypt(
        {
          name: 'AES-GCM',
          iv: iv,
        },
        cryptoKey,
        encodedData
      );

      // Web Crypto result is [ciphertext][tag] (tag is usually 16 bytes)
      const combinedBuffer = new Uint8Array(encryptedBuffer);
      const tagLength = 16;
      const ciphertext = combinedBuffer.slice(
        0,
        combinedBuffer.length - tagLength
      );
      const tag = combinedBuffer.slice(combinedBuffer.length - tagLength);

      // Combine as [iv (12)][tag (16)][ciphertext] to match Node.js crypto layout
      const combined = new Uint8Array(
        iv.length + tag.length + ciphertext.length
      );
      combined.set(iv, 0);
      combined.set(tag, iv.length);
      combined.set(ciphertext, iv.length + tag.length);

      return arrayBufferToBase64(combined.buffer);
    } catch (error) {
      console.error('Encryption failed:', error);
      throw new Error('Encryption failed');
    }
  },

  /**
   * Decryption with AES-256-GCM (Authenticated Decryption)
   * @param encrypted - base64 string containing IV + auth tag + encrypted data
   * @param key - The decryption key (32 bytes for AES-256)
   * @returns Output is a utf8 string
   */
  decrypt: async (encrypted: string, key: string): Promise<string> => {
    try {
      const cryptoKey = await getEncryptionKey(key);
      const combined = new Uint8Array(base64ToArrayBuffer(encrypted));

      // Extract components assuming [iv (12)][tag (16)][ciphertext] layout
      const iv = combined.slice(0, 12);
      const tag = combined.slice(12, 28);
      const ciphertext = combined.slice(28);

      // Web Crypto expects [ciphertext][tag]
      const dataWithTag = new Uint8Array(ciphertext.length + tag.length);
      dataWithTag.set(ciphertext, 0);
      dataWithTag.set(tag, ciphertext.length);

      const decryptedBuffer = await window.crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv: iv,
        },
        cryptoKey,
        dataWithTag
      );

      const decoder = new TextDecoder();
      return decoder.decode(decryptedBuffer);
    } catch (error) {
      console.error('Decryption failed:', error);
      throw new Error(
        'Decryption failed: Data may be corrupted or tampered with'
      );
    }
  },
};

export default security;
