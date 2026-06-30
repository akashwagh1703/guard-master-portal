import { useState, useCallback } from "react";
import { validateForm } from "../utils/validation";

export default function useFormValidation(initialValues, rules) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const setValue = useCallback((field, value) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setTouched((prev) => ({ ...prev, [field]: true }));
  }, []);

  const setFieldTouched = useCallback((field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }, []);

  const validateField = useCallback(
    (field) => {
      if (!rules[field]) return "";
      for (const rule of rules[field]) {
        const error = typeof rule === "function" ? rule(values[field]) : rule;
        if (error) return error;
      }
      return "";
    },
    [rules, values]
  );

  const validateAll = useCallback(() => {
    const result = validateForm(values, rules);
    setErrors(result.errors);
    setTouched(Object.keys(rules).reduce((acc, k) => ({ ...acc, [k]: true }), {}));
    return result.isValid;
  }, [values, rules]);

  const handleBlur = useCallback(
    (field) => {
      setFieldTouched(field);
      const error = validateField(field);
      setErrors((prev) => ({ ...prev, [field]: error }));
    },
    [validateField, setFieldTouched]
  );

  const resetForm = useCallback(
    (newValues = initialValues) => {
      setValues(newValues);
      setErrors({});
      setTouched({});
    },
    [initialValues]
  );

  const getFieldError = (field) => (touched[field] ? errors[field] : "");

  return {
    values,
    errors,
    touched,
    setValues,
    setValue,
    setFieldTouched,
    handleBlur,
    validateAll,
    resetForm,
    getFieldError,
    setErrors,
  };
}
