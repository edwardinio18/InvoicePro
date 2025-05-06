import { Outlet, Navigate } from 'react-router-dom';
import { authApi } from '@/api/auth';

const AuthLayout = () => {
  
  if (authApi.isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      
      <div className="bg-blue-600 text-white md:w-1/2 lg:w-2/5 py-12 px-6 flex flex-col">
        <div className="max-w-md mx-auto w-full">
          <div className="flex items-center space-x-2 mb-8">
            <div className="h-10 w-10 rounded-md bg-white flex items-center justify-center">
              <span className="text-blue-600 font-bold text-xl">I</span>
            </div>
            <span className="text-2xl font-bold">InvoiceApp</span>
          </div>
          
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Manage your invoices with ease</h2>
          <p className="text-blue-100 text-lg mb-8">A powerful, simple tool for tracking invoices, payments, and client information.</p>
          
          <div className="hidden lg:block">
            <div className="border-t border-blue-400 pt-8 mt-8">
              <div className="flex items-start space-x-4">
                <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  "
                </div>
                <div>
                  <p className="text-blue-100 italic mb-4">InvoiceApp has transformed how we manage our finances. The interface is clean and intuitive, saving us hours each month.</p>
                  <p className="text-white font-medium">John Smith</p>
                  <p className="text-blue-200 text-sm">CEO, Acme Inc.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      
      <div className="bg-slate-50 md:w-1/2 lg:w-3/5 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8 md:text-left">
            <h1 className="text-2xl font-bold text-slate-800">Welcome Back</h1>
            <p className="text-slate-500 mt-2">Please enter your details to access your account</p>
          </div>
          
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout; 