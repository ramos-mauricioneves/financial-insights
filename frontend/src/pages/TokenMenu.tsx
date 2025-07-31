import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Key, Eye, EyeOff, Save, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { authUtils } from '../utils/auth';
import LoadingSpinner from '../components/LoadingSpinner';
import Card from '../components/Card';

export default function TokenMenu() {
  const navigate = useNavigate();
  const [token, setToken] = useState('');
  const [showToken, setShowToken] = useState(false);
  const [loading, setLoading] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Load current token if exists
    const currentToken = authUtils.getToken();
    if (currentToken) {
      setToken(currentToken);
    }
  }, []);

  const handleTestToken = async () => {
    if (!token.trim()) {
      setMessage('Por favor, insira um token');
      setTestResult('error');
      return;
    }

    setLoading(true);
    setTestResult(null);
    setMessage('');

    try {
      // Simulate API test (in real implementation, this would test the Organizze API)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock validation - in real implementation, this would validate against Organizze API
      if (token.length >= 20) {
        setTestResult('success');
        setMessage('Token válido! Conectado com sucesso à API do Organizze.');
      } else {
        setTestResult('error');
        setMessage('Token inválido. Verifique se o token está correto.');
      }
    } catch (error) {
      setTestResult('error');
      setMessage('Erro ao testar conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToken = () => {
    if (testResult === 'success') {
      authUtils.setToken(token);
      navigate('/dashboard');
    } else {
      setMessage('Teste o token antes de salvar');
      setTestResult('error');
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100">
            <Key className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Configurar Token da API
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Configure seu token do Organizze para acessar seus dados financeiros
          </p>
        </div>

        <Card>
          <div className="space-y-6">
            {/* Token Input */}
            <div>
              <label htmlFor="token" className="block text-sm font-medium text-gray-700 mb-2">
                Token da API do Organizze
              </label>
              <div className="relative">
                <input
                  type={showToken ? 'text' : 'password'}
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="appearance-none relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Cole seu token aqui"
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
            </div>

            {/* Test Result */}
            {testResult && (
              <div className={`flex items-center space-x-2 p-3 rounded-md ${
                testResult === 'success' 
                  ? 'bg-green-50 text-green-800' 
                  : 'bg-red-50 text-red-800'
              }`}>
                {testResult === 'success' ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <AlertCircle className="h-5 w-5" />
                )}
                <span className="text-sm">{message}</span>
              </div>
            )}

            {/* Instructions */}
            <div className="bg-blue-50 p-4 rounded-md">
              <h3 className="text-sm font-medium text-blue-800 mb-2">
                Como obter seu token:
              </h3>
              <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                <li>Acesse o site do Organizze</li>
                <li>Vá em Configurações → API</li>
                <li>Copie seu token de acesso</li>
                <li>Cole o token no campo acima</li>
              </ol>
              <a
                href="https://organizze.com.br/configuracoes/api"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 text-blue-600 hover:text-blue-800 text-sm underline"
              >
                Abrir página da API do Organizze →
              </a>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleTestToken}
                disabled={loading || !token.trim()}
                className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <LoadingSpinner size="sm" color="blue" />
                ) : (
                  'Testar Conexão'
                )}
              </button>

              <button
                onClick={handleSaveToken}
                disabled={testResult !== 'success'}
                className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="h-4 w-4 mr-2" />
                Salvar e Continuar
              </button>

              <button
                onClick={handleBack}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </button>
            </div>
          </div>
        </Card>

        {/* Additional Info */}
        <div className="text-center">
          <div className="text-xs text-gray-500">
            <p className="mb-1">Seu token é armazenado localmente e nunca compartilhado.</p>
            <p>Conectamos diretamente com a API oficial do Organizze.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
