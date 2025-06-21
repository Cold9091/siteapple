import { useState } from "react";
import { Settings, Store, Bell, Palette, Database, Shield } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

export default function AdminSettings() {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    storeName: "DigitalPrime",
    storeDescription: "Loja virtual de produtos digitais premium em Angola",
    contactEmail: "contato@digitalprime.ao",
    contactPhone: "+244 923 456 789",
    currency: "AOA",
    notifications: {
      emailOnNewOrder: true,
      emailOnLowStock: true,
      smsNotifications: false,
    },
    appearance: {
      darkMode: false,
      showFeaturedProducts: true,
      productsPerPage: 12,
    },
    security: {
      requireEmailVerification: true,
      enableTwoFactor: false,
      sessionTimeout: 30,
    }
  });

  const handleSave = (section: string) => {
    toast({
      title: "Configurações salvas!",
      description: `As configurações de ${section} foram atualizadas com sucesso.`,
    });
  };

  const updateSetting = (section: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [key]: value
      }
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
        <p className="text-gray-600">Gerencie as configurações gerais da sua loja</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configurações da Loja */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="h-5 w-5" />
              Informações da Loja
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="storeName">Nome da Loja</Label>
              <Input
                id="storeName"
                value={settings.storeName}
                onChange={(e) => setSettings(prev => ({ ...prev, storeName: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="storeDescription">Descrição</Label>
              <Input
                id="storeDescription"
                value={settings.storeDescription}
                onChange={(e) => setSettings(prev => ({ ...prev, storeDescription: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactEmail">Email de Contato</Label>
              <Input
                id="contactEmail"
                type="email"
                value={settings.contactEmail}
                onChange={(e) => setSettings(prev => ({ ...prev, contactEmail: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactPhone">Telefone de Contato</Label>
              <Input
                id="contactPhone"
                value={settings.contactPhone}
                onChange={(e) => setSettings(prev => ({ ...prev, contactPhone: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Moeda</Label>
              <Input
                id="currency"
                value={settings.currency}
                onChange={(e) => setSettings(prev => ({ ...prev, currency: e.target.value }))}
                disabled
                className="bg-gray-50"
              />
            </div>

            <Button onClick={() => handleSave("loja")} className="w-full">
              Salvar Configurações da Loja
            </Button>
          </CardContent>
        </Card>

        {/* Notificações */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notificações
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Email em novos pedidos</Label>
                <div className="text-sm text-gray-500">
                  Receber email quando houver novos pedidos
                </div>
              </div>
              <Switch
                checked={settings.notifications.emailOnNewOrder}
                onCheckedChange={(value) => updateSetting('notifications', 'emailOnNewOrder', value)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Email para estoque baixo</Label>
                <div className="text-sm text-gray-500">
                  Receber alertas quando produtos estiverem em falta
                </div>
              </div>
              <Switch
                checked={settings.notifications.emailOnLowStock}
                onCheckedChange={(value) => updateSetting('notifications', 'emailOnLowStock', value)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Notificações SMS</Label>
                <div className="text-sm text-gray-500">
                  Receber SMS para eventos importantes
                </div>
              </div>
              <Switch
                checked={settings.notifications.smsNotifications}
                onCheckedChange={(value) => updateSetting('notifications', 'smsNotifications', value)}
              />
            </div>

            <Button onClick={() => handleSave("notificações")} className="w-full">
              Salvar Preferências de Notificação
            </Button>
          </CardContent>
        </Card>

        {/* Aparência */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Aparência
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Modo escuro</Label>
                <div className="text-sm text-gray-500">
                  Usar tema escuro no painel administrativo
                </div>
              </div>
              <Switch
                checked={settings.appearance.darkMode}
                onCheckedChange={(value) => updateSetting('appearance', 'darkMode', value)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Mostrar produtos em destaque</Label>
                <div className="text-sm text-gray-500">
                  Exibir seção de produtos em destaque na loja
                </div>
              </div>
              <Switch
                checked={settings.appearance.showFeaturedProducts}
                onCheckedChange={(value) => updateSetting('appearance', 'showFeaturedProducts', value)}
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="productsPerPage">Produtos por página</Label>
              <Input
                id="productsPerPage"
                type="number"
                value={settings.appearance.productsPerPage}
                onChange={(e) => updateSetting('appearance', 'productsPerPage', parseInt(e.target.value))}
                min="6"
                max="24"
              />
            </div>

            <Button onClick={() => handleSave("aparência")} className="w-full">
              Salvar Configurações de Aparência
            </Button>
          </CardContent>
        </Card>

        {/* Segurança */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Segurança
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Verificação de email obrigatória</Label>
                <div className="text-sm text-gray-500">
                  Clientes devem verificar email antes de fazer pedidos
                </div>
              </div>
              <Switch
                checked={settings.security.requireEmailVerification}
                onCheckedChange={(value) => updateSetting('security', 'requireEmailVerification', value)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Autenticação de dois fatores</Label>
                <div className="text-sm text-gray-500">
                  Ativar 2FA para maior segurança
                </div>
              </div>
              <Switch
                checked={settings.security.enableTwoFactor}
                onCheckedChange={(value) => updateSetting('security', 'enableTwoFactor', value)}
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="sessionTimeout">Timeout da sessão (minutos)</Label>
              <Input
                id="sessionTimeout"
                type="number"
                value={settings.security.sessionTimeout}
                onChange={(e) => updateSetting('security', 'sessionTimeout', parseInt(e.target.value))}
                min="5"
                max="120"
              />
            </div>

            <Button onClick={() => handleSave("segurança")} className="w-full">
              Salvar Configurações de Segurança
            </Button>
          </CardContent>
        </Card>

        {/* Backup e Dados */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Backup e Dados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <Database className="h-6 w-6 mb-2" />
                Exportar Dados
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <Database className="h-6 w-6 mb-2" />
                Backup Automático
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <Database className="h-6 w-6 mb-2" />
                Restaurar Backup
              </Button>
            </div>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Nota:</strong> Os backups são realizados automaticamente a cada 24 horas. 
                Você pode baixar uma cópia dos seus dados a qualquer momento.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}