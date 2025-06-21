import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Star, Edit3, Eye, EyeOff, Save, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Product } from "@shared/schema";
import { z } from "zod";

const featuredSectionSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  enabled: z.boolean(),
});

type FeaturedSectionData = z.infer<typeof featuredSectionSchema>;

export default function AdminFeatured() {
  const [isEditingSection, setIsEditingSection] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Configurações da seção "Mais Vendidos"
  const [sectionConfig, setSectionConfig] = useState<FeaturedSectionData>({
    title: "Mais Vendidos",
    description: "Descubra os produtos mais procurados pelos nossos clientes em toda Angola.",
    enabled: true,
  });

  const { data: allProducts = [], isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });

  const { data: featuredProducts = [], isLoading: featuredLoading } = useQuery<Product[]>({
    queryKey: ['/api/products/featured'],
  });

  const form = useForm<FeaturedSectionData>({
    resolver: zodResolver(featuredSectionSchema),
    defaultValues: sectionConfig,
  });

  const toggleFeaturedMutation = useMutation({
    mutationFn: async ({ id, featured }: { id: number; featured: boolean }) => {
      const product = allProducts.find(p => p.id === id);
      if (!product) throw new Error("Produto não encontrado");
      
      return await apiRequest("PUT", `/api/products/${id}`, {
        ...product,
        featured,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      queryClient.invalidateQueries({ queryKey: ['/api/products/featured'] });
      toast({
        title: "Produto atualizado!",
        description: "Status de destaque alterado com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao atualizar o produto.",
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

  const handleToggleFeatured = (productId: number, currentFeatured: boolean) => {
    toggleFeaturedMutation.mutate({ id: productId, featured: !currentFeatured });
  };

  const onSubmitSection = (data: FeaturedSectionData) => {
    setSectionConfig(data);
    setIsEditingSection(false);
    toast({
      title: "Seção atualizada!",
      description: "As configurações da seção Mais Vendidos foram salvas.",
    });
  };

  const resetSectionForm = () => {
    form.reset(sectionConfig);
    setIsEditingSection(false);
  };

  const isLoading = productsLoading || featuredLoading;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Seção Mais Vendidos</h1>
        <p className="text-gray-600">Configure o conteúdo e produtos da seção de destaques</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configurações da Seção */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Edit3 className="h-5 w-5" />
              Configurações da Seção
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!isEditingSection ? (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900">{sectionConfig.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{sectionConfig.description}</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge variant={sectionConfig.enabled ? "default" : "secondary"}>
                    {sectionConfig.enabled ? "Ativa" : "Inativa"}
                  </Badge>
                  {sectionConfig.enabled ? (
                    <Eye className="h-4 w-4 text-green-600" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  )}
                </div>

                <div className="pt-4">
                  <Button
                    onClick={() => {
                      form.reset(sectionConfig);
                      setIsEditingSection(true);
                    }}
                    className="w-full"
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    Editar Seção
                  </Button>
                </div>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmitSection)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título da Seção</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Mais Vendidos" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Descreva a seção..."
                            className="min-h-[80px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="enabled"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Seção Ativa</FormLabel>
                          <div className="text-sm text-gray-500">
                            Exibir esta seção na página principal
                          </div>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-2 pt-4">
                    <Button type="submit" className="flex-1">
                      <Save className="h-4 w-4 mr-2" />
                      Salvar
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={resetSectionForm}
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>

        {/* Produtos em Destaque */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Produtos em Destaque ({featuredProducts.length})
              </div>
              <Badge variant="outline">
                {featuredProducts.length}/6 produtos
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-gray-500">
                Carregando produtos...
              </div>
            ) : featuredProducts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Nenhum produto em destaque ainda.
                <br />
                <span className="text-sm">Use a lista abaixo para adicionar produtos.</span>
              </div>
            ) : (
              <div className="space-y-4 max-h-[400px] overflow-y-auto">
                {featuredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-4 p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-purple-50"
                  >
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                      onError={(e) => {
                        e.currentTarget.src = "https://via.placeholder.com/64?text=Sem+Imagem";
                      }}
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">{product.name}</h3>
                          <p className="text-sm text-gray-600 mb-1">
                            {formatPrice(product.price)}
                          </p>
                          <Badge className="text-xs">
                            <Star className="h-3 w-3 mr-1" />
                            Em Destaque
                          </Badge>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleFeatured(product.id, product.featured)}
                          disabled={toggleFeaturedMutation.isPending}
                          className="text-red-600 hover:text-red-700"
                        >
                          <EyeOff className="h-3 w-3 mr-1" />
                          Remover
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Todos os Produtos */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Todos os Produtos - Gerenciar Destaques</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-gray-500">
                Carregando produtos...
              </div>
            ) : allProducts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Nenhum produto cadastrado ainda.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {allProducts.map((product) => (
                  <div
                    key={product.id}
                    className={`p-4 border rounded-lg transition-all ${
                      product.featured 
                        ? 'border-blue-300 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-lg"
                        onError={(e) => {
                          e.currentTarget.src = "https://via.placeholder.com/48?text=Sem+Imagem";
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm truncate">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {formatPrice(product.price)}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <Badge 
                            variant="secondary" 
                            className="text-xs"
                          >
                            {product.category}
                          </Badge>
                          <Button
                            size="sm"
                            variant={product.featured ? "default" : "outline"}
                            onClick={() => handleToggleFeatured(product.id, product.featured)}
                            disabled={toggleFeaturedMutation.isPending || (featuredProducts.length >= 6 && !product.featured)}
                            className="h-7 text-xs"
                          >
                            {product.featured ? (
                              <>
                                <Star className="h-3 w-3 mr-1 fill-current" />
                                Destacado
                              </>
                            ) : (
                              <>
                                <Star className="h-3 w-3 mr-1" />
                                Destacar
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {featuredProducts.length >= 6 && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Limite atingido:</strong> Você pode ter no máximo 6 produtos em destaque. 
                  Remova um produto em destaque para adicionar outro.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}