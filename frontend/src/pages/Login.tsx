import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { authUtils } from '../utils/auth';
import LoadingSpinner from '../components/LoadingSpinner';

interface LoginForm {
  token: string;
}

export default function Login() {
  const navigate = useNavigate();
  const [showToken, setShowToken] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();

  useEffect(() => {
    // Redirect if already authenticated
    if (authUtils.isAuthenticated()) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      authUtils.setToken(data.token);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100">
            <LogIn className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Financial Insights
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Entre com seu token da API do Organizze
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="token" className="sr-only">
              Token da API
            </label>
            <div className="relative">
              <input
                {...register('token', { 
                  required: 'Token é obrigatório',
                  minLength: { value: 10, message: 'Token deve ter pelo menos 10 caracteres' }
                })}
                type={showToken ? 'text' : 'password'}
                className="appearance-none rounded-md relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Seu token da API do Organizze"
                disabled={isLoading}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowToken(!showToken)}
              >
                {showToken ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
            {errors.token && (
              <p className="mt-2 text-sm text-red-600">{errors.token.message}</p>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <LoadingSpinner size="sm" color="white" />
              ) : (
                'Entrar'
              )}
            </button>
          </div>

          <div className="text-center">
            <div className="text-sm text-gray-600">
              <p className="mb-2">Não tem um token?</p>
              <a
                href="https://organizze.com.br/configuracoes/api"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Obtenha seu token da API aqui
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
