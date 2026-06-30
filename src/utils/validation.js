export const validators = {
  required: (value, message = "This field is required") => {
    if (value === null || value === undefined || String(value).trim() === "") return message;
    return "";
  },

  minLength: (min, message) => (value) => {
    if (!value) return "";
    if (String(value).trim().length < min) return message || `Minimum ${min} characters required`;
    return "";
  },

  maxLength: (max, message) => (value) => {
    if (!value) return "";
    if (String(value).trim().length > max) return message || `Maximum ${max} characters allowed`;
    return "";
  },

  numeric: (value, message = "Enter numbers only") => {
    if (!value && value !== 0) return "";
    if (!/^\d+$/.test(String(value).trim())) return message;
    return "";
  },

  decimal: (value, message = "Enter a valid number") => {
    if (!value && value !== 0) return "";
    if (!/^\d+(\.\d+)?$/.test(String(value).trim())) return message;
    return "";
  },

  signedDecimal: (value, message = "Enter a valid number") => {
    if (!value && value !== 0) return "";
    if (!/^-?\d+(\.\d+)?$/.test(String(value).trim())) return message;
    return "";
  },

  min: (minVal, message) => (value) => {
    if (!value && value !== 0) return "";
    const num = parseFloat(value);
    if (isNaN(num) || num < minVal) return message || `Minimum value is ${minVal}`;
    return "";
  },

  max: (maxVal, message) => (value) => {
    if (!value && value !== 0) return "";
    const num = parseFloat(value);
    if (isNaN(num) || num > maxVal) return message || `Maximum value is ${maxVal}`;
    return "";
  },

  email: (value, message = "Enter a valid email address") => {
    if (!value) return "";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim())) return message;
    return "";
  },

  phone: (value, message = "Enter a valid phone number") => {
    if (!value) return "";
    const cleaned = String(value).replace(/[\s\-()]/g, "");
    if (!/^\+?\d{10,15}$/.test(cleaned)) return message;
    return "";
  },

  latitude: (value, message = "Latitude must be between -90 and 90") => {
    if (!value && value !== 0) return "";
    const err = validators.signedDecimal(value);
    if (err) return err;
    const num = parseFloat(value);
    if (num < -90 || num > 90) return message;
    return "";
  },

  longitude: (value, message = "Longitude must be between -180 and 180") => {
    if (!value && value !== 0) return "";
    const err = validators.signedDecimal(value);
    if (err) return err;
    const num = parseFloat(value);
    if (num < -180 || num > 180) return message;
    return "";
  },

  time: (value, message = "Enter time in HH:MM format") => {
    if (!value) return "";
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(String(value).trim())) return message;
    return "";
  },
};

export function validateForm(values, rules) {
  const errors = {};
  let isValid = true;

  Object.keys(rules).forEach((field) => {
    const fieldRules = rules[field];
    const value = values[field];

    for (const rule of fieldRules) {
      const error = typeof rule === "function" ? rule(value) : rule;
      if (error) {
        errors[field] = error;
        isValid = false;
        break;
      }
    }
  });

  return { errors, isValid };
}

export function sanitizeNumericInput(value, allowDecimal = false) {
  if (!value) return "";
  if (allowDecimal) {
    let cleaned = value.replace(/[^\d.]/g, "");
    const parts = cleaned.split(".");
    if (parts.length > 2) cleaned = parts[0] + "." + parts.slice(1).join("");
    return cleaned;
  }
  return value.replace(/\D/g, "");
}

export function sanitizeSignedDecimal(value) {
  if (!value) return "";
  let cleaned = value.replace(/[^\d.\-]/g, "");
  if (cleaned.indexOf("-") > 0) cleaned = cleaned.replace(/-/g, "");
  if (cleaned.startsWith("-")) cleaned = "-" + cleaned.slice(1).replace(/-/g, "");
  const parts = cleaned.replace(/^-/, "").split(".");
  if (parts.length > 2) {
    const fixed = parts[0] + "." + parts.slice(1).join("");
    cleaned = cleaned.startsWith("-") ? "-" + fixed : fixed;
  }
  return cleaned;
}
