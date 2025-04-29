import React, { createContext, useContext, useState, ReactNode } from "react";
import { FormData, FormValues, FormErrors } from "../types";

interface FormContextType {
  formData: FormData | null;
  setFormData: (data: FormData | null) => void;
  formValues: FormValues;
  setFormValues: (values: FormValues) => void;
  formErrors: FormErrors;
  setFormErrors: (errors: FormErrors) => void;
  currentSection: number;
  setCurrentSection: (section: number) => void;
  validateSection: (sectionIndex: number) => boolean;
  handleInputChange: (
    fieldId: string,
    value: string | string[] | boolean,
    validationError?: string
  ) => void;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [formData, setFormData] = useState<FormData | null>(null);
  const [formValues, setFormValues] = useState<FormValues>({});
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [currentSection, setCurrentSection] = useState<number>(0);

  const handleInputChange = (
    fieldId: string,
    value: string | string[] | boolean,
    validationError?: string
  ) => {
    setFormValues((prev) => ({
      ...prev,
      [fieldId]: value,
    }));

    if (validationError) {
      setFormErrors((prev) => ({
        ...prev,
        [fieldId]: validationError,
      }));
    } else {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  const validateSection = (sectionIndex: number): boolean => {
    if (!formData) return false;

    const section = formData.sections[sectionIndex];
    const newErrors: FormErrors = { ...formErrors };
    let isValid = true;

    section.fields.forEach((field) => {
      const value = formValues[field.fieldId];

      // Check if required field is empty
      if (
        field.required &&
        (!value || (Array.isArray(value) && value.length === 0) || value === "")
      ) {
        newErrors[field.fieldId] =
          field.validation?.message || "This field is required";
        isValid = false;
      }
      // Check min length for string values
      else if (
        typeof value === "string" &&
        field.minLength &&
        value.length < field.minLength
      ) {
        newErrors[
          field.fieldId
        ] = `Minimum length is ${field.minLength} characters`;
        isValid = false;
      }
      // Check max length for string values
      else if (
        typeof value === "string" &&
        field.maxLength &&
        value.length > field.maxLength
      ) {
        newErrors[
          field.fieldId
        ] = `Maximum length is ${field.maxLength} characters`;
        isValid = false;
      }
      // Check if there are any existing validation errors
      else if (formErrors[field.fieldId]) {
        isValid = false;
      }
    });

    setFormErrors(newErrors);
    return isValid;
  };

  return (
    <FormContext.Provider
      value={{
        formData,
        setFormData,
        formValues,
        setFormValues,
        formErrors,
        setFormErrors,
        currentSection,
        setCurrentSection,
        validateSection,
        handleInputChange,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};

export const useForm = (): FormContextType => {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error("useForm must be used within a FormProvider");
  }
  return context;
};
