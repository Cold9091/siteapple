import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Eye, RefreshCw, Clock, CheckCircle2, AlertCircle, Truck, Package, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Order } from "@shared/schema";

const statusOptions = [
  { value: "pending", label: "Pendente", icon: Clock, color: "bg-yellow-100 text-yellow-800" },
  { value: "processing", label: "Processando", icon: RefreshCw, color: "bg-blue-100 text-blue-800" },
  { value: "shipped", label: "Enviado", icon: Truck, color: "bg-purple-100 text-purple-800" },
  { value: "delivered", label: "Entregue", icon: CheckCircle2, color: "bg-green-100 text-green-800" },
  { value: "cancelled", label: "Cancelado", icon: X, color: "bg-red-100 text-red-800" },
];

export default function AdminOrders() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: orders = [], isLoading } = useQuery<Order[]>({
    queryKey: ['/api/orders'],
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      return await apiRequest("PATCH", `/api/orders/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
      toast({
        title: "Status atualizado!",
        description: "O status do pedido foi alterado com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao atualizar o status do pedido.",
        variant: "destructive",
      });
    },
  });

  const formatPrice = (priceInCentavos: number) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA',
    }).format(priceInCentavos / 100);
  };

  const formatDate = (date: string | Date | null) => {
    if (!date) return 'Data não disponível';
    return new Date(date).toLocaleDateString('pt-AO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusInfo = (status: string) => {
    return statusOptions.find(option => option.value === status) || statusOptions[0];
  };

  const handleStatusChange = (orderId: number, newStatus: string) => {
    updateStatusMutation.mutate({ id: orderId, status: newStatus });
  };

  const getStatusCounts = () => {
    const counts = statusOptions.reduce((acc, status) => {
      acc[status.value] = orders.filter(order => order.status === status.value).length;
      return acc;
    }, {} as Record<string, number>);
    return counts;
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gestão de Pedidos</h1>
        <p className="text-gray-600">Visualize e gerencie todos os pedidos da sua loja</p>
      </div>

      {/* Estatísticas de pedidos */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {statusOptions.map((status) => {
          const Icon = status.icon;
          return (
            <Card key={status.value}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{status.label}</p>
                    <p className="text-2xl font-bold">{statusCounts[status.value] || 0}</p>
                  </div>
                  <Icon className="h-8 w-8 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Lista de pedidos */}
      <Card>
        <CardHeader>
          <CardTitle>Todos os Pedidos ({orders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">
              Carregando pedidos...
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Nenhum pedido encontrado.
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const statusInfo = getStatusInfo(order.status);
                const StatusIcon = statusInfo.icon;
                
                return (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">Pedido #{order.id}</span>
                          <Badge className={`${statusInfo.color} flex items-center gap-1`}>
                            <StatusIcon className="h-3 w-3" />
                            {statusInfo.label}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{order.customerName}</p>
                        <p className="text-xs text-gray-500">{order.customerEmail}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-semibold">{formatPrice(order.totalAmount)}</p>
                        <p className="text-sm text-gray-500">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Select
                          value={order.status}
                          onValueChange={(value) => handleStatusChange(order.id, value)}
                          disabled={updateStatusMutation.isPending}
                        >
                          <SelectTrigger className="w-36">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {statusOptions.map((status) => (
                              <SelectItem key={status.value} value={status.value}>
                                {status.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedOrder(order)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Detalhes do Pedido #{order.id}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-semibold mb-2">Informações do Cliente</h4>
                                  <p><strong>Nome:</strong> {order.customerName}</p>
                                  <p><strong>Email:</strong> {order.customerEmail}</p>
                                  {order.customerPhone && (
                                    <p><strong>Telefone:</strong> {order.customerPhone}</p>
                                  )}
                                </div>
                                <div>
                                  <h4 className="font-semibold mb-2">Informações do Pedido</h4>
                                  <p><strong>Data:</strong> {formatDate(order.createdAt)}</p>
                                  <p><strong>Status:</strong> {getStatusInfo(order.status).label}</p>
                                  <p><strong>Total:</strong> {formatPrice(order.totalAmount)}</p>
                                </div>
                              </div>

                              <div>
                                <h4 className="font-semibold mb-2">Endereço de Entrega</h4>
                                <p>{order.shippingAddress}</p>
                              </div>

                              <div>
                                <h4 className="font-semibold mb-2">Itens do Pedido</h4>
                                <div className="border rounded-lg p-4">
                                  {Array.isArray(order.items) ? (
                                    order.items.map((item: any, index: number) => (
                                      <div key={index} className="flex justify-between items-center py-2">
                                        <div>
                                          <p className="font-medium">{item.name || `Produto #${item.productId}`}</p>
                                          <p className="text-sm text-gray-600">Quantidade: {item.quantity}</p>
                                        </div>
                                        <p className="font-semibold">{formatPrice(item.price)}</p>
                                      </div>
                                    ))
                                  ) : (
                                    <p className="text-gray-500">Itens não disponíveis</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}