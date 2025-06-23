import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertCategorySchema, insertSubcategorySchema, type Category, type Subcategory, type InsertCategory, type InsertSubcategory } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Tag, Folder } from "lucide-react";

const categoryFormSchema = insertCategorySchema.extend({
  slug: z.string().min(1, "Slug é obrigatório").regex(/^[a-z0-9-]+$/, "Slug deve conter apenas letras minúsculas, números e hífens"),
});

const subcategoryFormSchema = insertSubcategorySchema.extend({
  slug: z.string().min(1, "Slug é obrigatório").regex(/^[a-z0-9-]+$/, "Slug deve conter apenas letras minúsculas, números e hífens"),
});

export default function AdminCategories() {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<Subcategory | null>(null);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isSubcategoryDialogOpen, setIsSubcategoryDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Queries
  const { data: categories = [], isLoading: loadingCategories } = useQuery<(Category & { subcategories: Subcategory[] })[]>({
    queryKey: ["/api/categories/with-subcategories"],
  });

  // Category form
  const categoryForm = useForm<z.infer<typeof categoryFormSchema>>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      isActive: true,
      sortOrder: 0,
    },
  });

  // Subcategory form
  const subcategoryForm = useForm<z.infer<typeof subcategoryFormSchema>>({
    resolver: zodResolver(subcategoryFormSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      categoryId: 0,
      isActive: true,
      sortOrder: 0,
    },
  });

  // Mutations
  const createCategoryMutation = useMutation({
    mutationFn: async (data: InsertCategory) => {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create category");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories/with-subcategories"] });
      setIsCategoryDialogOpen(false);
      categoryForm.reset();
      toast({ title: "Categoria criada com sucesso!" });
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: InsertCategory }) => {
      const response = await fetch(`/api/categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update category");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories/with-subcategories"] });
      setIsCategoryDialogOpen(false);
      categoryForm.reset();
      setSelectedCategory(null);
      toast({ title: "Categoria atualizada com sucesso!" });
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete category");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories/with-subcategories"] });
      toast({ title: "Categoria excluída com sucesso!" });
    },
  });

  const createSubcategoryMutation = useMutation({
    mutationFn: async (data: InsertSubcategory) => {
      const response = await fetch("/api/subcategories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create subcategory");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories/with-subcategories"] });
      setIsSubcategoryDialogOpen(false);
      subcategoryForm.reset();
      toast({ title: "Subcategoria criada com sucesso!" });
    },
  });

  const updateSubcategoryMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: InsertSubcategory }) => {
      const response = await fetch(`/api/subcategories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update subcategory");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories/with-subcategories"] });
      setIsSubcategoryDialogOpen(false);
      subcategoryForm.reset();
      setSelectedSubcategory(null);
      toast({ title: "Subcategoria atualizada com sucesso!" });
    },
  });

  const deleteSubcategoryMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/subcategories/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete subcategory");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories/with-subcategories"] });
      toast({ title: "Subcategoria excluída com sucesso!" });
    },
  });

  // Handlers
  const onCategorySubmit = (data: z.infer<typeof categoryFormSchema>) => {
    if (selectedCategory) {
      updateCategoryMutation.mutate({ id: selectedCategory.id, data });
    } else {
      createCategoryMutation.mutate(data);
    }
  };

  const onSubcategorySubmit = (data: z.infer<typeof subcategoryFormSchema>) => {
    if (selectedSubcategory) {
      updateSubcategoryMutation.mutate({ id: selectedSubcategory.id, data });
    } else {
      createSubcategoryMutation.mutate(data);
    }
  };

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    categoryForm.reset({
      name: category.name,
      slug: category.slug,
      description: category.description || "",
      isActive: category.isActive,
      sortOrder: category.sortOrder,
    });
    setIsCategoryDialogOpen(true);
  };

  const handleEditSubcategory = (subcategory: Subcategory) => {
    setSelectedSubcategory(subcategory);
    subcategoryForm.reset({
      name: subcategory.name,
      slug: subcategory.slug,
      description: subcategory.description || "",
      categoryId: subcategory.categoryId,
      isActive: subcategory.isActive,
      sortOrder: subcategory.sortOrder,
    });
    setIsSubcategoryDialogOpen(true);
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  if (loadingCategories) {
    return <div className="p-6">Carregando categorias...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestão de Categorias</h1>
          <p className="text-muted-foreground">
            Gerencie as categorias e subcategorias que aparecerão no header do site
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Categories Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Folder className="h-5 w-5" />
                  Categorias
                </CardTitle>
                <CardDescription>
                  Categorias principais do menu de navegação
                </CardDescription>
              </div>
              <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => {
                    setSelectedCategory(null);
                    categoryForm.reset();
                  }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Categoria
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {selectedCategory ? "Editar Categoria" : "Nova Categoria"}
                    </DialogTitle>
                    <DialogDescription>
                      {selectedCategory ? "Edite os dados da categoria." : "Crie uma nova categoria principal."}
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...categoryForm}>
                    <form onSubmit={categoryForm.handleSubmit(onCategorySubmit)} className="space-y-4">
                      <FormField
                        control={categoryForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="Ex: Eletrônicos"
                                onChange={(e) => {
                                  field.onChange(e);
                                  if (!selectedCategory) {
                                    categoryForm.setValue("slug", generateSlug(e.target.value));
                                  }
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={categoryForm.control}
                        name="slug"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Slug (URL)</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="eletronicos" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={categoryForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Descrição</FormLabel>
                            <FormControl>
                              <Textarea {...field} placeholder="Descrição da categoria" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={categoryForm.control}
                          name="sortOrder"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Ordem</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  {...field} 
                                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={categoryForm.control}
                          name="isActive"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Ativa</FormLabel>
                              <FormControl>
                                <div className="pt-2">
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setIsCategoryDialogOpen(false)}
                        >
                          Cancelar
                        </Button>
                        <Button 
                          type="submit" 
                          disabled={createCategoryMutation.isPending || updateCategoryMutation.isPending}
                        >
                          {selectedCategory ? "Atualizar" : "Criar"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {categories.map((category: Category & { subcategories: Subcategory[] }) => (
                <div key={category.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{category.name}</h3>
                      <Badge variant={category.isActive ? "default" : "secondary"}>
                        {category.isActive ? "Ativa" : "Inativa"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">/{category.slug}</p>
                    <p className="text-sm text-muted-foreground">
                      {category.subcategories.length} subcategorias
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditCategory(category)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteCategoryMutation.mutate(category.id)}
                      disabled={deleteCategoryMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {categories.length === 0 && (
                <p className="text-center text-muted-foreground py-4">
                  Nenhuma categoria encontrada
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Subcategories Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  Subcategorias
                </CardTitle>
                <CardDescription>
                  Subcategorias que aparecem nos menus suspensos
                </CardDescription>
              </div>
              <Dialog open={isSubcategoryDialogOpen} onOpenChange={setIsSubcategoryDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => {
                    setSelectedSubcategory(null);
                    subcategoryForm.reset();
                  }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Subcategoria
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {selectedSubcategory ? "Editar Subcategoria" : "Nova Subcategoria"}
                    </DialogTitle>
                    <DialogDescription>
                      {selectedSubcategory ? "Edite os dados da subcategoria." : "Crie uma nova subcategoria."}
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...subcategoryForm}>
                    <form onSubmit={subcategoryForm.handleSubmit(onSubcategorySubmit)} className="space-y-4">
                      <FormField
                        control={subcategoryForm.control}
                        name="categoryId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Categoria</FormLabel>
                            <Select 
                              onValueChange={(value) => field.onChange(parseInt(value))} 
                              value={field.value?.toString()}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione uma categoria" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {categories.map((category: Category) => (
                                  <SelectItem key={category.id} value={category.id.toString()}>
                                    {category.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={subcategoryForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="Ex: Smartphones"
                                onChange={(e) => {
                                  field.onChange(e);
                                  if (!selectedSubcategory) {
                                    subcategoryForm.setValue("slug", generateSlug(e.target.value));
                                  }
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={subcategoryForm.control}
                        name="slug"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Slug (URL)</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="smartphones" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={subcategoryForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Descrição</FormLabel>
                            <FormControl>
                              <Textarea {...field} placeholder="Descrição da subcategoria" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={subcategoryForm.control}
                          name="sortOrder"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Ordem</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  {...field} 
                                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={subcategoryForm.control}
                          name="isActive"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Ativa</FormLabel>
                              <FormControl>
                                <div className="pt-2">
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setIsSubcategoryDialogOpen(false)}
                        >
                          Cancelar
                        </Button>
                        <Button 
                          type="submit" 
                          disabled={createSubcategoryMutation.isPending || updateSubcategoryMutation.isPending}
                        >
                          {selectedSubcategory ? "Atualizar" : "Criar"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {categories.flatMap((category: Category & { subcategories: Subcategory[] }) =>
                category.subcategories.map((subcategory: Subcategory) => (
                  <div key={subcategory.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{subcategory.name}</h4>
                        <Badge variant={subcategory.isActive ? "default" : "secondary"}>
                          {subcategory.isActive ? "Ativa" : "Inativa"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">/{subcategory.slug}</p>
                      <p className="text-sm text-muted-foreground">
                        Categoria: {category.name}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditSubcategory(subcategory)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteSubcategoryMutation.mutate(subcategory.id)}
                        disabled={deleteSubcategoryMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
              {categories.every((cat: any) => cat.subcategories.length === 0) && (
                <p className="text-center text-muted-foreground py-4">
                  Nenhuma subcategoria encontrada
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}