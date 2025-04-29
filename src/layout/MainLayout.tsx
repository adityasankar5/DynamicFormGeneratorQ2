import React from 'react';
import { useUser } from '../context/UserContext';
import LoginForm from '../components/LoginForm';
import DynamicForm from '../components/DynamicForm';

const MainLayout: React.FC = () => {
  const { isLoggedIn, user } = useUser();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Dynamic Form System</h1>
          {isLoggedIn && user && (
            <p className="mt-2 text-gray-600">
              Welcome, <span className="font-medium">{user.name}</span> (Roll: {user.rollNumber})
            </p>
          )}
        </header>

        <main>
          {isLoggedIn ? <DynamicForm /> : <LoginForm />}
        </main>

        <footer className="mt-12 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Dynamic Form System</p>
        </footer>
      </div>
    </div>
  );
};

export default MainLayout;