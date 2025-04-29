import React from 'react';
import { FormSection as SectionType } from '../types';
import FormField from './FormField';

interface FormSectionProps {
  section: SectionType;
  isVisible: boolean;
}

const FormSection: React.FC<FormSectionProps> = ({ section, isVisible }) => {
  if (!isVisible) {
    return null;
  }

  return (
    <div className="animate-fadeIn">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800">{section.title}</h2>
        <p className="text-gray-600 mt-1">{section.description}</p>
      </div>
      
      <div className="space-y-4">
        {section.fields.map((field) => (
          <FormField key={field.fieldId} field={field} />
        ))}
      </div>
    </div>
  );
};

export default FormSection;