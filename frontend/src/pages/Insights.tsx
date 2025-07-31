import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Target, AlertTriangle, PieChart, BarChart3 } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatCurrency, formatPercent } from '../utils/format';

interface InsightData {
  spending_trends: Array<{
    month: string;
    value: number;
    change: number;
  }>;
  category_analysis: Array<{
    name: string;
    value: number;
    percentage: number;
    color: string;
  }>;
  financial_health: {
    score: number;
    factors: Array<{
      name: string;
      score: number;
      description: string;
    }>;
  };
  predictions: Array<{
    type: string;
    message: string;
    impact: 'positive' | 'negative' | 'neutral';
  }>;
}

export default function Insights() {
  const [data, setData] = useState<InsightData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState('6months');

  useEffect(() => {
    fetchInsights();
  }, [selectedPeriod]);

  const fetchInsights = async () => {
    try {
      setLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data for demonstration
      const mockData: InsightData = {
        spending_trends: [
          { month: 'Jul', value: 5200, change: -8.5 },
          { month: 'Ago', value: 5600, change: 7.7 },
          { month: 'Set', value: 4800, change: -14.3 },
          { month: 'Out', value: 6100, change: 27.1 },
          { month: 'Nov', value: 5300, change: -13.1 },
          { month: 'Dez', value: 6200, change: 17.0 },
        ],
        category_analysis: [
          { name: 'Alimentação', value: 1800, percentage: 29, color: '#8884d8' },
          { name: 'Moradia', value: 2200, percentage: 35, color: '#82ca9d' },
          { name: 'Transporte', value: 800, percentage: 13, color: '#ffc658' },
          { name: 'Lazer', value: 600, percentage: 10, color: '#ff7300' },
          { name: 'Outros', value: 800, percentage: 13, color: '#8dd1e1' },
        ],
        financial_health: {
          score: 75,
          factors: [
            { name: 'Controle de Gastos', score: 80, description: 'Bom controle mensal' },
            { name: 'Poupança', score: 65, description: 'Pode melhorar' },
            { name: 'Diversificação', score: 85, description: 'Boa diversificação' },
            { name: 'Planejamento', score: 70, description: 'Metas claras' },
          ]
        },
        predictions: [
          {
            type: 'warning',
            message: 'Gastos com alimentação 15% acima da média dos últimos 3 meses',
            impact: 'negative'
          },
          {
            type: 'insight',
            message: 'Economia de R$ 450 possível reduzindo gastos em lazer',
            impact: 'positive'
          },
          {
            type: 'trend',
            message: 'Tendência de aumento nos gastos com transporte',
            impact: 'neutral'
          }
        ]
      };
      
      setData(mockData);
    } catch (err) {
      setError('Erro ao carregar insights');
      console.error('Insights error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getHealthScoreText = (score: number) => {
    if (score >= 80) return 'Excelente';
    if (score >= 60) return 'Boa';
    if (score >= 40) return 'Regular';
    return 'Ruim';
  };

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'positive':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'negative':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={fetchInsights}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Insights Financeiros</h1>
          <p className="text-gray-600 dark:text-gray-400">Análises e tendências dos seus gastos</p>
        </div>
        <div>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="3months">Últimos 3 meses</option>
            <option value="6months">Últimos 6 meses</option>
            <option value="12months">Último ano</option>
          </select>
        </div>
      </div>

      {/* Financial Health Score */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Saúde Financeira
          </h3>
          <div className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-blue-600" />
            <span className={`text-2xl font-bold ${getHealthScoreColor(data.financial_health.score)}`}>
              {data.financial_health.score}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              / 100 ({getHealthScoreText(data.financial_health.score)})
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.financial_health.factors.map((factor, index) => (
            <div key={index} className="text-center">
              <div className="mb-2">
                <div className={`text-xl font-semibold ${getHealthScoreColor(factor.score)}`}>
                  {factor.score}
                </div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {factor.name}
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    factor.score >= 80 ? 'bg-green-600' : 
                    factor.score >= 60 ? 'bg-yellow-600' : 'bg-red-600'
                  }`}
                  style={{ width: `${factor.score}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {factor.description}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spending Trends */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Tendência de Gastos
            </h3>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.spending_trends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                formatter={(value) => [formatCurrency(Number(value)), 'Gastos']}
                labelFormatter={(label) => `Mês: ${label}`}
              />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Category Analysis */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Gastos por Categoria
            </h3>
            <PieChart className="h-5 w-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Pie
                data={data.category_analysis}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name} ${percentage}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.category_analysis.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
            </RechartsPieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Insights and Predictions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Changes */}
        <Card>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Variações Mensais
          </h3>
          <div className="space-y-3">
            {data.spending_trends.map((trend, index) => (
              <div key={index} className="flex items-center justify-between py-2">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {trend.month}
                </span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {formatCurrency(trend.value)}
                  </span>
                  <span className={`text-sm font-medium ${
                    trend.change > 0 ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {trend.change > 0 ? '+' : ''}{trend.change.toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* AI Insights */}
        <Card>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Insights Inteligentes
          </h3>
          <div className="space-y-4">
            {data.predictions.map((prediction, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex-shrink-0 mt-0.5">
                  {getImpactIcon(prediction.impact)}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900 dark:text-white">
                    {prediction.message}
                  </p>
                  <span className={`inline-block mt-1 px-2 py-1 text-xs rounded-full ${
                    prediction.impact === 'positive' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : prediction.impact === 'negative'
                      ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  }`}>
                    {prediction.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Category Breakdown */}
      <Card>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Detalhamento por Categoria
        </h3>
        <div className="space-y-4">
          {data.category_analysis.map((category, index) => (
            <div key={index} className="flex items-center justify-between py-3">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: category.color }}
                ></div>
                <span className="font-medium text-gray-900 dark:text-white">
                  {category.name}
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatCurrency(category.value)}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {category.percentage}% do total
                  </div>
                </div>
                <div className="w-20">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full"
                      style={{ 
                        width: `${category.percentage}%`,
                        backgroundColor: category.color 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
