import React, { useState } from "react";
import { useUser } from "../context/UserContext";
import { registerUser } from "../services/api";

const LoginForm: React.FC = () => {
  const { setUser } = useUser();
  const [rollNumber, setRollNumber] = useState("");
  const [name, setName] = useState("");
  const [errors, setErrors] = useState({ rollNumber: "", name: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const validate = (): boolean => {
    const newErrors = { rollNumber: "", name: "" };
    let isValid = true;

    if (!rollNumber.trim()) {
      newErrors.rollNumber = "Roll number is required";
      isValid = false;
    }

    if (!name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsLoading(true);
    setApiError(null);

    try {
      const response = await registerUser({ rollNumber, name });

      if (response.success) {
        setUser({ rollNumber, name });
      } else if (
        response.message ===
        "User already exists. Fetch /get-form to get form json"
      ) {
        // If user exists, proceed with login instead of showing error
        setUser({ rollNumber, name });
      } else {
        setApiError(response.message);
      }
    } catch (error) {
      setApiError("An unexpected error occurred. Please try again.");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-center text-gray-900 mb-6">
        Student Login
      </h1>

      {apiError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md">
          {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="rollNumber"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Roll Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="rollNumber"
            value={rollNumber}
            onChange={(e) => setRollNumber(e.target.value)}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.rollNumber ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter your roll number"
            disabled={isLoading}
          />
          {errors.rollNumber && (
            <p className="mt-1 text-sm text-red-600">{errors.rollNumber}</p>
          )}
        </div>

        <div className="mb-6">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.name ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter your name"
            disabled={isLoading}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <span className="mr-2">Logging in</span>
              <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
            </span>
          ) : (
            "Login"
          )}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
