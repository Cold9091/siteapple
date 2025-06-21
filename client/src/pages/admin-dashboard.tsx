import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings as SettingsIcon,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  DollarSign
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AdminProducts from "../components/admin/admin-products";
import AdminOrders from "../components/admin/admin-orders";
import AdminSettings from "../components/admin/admin-settings";
import type { Order } from "@shared/schema";

const sidebarItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "products", label: "Produtos", icon: Package },
  { id: "orders", label: "Pedidos", icon: ShoppingCart },
  { id: "customers", label: "Clientes", icon: Users },
  { id: "settings", label: "Configurações", icon: SettingsIcon },
];

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("dashboard");

  const { data: dashboardStats, isLoading: statsLoading } = useQuery<{
    totalProducts: number;
    totalOrders: number;
    pendingOrders: number;
    totalRevenue: number;
    recentOrders: Order[];
  }>({
    queryKey: ['/api/dashboard/stats'],
    enabled: activeSection === "dashboard",
  });

  const formatPrice = (priceInCentavos: number) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA',
    }).format(priceInCentavos / 100);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "processing": return "bg-blue-100 text-blue-800";
      case "shipped": return "bg-purple-100 text-purple-800";
      case "delivered": return "bg-green-100 text-green-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <Clock className="h-3 w-3" />;
      case "processing": return <AlertCircle className="h-3 w-3" />;
      case "delivered": return <CheckCircle2 className="h-3 w-3" />;
      default: return <Clock className="h-3 w-3" />;
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Visão geral da sua loja virtual</p>
      </div>

      {/* Estatísticas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Produtos</CardTitle>
            <Package className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? "..." : dashboardStats?.totalProducts || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Pedidos</CardTitle>
            <ShoppingCart className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? "..." : dashboardStats?.totalOrders || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedidos Pendentes</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {statsLoading ? "..." : dashboardStats?.pendingOrders || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {statsLoading ? "..." : formatPrice(dashboardStats?.totalRevenue || 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pedidos recentes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Pedidos Recentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {statsLoading ? (
            <div className="text-center py-8 text-gray-500">Carregando...</div>
          ) : (
            <div className="space-y-4">
              {dashboardStats?.recentOrders?.map((order: Order) => (
                <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="font-medium">Pedido #{order.id}</p>
                      <p className="text-sm text-gray-600">{order.customerName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-medium">{formatPrice(order.totalAmount)}</p>
                      <p className="text-sm text-gray-500">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString('pt-AO') : 'Data inválida'}
                      </p>
                    </div>
                    <Badge className={`${getStatusColor(order.status)} flex items-center gap-1`}>
                      {getStatusIcon(order.status)}
                      {order.status}
                    </Badge>
                  </div>
                </div>
              )) || (
                <div className="text-center py-8 text-gray-500">
                  Nenhum pedido encontrado
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return renderDashboard();
      case "products":
        return <AdminProducts />;
      case "orders":
        return <AdminOrders />;
      case "customers":
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestão de Clientes</h1>
              <p className="text-gray-600">Funcionalidade em desenvolvimento</p>
            </div>
            <Card>
              <CardContent className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Esta seção estará disponível em breve</p>
              </CardContent>
            </Card>
          </div>
        );
      case "settings":
        return <AdminSettings />;
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm border-r">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">DigitalPrime</h2>
          <p className="text-sm text-gray-600">Painel de Administração</p>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      activeSection === item.id
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 p-8">
        {renderContent()}
      </div>
    </div>
  );
}