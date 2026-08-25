/**
 * SYNANTO 2K26 - Input Safety & Moderation Engine
 * Client-side sanitization and blocklist validation
 */

const BLOCKED_WORDS = [
  'admin', 'root', 'system', 'moderator', 'null', 'undefined',
  'fuck', 'shit', 'bitch', 'asshole', 'cunt', 'dick', 'cock', 'pussy',
  'nigger', 'nigga', 'faggot', 'slut', 'whore', 'bastard', 'retard',
  'kill', 'nazi', 'hitler', 'terrorist', 'isis', 'rape', 'pedophile'
];

/**
 * Sanitize raw string against XSS & control characters
 */
export function sanitizeCallSign(input) {
  if (typeof input !== 'string') return '';
  return input
    .replace(/[<>'"`;\\]/g, '') // Strip HTML & script injection characters
    .replace(/[\x00-\x1F\x7F-\x9F]/g, '') // Strip non-printable control characters
    .trim()
    .slice(0, 20); // Hard cap at 20 characters
}

/**
 * Validate call-sign against profanity, length, and format
 * Returns { isValid: boolean, error: string | null }
 */
export function validateCallSign(input) {
  const sanitized = sanitizeCallSign(input);

  if (!sanitized) {
    return { isValid: false, error: 'Call-sign required', sanitized: '' };
  }

  if (sanitized.length < 2) {
    return { isValid: false, error: 'Min 2 characters required', sanitized };
  }

  if (sanitized.length > 20) {
    return { isValid: false, error: 'Max 20 characters allowed', sanitized };
  }

  // Regex: alphanumeric, dashes, underscores, hash, and spaces
  const validPattern = /^[a-zA-Z0-9 _#-]+$/;
  if (!validPattern.test(sanitized)) {
    return { isValid: false, error: 'Only letters, numbers, and # - _ allowed', sanitized };
  }

  // Check normalized lowercase against blocklist
  const normalized = sanitized.toLowerCase().replace(/[^a-z0-9]/g, '');
  const hasProfanity = BLOCKED_WORDS.some(blocked => {
    return normalized.includes(blocked) || blocked.includes(normalized) && normalized.length > 3;
  });

  if (hasProfanity) {
    return {
      isValid: false,
      error: "That call-sign isn't available — try another.",
      sanitized
    };
  }

  return {
    isValid: true,
    error: null,
    sanitized
  };
}
