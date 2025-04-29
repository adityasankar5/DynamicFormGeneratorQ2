import React from 'react';
import { FormField as FieldType } from '../types';
import { useForm } from '../context/FormContext';

interface FormFieldProps {
  field: FieldType;
}

const FormField: React.FC<FormFieldProps> = ({ field }) => {
  const { formValues, handleInputChange, formErrors } = useForm();
  
  const value = formValues[field.fieldId] || '';
  const error = formErrors[field.fieldId];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    handleInputChange(field.fieldId, e.target.value);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleInputChange(field.fieldId, e.target.checked);
  };

  const handleMultiSelectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    const currentValues = (formValues[field.fieldId] as string[]) || [];
    
    if (checked) {
      handleInputChange(field.fieldId, [...currentValues, value]);
    } else {
      handleInputChange(field.fieldId, currentValues.filter(val => val !== value));
    }
  };

  const renderField = () => {
    switch (field.type) {
      case 'text':
      case 'tel':
      case 'email':
      case 'date':
        return (
          <input
            type={field.type}
            id={field.fieldId}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              error ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder={field.placeholder || ''}
            value={value as string}
            onChange={handleChange}
            data-testid={field.dataTestId}
            required={field.required}
            maxLength={field.maxLength}
            minLength={field.minLength}
          />
        );
      
      case 'textarea':
        return (
          <textarea
            id={field.fieldId}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              error ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder={field.placeholder || ''}
            value={value as string}
            onChange={handleChange}
            data-testid={field.dataTestId}
            required={field.required}
            maxLength={field.maxLength}
            minLength={field.minLength}
            rows={4}
          />
        );
      
      case 'dropdown':
        return (
          <select
            id={field.fieldId}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              error ? 'border-red-500' : 'border-gray-300'
            }`}
            value={value as string}
            onChange={handleChange}
            data-testid={field.dataTestId}
            required={field.required}
          >
            <option value="">Select an option</option>
            {field.options?.map((option) => (
              <option 
                key={option.value} 
                value={option.value}
                data-testid={option.dataTestId}
              >
                {option.label}
              </option>
            ))}
          </select>
        );
      
      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map((option) => (
              <div key={option.value} className="flex items-center">
                <input
                  type="radio"
                  id={`${field.fieldId}-${option.value}`}
                  name={field.fieldId}
                  value={option.value}
                  checked={(value as string) === option.value}
                  onChange={handleChange}
                  data-testid={option.dataTestId}
                  className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <label 
                  htmlFor={`${field.fieldId}-${option.value}`}
                  className="text-gray-700"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        );
      
      case 'checkbox':
        if (field.options) {
          // Multiple checkboxes (array of values)
          return (
            <div className="space-y-2">
              {field.options.map((option) => (
                <div key={option.value} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`${field.fieldId}-${option.value}`}
                    value={option.value}
                    checked={Array.isArray(formValues[field.fieldId]) && 
                      (formValues[field.fieldId] as string[])?.includes(option.value)}
                    onChange={handleMultiSelectChange}
                    data-testid={option.dataTestId}
                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <label 
                    htmlFor={`${field.fieldId}-${option.value}`}
                    className="text-gray-700"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          );
        } else {
          // Single checkbox (boolean value)
          return (
            <div className="flex items-center">
              <input
                type="checkbox"
                id={field.fieldId}
                checked={!!value}
                onChange={handleCheckboxChange}
                data-testid={field.dataTestId}
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <label 
                htmlFor={field.fieldId}
                className="text-gray-700"
              >
                {field.label}
              </label>
            </div>
          );
        }
      
      default:
        return <p>Unsupported field type: {field.type}</p>;
    }
  };

  return (
    <div className="mb-4">
      {field.type !== 'checkbox' && (
        <label 
          htmlFor={field.fieldId} 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {renderField()}
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default FormField;