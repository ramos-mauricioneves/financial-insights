import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, PieChart, BarChart3, Plus, Eye } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatCurrency, formatPercent } from '../utils/format';

interface Investment {
  id: number;
  name: string;
  type: string;
  amount: number;
  currentValue: number;
  change: number;
  changePercent: number;
  allocation: number;
}

interface PerformanceData {
  date: string;
  value: number;
}

export default function Investments() {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('6months');

  // Mock data
  const mockInvestments: Investment[] = [
    {
      id: 1,
      name: 'Tesouro Selic 2029',
      type: 'Renda Fixa',
      amount: 15000,
      currentValue: 15750,
      change: 750,
      changePercent: 5.0,
      allocation: 35
    },
    {
      id: 2,
      name: 'ITSA4',
      type: 'Ações',
      amount: 8000,
      currentValue: 9200,
      change: 1200,
      changePercent: 15.0,
      allocation: 21
    },
    {
      id: 3,
      name: 'HGLG11',
      type: 'FII',
      amount: 6000,
      currentValue: 6180,
      change: 180,
      changePercent: 3.0,
      allocation: 14
    },
    {
      id: 4,
      name: 'CDB Banco Inter',
      type: 'CDB',
      amount: 10000,
      currentValue: 10400,
      change: 400,
      changePercent: 4.0,
      allocation: 23
    },
    {
      id: 5,
      name: 'BOVA11',
      type: 'ETF',
      amount: 3000,
      currentValue: 3150,
      change: 150,
      changePercent: 5.0,
      allocation: 7
    }
  ];

  const mockPerformanceData: PerformanceData[] = [
    { date: '2023-07', value: 38000 },
    { date: '2023-08', value: 39200 },
    { date: '2023-09', value: 38800 },
    { date: '2023-10', value: 41500 },
    { date: '2023-11', value: 43200 },
    { date: '2023-12', value: 42000 },
    { date: '2024-01', value: 44680 },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      setInvestments(mockInvestments);
      setPerformanceData(mockPerformanceData);
      setLoading(false);
    };
    fetchData();
  }, [selectedPeriod]);

  const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
  const totalCurrentValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
  const totalGain = totalCurrentValue - totalInvested;
  const totalGainPercent = (totalGain / totalInvested) * 100;

  // Group investments by type for pie chart
  const typeAllocation = investments.reduce((acc: any[], inv) => {
    const existingType = acc.find(item => item.name === inv.type);
    if (existingType) {
      existingType.value += inv.currentValue;
    } else {
      acc.push({
        name: inv.type,
        value: inv.currentValue,
        color: getTypeColor(inv.type)
      });
    }
    return acc;
  }, []);

  function getTypeColor(type: string) {
    const colors: Record<string, string> = {
      'Renda Fixa': '#8884d8',
      'Ações': '#82ca9d',
      'FII': '#ffc658',
      'CDB': '#ff7300',
      'ETF': '#8dd1e1'
    };
    return colors[type] || '#666';
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Investimentos</h1>
          <p className="text-gray-600 dark:text-gray-400">Acompanhe seu portfólio e performance</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="3months">3 meses</option>
            <option value="6months">6 meses</option>
            <option value="12months">1 ano</option>
            <option value="24months">2 anos</option>
          </select>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            <Plus className="h-4 w-4" />
            <span>Novo Investimento</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Valor Investido</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {formatCurrency(totalInvested)}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Valor Atual</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {formatCurrency(totalCurrentValue)}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <BarChart3 className={`h-8 w-8 ${totalGain >= 0 ? 'text-green-600' : 'text-red-600'}`} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Ganho/Perda</p>
              <p className={`text-lg font-semibold ${totalGain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(totalGain)}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <PieChart className={`h-8 w-8 ${totalGainPercent >= 0 ? 'text-green-600' : 'text-red-600'}`} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Rentabilidade</p>
              <p className={`text-lg font-semibold ${totalGainPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {totalGainPercent >= 0 ? '+' : ''}{totalGainPercent.toFixed(2)}%
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Chart */}
        <Card>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Performance do Portfólio
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'Valor']} />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#8884d8" 
                strokeWidth={2}
                dot={{ fill: '#8884d8' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Allocation Pie Chart */}
        <Card>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Alocação por Tipo
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Pie
                data={typeAllocation}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {typeAllocation.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
            </RechartsPieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Investments List */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Meus Investimentos
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Investimento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Valor Investido
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Valor Atual
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Ganho/Perda
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Alocação
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {investments.map((investment) => (
                <tr key={investment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {investment.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span 
                      className="px-2 py-1 text-xs font-medium rounded-full text-white"
                      style={{ backgroundColor: getTypeColor(investment.type) }}
                    >
                      {investment.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white text-right">
                    {formatCurrency(investment.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white text-right">
                    {formatCurrency(investment.currentValue)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className={`text-sm font-medium ${
                      investment.change >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {investment.change >= 0 ? '+' : ''}{formatCurrency(investment.change)}
                    </div>
                    <div className={`text-xs ${
                      investment.changePercent >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {investment.changePercent >= 0 ? '+' : ''}{investment.changePercent.toFixed(2)}%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {investment.allocation}%
                      </span>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full"
                          style={{ 
                            width: `${investment.allocation}%`,
                            backgroundColor: getTypeColor(investment.type)
                          }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button className="p-1 text-gray-400 hover:text-blue-600">
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Investment Tips */}
      <Card>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Dicas de Investimento
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="text-blue-600 mb-2">
              <TrendingUp className="h-6 w-6" />
            </div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-1">Diversificação</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Mantenha uma carteira diversificada para reduzir riscos e otimizar retornos.
            </p>
          </div>
          
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="text-green-600 mb-2">
              <DollarSign className="h-6 w-6" />
            </div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-1">Aportes Regulares</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Faça aportes mensais constantes para aproveitar o poder dos juros compostos.
            </p>
          </div>
          
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <div className="text-yellow-600 mb-2">
              <BarChart3 className="h-6 w-6" />
            </div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-1">Rebalanceamento</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Revise periodicamente sua carteira e rebalanceie conforme seus objetivos.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
