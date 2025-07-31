import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Target, AlertCircle, CheckCircle } from 'lucide-react';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatCurrency } from '../utils/format';

interface BudgetItem {
  id: number;
  category: string;
  planned: number;
  spent: number;
  percentage: number;
  status: 'ok' | 'warning' | 'exceeded';
}

interface BudgetGoal {
  id: number;
  name: string;
  target: number;
  current: number;
  deadline: string;
  category: string;
}

export default function Budget() {
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([]);
  const [goals, setGoals] = useState<BudgetGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddBudget, setShowAddBudget] = useState(false);
  const [showAddGoal, setShowAddGoal] = useState(false);

  // Mock data
  const mockBudgetItems: BudgetItem[] = [
    { id: 1, category: 'Alimentação', planned: 1500, spent: 1200, percentage: 80, status: 'ok' },
    { id: 2, category: 'Transporte', planned: 800, spent: 950, percentage: 119, status: 'exceeded' },
    { id: 3, category: 'Lazer', planned: 600, spent: 580, percentage: 97, status: 'warning' },
    { id: 4, category: 'Moradia', planned: 2500, spent: 2500, percentage: 100, status: 'warning' },
    { id: 5, category: 'Saúde', planned: 400, spent: 200, percentage: 50, status: 'ok' },
  ];

  const mockGoals: BudgetGoal[] = [
    {
      id: 1,
      name: 'Reserva de Emergência',
      target: 30000,
      current: 18500,
      deadline: '2024-12-31',
      category: 'Poupança'
    },
    {
      id: 2,
      name: 'Viagem de Férias',
      target: 8000,
      current: 3200,
      deadline: '2024-07-15',
      category: 'Lazer'
    },
    {
      id: 3,
      name: 'Novo Notebook',
      target: 4500,
      current: 1800,
      deadline: '2024-06-30',
      category: 'Tecnologia'
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      setBudgetItems(mockBudgetItems);
      setGoals(mockGoals);
      setLoading(false);
    };
    fetchData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ok':
        return 'text-green-600';
      case 'warning':
        return 'text-yellow-600';
      case 'exceeded':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ok':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      case 'exceeded':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return null;
    }
  };

  const totalPlanned = budgetItems.reduce((sum, item) => sum + item.planned, 0);
  const totalSpent = budgetItems.reduce((sum, item) => sum + item.spent, 0);
  const overallPercentage = (totalSpent / totalPlanned) * 100;

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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Orçamento</h1>
          <p className="text-gray-600 dark:text-gray-400">Controle suas metas e gastos mensais</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowAddGoal(true)}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
          >
            <Plus className="h-4 w-4" />
            <span>Nova Meta</span>
          </button>
          <button
            onClick={() => setShowAddBudget(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            <span>Novo Orçamento</span>
          </button>
        </div>
      </div>

      {/* Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(totalPlanned)}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Orçamento Total</div>
          </div>
        </Card>
        
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(totalSpent)}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Gasto Total</div>
          </div>
        </Card>
        
        <Card>
          <div className="text-center">
            <div className={`text-2xl font-bold ${getStatusColor(
              overallPercentage > 100 ? 'exceeded' : overallPercentage > 90 ? 'warning' : 'ok'
            )}`}>
              {overallPercentage.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Orçamento Usado</div>
          </div>
        </Card>
      </div>

      {/* Budget Categories */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Orçamento por Categoria
          </h3>
        </div>
        
        <div className="space-y-4">
          {budgetItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-4 flex-1">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(item.status)}
                  <span className="font-medium text-gray-900 dark:text-white">
                    {item.category}
                  </span>
                </div>
                
                <div className="flex-1 max-w-xs">
                  <div className="flex justify-between text-sm mb-1">
                    <span>{formatCurrency(item.spent)}</span>
                    <span>{formatCurrency(item.planned)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        item.status === 'exceeded' ? 'bg-red-600' :
                        item.status === 'warning' ? 'bg-yellow-600' : 'bg-green-600'
                      }`}
                      style={{ width: `${Math.min(item.percentage, 100)}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={`font-medium ${getStatusColor(item.status)}`}>
                    {item.percentage.toFixed(0)}%
                  </div>
                  {item.percentage > 100 && (
                    <div className="text-xs text-red-600">
                      +{formatCurrency(item.spent - item.planned)}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                <button className="p-1 text-gray-400 hover:text-gray-600">
                  <Edit className="h-4 w-4" />
                </button>
                <button className="p-1 text-gray-400 hover:text-red-600">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Financial Goals */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Metas Financeiras
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {goals.map((goal) => {
            const progress = (goal.current / goal.target) * 100;
            const remaining = goal.target - goal.current;
            const daysLeft = Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
            
            return (
              <div key={goal.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900 dark:text-white">{goal.name}</h4>
                  <Target className="h-5 w-5 text-blue-600" />
                </div>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progresso</span>
                      <span>{progress.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Atual:</span>
                    <span className="font-medium">{formatCurrency(goal.current)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Meta:</span>
                    <span className="font-medium">{formatCurrency(goal.target)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Faltam:</span>
                    <span className="font-medium text-red-600">{formatCurrency(remaining)}</span>
                  </div>
                  
                  <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500 dark:text-gray-400">Prazo:</span>
                      <span className={`font-medium ${
                        daysLeft < 30 ? 'text-red-600' : daysLeft < 90 ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                        {daysLeft > 0 ? `${daysLeft} dias` : 'Vencido'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Quick Actions */}
      <Card>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Ações Rápidas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700">
            <div className="text-blue-600 mb-2">
              <Target className="h-6 w-6" />
            </div>
            <div className="font-medium text-gray-900 dark:text-white">Revisar Orçamento</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Ajustar limites mensais
            </div>
          </button>
          
          <button className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700">
            <div className="text-green-600 mb-2">
              <Plus className="h-6 w-6" />
            </div>
            <div className="font-medium text-gray-900 dark:text-white">Nova Meta</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Definir objetivo financeiro
            </div>
          </button>
          
          <button className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700">
            <div className="text-yellow-600 mb-2">
              <AlertCircle className="h-6 w-6" />
            </div>
            <div className="font-medium text-gray-900 dark:text-white">Alertas</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Configurar notificações
            </div>
          </button>
        </div>
      </Card>
    </div>
  );
}
