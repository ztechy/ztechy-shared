import { parsePhoneNumber, isValidPhoneNumber } from "react-phone-number-input";

export const isValidPhone = (phone: string): boolean => {
  if (!phone) return false;

  try {
    // Parse the phone number
    const phoneNumber = parsePhoneNumber(phone);

    // If not Egyptian, use standard validation
    if (phoneNumber?.country !== "EG") {
      return isValidPhoneNumber(phone);
    }

    // For Egyptian numbers, use STRICT validation
    const nationalNumber = phoneNumber.nationalNumber;

    // Egyptian Mobile Numbers: MUST be EXACTLY 11 digits (01X XXXX XXXX)
    // Valid prefixes: 010, 011, 012, 015
    const mobilePattern = /^1[0125]\d{8}$/;
    const isValidMobile =
      mobilePattern.test(nationalNumber) && nationalNumber.length === 10;

    // Egyptian Landline Numbers:
    // Cairo (02): Must be 10 digits (02 XXXX XXXX)
    // Alexandria (03): Must be 9 digits (03 XXX XXXX)
    // Other cities (04-09): Must be 9 digits (0X XXX XXXX)
    const isValidCairoLandline =
      /^02\d{8}$/.test(nationalNumber) && nationalNumber.length === 10;
    const isValidAlexLandline =
      /^03\d{7}$/.test(nationalNumber) && nationalNumber.length === 9;
    const isValidOtherLandline =
      /^0[4-9]\d{7}$/.test(nationalNumber) && nationalNumber.length === 9;

    const isValid =
      isValidMobile ||
      isValidCairoLandline ||
      isValidAlexLandline ||
      isValidOtherLandline;

    return isValid;
  } catch (error) {
    console.error("Phone parsing error:", error);

    // Fallback: Manual validation without parsing
    const cleaned = phone.replace(/[\s\-\(\)]/g, "");

    // With +20 prefix
    if (cleaned.startsWith("+20")) {
      const numberPart = cleaned.substring(3);

      // Mobile: 11 digits starting with 01[0125]
      if (/^1[0125]\d{8}$/.test(numberPart) && numberPart.length === 10) {
        return true;
      }

      // Cairo landline: 10 digits starting with 02
      if (/^02\d{8}$/.test(numberPart) && numberPart.length === 10) {
        return true;
      }

      // Alex landline: 9 digits starting with 03
      if (/^03\d{7}$/.test(numberPart) && numberPart.length === 9) {
        return true;
      }

      // Other landlines: 9 digits starting with 04-09
      if (/^0[4-9]\d{7}$/.test(numberPart) && numberPart.length === 9) {
        return true;
      }

      return false;
    }

    // Without prefix (assume Egyptian)
    if (cleaned.startsWith("01")) {
      return /^01[0125]\d{8}$/.test(cleaned) && cleaned.length === 11;
    }

    return false;
  }
};
