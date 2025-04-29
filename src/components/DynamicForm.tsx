import React, { useEffect, useState } from "react";
import { useForm } from "../context/FormContext";
import { useUser } from "../context/UserContext";
import { getFormStructure } from "../services/api";
import FormSection from "./FormSection";
import { FormData } from "../types";

const DynamicForm: React.FC = () => {
  const { user } = useUser();
  const {
    formData,
    setFormData,
    formValues,
    currentSection,
    setCurrentSection,
    validateSection,
  } = useForm();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchForm = async () => {
      if (!user) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await getFormStructure(user.rollNumber);
        setFormData(response.form);
      } catch (err) {
        setError("Failed to load form. Please try again.");
        console.error("Error loading form:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchForm();
  }, [user, setFormData]);

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const handleNext = () => {
    if (!formData) return;

    const isValid = validateSection(currentSection);

    if (isValid && currentSection < formData.sections.length - 1) {
      setCurrentSection(currentSection + 1);
      // Smooth scroll to top of form
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    const isValid = validateSection(currentSection);

    if (isValid) {
      console.log("Form submission data:", formValues);
      alert("Form submitted successfully! Check console for the data.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4 text-center">
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!formData) {
    return null;
  }

  const isLastSection = currentSection === formData.sections.length - 1;

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {formData.formTitle}
        </h1>
        <div className="mt-4 mb-6">
          <div className="h-2 bg-gray-200 rounded-full">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-300"
              style={{
                width: `${
                  ((currentSection + 1) / formData.sections.length) * 100
                }%`,
              }}
            ></div>
          </div>
          <div className="mt-2 text-sm text-gray-600 text-right">
            Section {currentSection + 1} of {formData.sections.length}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {formData.sections.map((section, index) => (
          <FormSection
            key={section.sectionId}
            section={section}
            isVisible={index === currentSection}
          />
        ))}

        <div className="mt-8 flex justify-between">
          {currentSection > 0 ? (
            <button
              type="button"
              onClick={handlePrevious}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            >
              Previous
            </button>
          ) : (
            <div></div> // Spacing
          )}

          {isLastSection ? (
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Submit
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Next
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default DynamicForm;
