import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterInput } from '@/api/auth';
import { useRegister } from '@/hooks/useAuth';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, Mail, Lock, User, Loader2 } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const register = useRegister();
  const { isAuthenticated } = useAuth();
  
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);
  
  const { register: registerField, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  });
  
  const onSubmit = async (data: RegisterInput) => {
    register.mutate(data);
  };
  
  return (
    <Card className="w-full shadow-sm border border-slate-200 bg-white">
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl font-semibold text-slate-800">Create an account</CardTitle>
        <CardDescription className="text-slate-500">
          Enter your details below to create your account
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {register.error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm flex items-start gap-2 border border-red-200">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Registration failed</p>
                <p className="text-red-600 text-xs mt-0.5">
                  {register.error instanceof Error 
                    ? register.error.message 
                    : 'An error occurred during registration'}
                </p>
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="name" className="text-slate-700">
              Full Name
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                <User className="h-4 w-4" />
              </div>
              <Input
                id="name"
                type="text"
                className={`pl-10 ${errors.name ? 'border-red-300 focus-visible:ring-red-300' : 'border-slate-200'}`}
                placeholder="John Doe"
                {...registerField('name')}
              />
            </div>
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-700">
              Email
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                <Mail className="h-4 w-4" />
              </div>
              <Input
                id="email"
                type="email"
                className={`pl-10 ${errors.email ? 'border-red-300 focus-visible:ring-red-300' : 'border-slate-200'}`}
                placeholder="name@company.com"
                {...registerField('email')}
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" className="text-slate-700">
              Password
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                <Lock className="h-4 w-4" />
              </div>
              <Input
                id="password"
                type="password"
                className={`pl-10 ${errors.password ? 'border-red-300 focus-visible:ring-red-300' : 'border-slate-200'}`}
                {...registerField('password')}
              />
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-slate-700">
              Confirm Password
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                <Lock className="h-4 w-4" />
              </div>
              <Input
                id="confirmPassword"
                type="password"
                className={`pl-10 ${errors.confirmPassword ? 'border-red-300 focus-visible:ring-red-300' : 'border-slate-200'}`}
                {...registerField('confirmPassword')}
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-4">
          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            disabled={register.isPending || isSubmitting}
          >
            {register.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              'Create account'
            )}
          </Button>
          
          <div className="text-center text-sm text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 font-medium hover:text-blue-800 hover:underline">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
};

export default Register; 