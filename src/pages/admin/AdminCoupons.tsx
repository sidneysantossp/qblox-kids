import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Ticket, Plus, Pencil, Trash2, Copy, TrendingUp } from 'lucide-react';
import {
  getAllCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  getCouponUsageHistory,
} from '@/db/admin-api';
import type { Coupon } from '@/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [couponToDelete, setCouponToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discount_type: 'percentage' as 'percentage' | 'fixed',
    discount_value: '',
    min_purchase: '',
    max_discount: '',
    usage_limit: '',
    valid_from: '',
    valid_until: '',
    active: true,
  });

  useEffect(() => {
    loadCoupons();
  }, []);

  const loadCoupons = async () => {
    try {
      setLoading(true);
      const data = await getAllCoupons();
      setCoupons(data);
    } catch (error) {
      console.error('Erro ao carregar cupons:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os cupons',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (coupon?: Coupon) => {
    if (coupon) {
      setSelectedCoupon(coupon);
      setFormData({
        code: coupon.code,
        description: coupon.description || '',
        discount_type: coupon.discount_type,
        discount_value: coupon.discount_value.toString(),
        min_purchase: coupon.min_purchase.toString(),
        max_discount: coupon.max_discount?.toString() || '',
        usage_limit: coupon.usage_limit?.toString() || '',
        valid_from: coupon.valid_from ? format(new Date(coupon.valid_from), 'yyyy-MM-dd') : '',
        valid_until: coupon.valid_until ? format(new Date(coupon.valid_until), 'yyyy-MM-dd') : '',
        active: coupon.active,
      });
    } else {
      setSelectedCoupon(null);
      setFormData({
        code: '',
        description: '',
        discount_type: 'percentage',
        discount_value: '',
        min_purchase: '0',
        max_discount: '',
        usage_limit: '',
        valid_from: format(new Date(), 'yyyy-MM-dd'),
        valid_until: '',
        active: true,
      });
    }
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.code || !formData.discount_value) {
      toast({
        title: 'Erro',
        description: 'Preencha todos os campos obrigatórios',
        variant: 'destructive',
      });
      return;
    }

    try {
      const couponData = {
        code: formData.code.toUpperCase(),
        description: formData.description || null,
        discount_type: formData.discount_type,
        discount_value: parseFloat(formData.discount_value),
        min_purchase: parseFloat(formData.min_purchase) || 0,
        max_discount: formData.max_discount ? parseFloat(formData.max_discount) : null,
        usage_limit: formData.usage_limit ? parseInt(formData.usage_limit) : null,
        valid_from: formData.valid_from || new Date().toISOString(),
        valid_until: formData.valid_until || null,
        active: formData.active,
      };

      if (selectedCoupon) {
        await updateCoupon(selectedCoupon.id, couponData);
        toast({
          title: 'Sucesso',
          description: 'Cupom atualizado com sucesso',
        });
      } else {
        await createCoupon(couponData);
        toast({
          title: 'Sucesso',
          description: 'Cupom criado com sucesso',
        });
      }

      setDialogOpen(false);
      loadCoupons();
    } catch (error: any) {
      console.error('Erro ao salvar cupom:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Não foi possível salvar o cupom',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async () => {
    if (!couponToDelete) return;

    try {
      await deleteCoupon(couponToDelete);
      toast({
        title: 'Sucesso',
        description: 'Cupom excluído com sucesso',
      });
      setDeleteDialogOpen(false);
      setCouponToDelete(null);
      loadCoupons();
    } catch (error) {
      console.error('Erro ao excluir cupom:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir o cupom',
        variant: 'destructive',
      });
    }
  };

  const handleToggleActive = async (coupon: Coupon) => {
    try {
      await updateCoupon(coupon.id, { active: !coupon.active });
      toast({
        title: 'Sucesso',
        description: `Cupom ${!coupon.active ? 'ativado' : 'desativado'} com sucesso`,
      });
      loadCoupons();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o status',
        variant: 'destructive',
      });
    }
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: 'Copiado!',
      description: 'Código do cupom copiado para a área de transferência',
    });
  };

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (date: string) => {
    return format(new Date(date), 'dd/MM/yyyy', { locale: ptBR });
  };

  const getDiscountDisplay = (coupon: Coupon) => {
    if (coupon.discount_type === 'percentage') {
      return `${coupon.discount_value}%`;
    }
    return formatPrice(coupon.discount_value);
  };

  const isExpired = (coupon: Coupon) => {
    if (!coupon.valid_until) return false;
    return new Date(coupon.valid_until) < new Date();
  };

  const isLimitReached = (coupon: Coupon) => {
    if (!coupon.usage_limit) return false;
    return coupon.used_count >= coupon.usage_limit;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando cupons...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cupons de Desconto</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie cupons promocionais e códigos de desconto
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Cupom
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedCoupon ? 'Editar Cupom' : 'Novo Cupom'}
              </DialogTitle>
              <DialogDescription>
                {selectedCoupon
                  ? 'Atualize as informações do cupom'
                  : 'Crie um novo cupom de desconto'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="code">Código do Cupom *</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({ ...formData, code: e.target.value.toUpperCase() })
                    }
                    placeholder="Ex: BEMVINDO10"
                    required
                    maxLength={50}
                  />
                </div>

                <div className="col-span-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Descrição do cupom"
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="discount_type">Tipo de Desconto *</Label>
                  <Select
                    value={formData.discount_type}
                    onValueChange={(value: 'percentage' | 'fixed') =>
                      setFormData({ ...formData, discount_type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Porcentagem (%)</SelectItem>
                      <SelectItem value="fixed">Valor Fixo (R$)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="discount_value">
                    Valor do Desconto * {formData.discount_type === 'percentage' ? '(%)' : '(R$)'}
                  </Label>
                  <Input
                    id="discount_value"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.discount_value}
                    onChange={(e) =>
                      setFormData({ ...formData, discount_value: e.target.value })
                    }
                    placeholder={formData.discount_type === 'percentage' ? '10' : '50.00'}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="min_purchase">Compra Mínima (R$)</Label>
                  <Input
                    id="min_purchase"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.min_purchase}
                    onChange={(e) =>
                      setFormData({ ...formData, min_purchase: e.target.value })
                    }
                    placeholder="0.00"
                  />
                </div>

                {formData.discount_type === 'percentage' && (
                  <div>
                    <Label htmlFor="max_discount">Desconto Máximo (R$)</Label>
                    <Input
                      id="max_discount"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.max_discount}
                      onChange={(e) =>
                        setFormData({ ...formData, max_discount: e.target.value })
                      }
                      placeholder="Opcional"
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor="usage_limit">Limite de Uso</Label>
                  <Input
                    id="usage_limit"
                    type="number"
                    min="1"
                    value={formData.usage_limit}
                    onChange={(e) =>
                      setFormData({ ...formData, usage_limit: e.target.value })
                    }
                    placeholder="Ilimitado"
                  />
                </div>

                <div>
                  <Label htmlFor="valid_from">Válido A Partir De</Label>
                  <Input
                    id="valid_from"
                    type="date"
                    value={formData.valid_from}
                    onChange={(e) =>
                      setFormData({ ...formData, valid_from: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="valid_until">Válido Até</Label>
                  <Input
                    id="valid_until"
                    type="date"
                    value={formData.valid_until}
                    onChange={(e) =>
                      setFormData({ ...formData, valid_until: e.target.value })
                    }
                  />
                </div>

                <div className="col-span-2 flex items-center space-x-2">
                  <Switch
                    id="active"
                    checked={formData.active}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, active: checked })
                    }
                  />
                  <Label htmlFor="active" className="cursor-pointer">
                    Cupom Ativo
                  </Label>
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {selectedCoupon ? 'Atualizar' : 'Criar'} Cupom
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {coupons.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-muted/20">
          <Ticket className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Nenhum cupom cadastrado</h3>
          <p className="text-muted-foreground mb-4">
            Comece criando seu primeiro cupom de desconto
          </p>
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="h-4 w-4 mr-2" />
            Criar Primeiro Cupom
          </Button>
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Desconto</TableHead>
                <TableHead>Compra Mín.</TableHead>
                <TableHead>Uso</TableHead>
                <TableHead>Validade</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {coupons.map((coupon) => (
                <TableRow key={coupon.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <code className="font-mono font-bold text-sm bg-muted px-2 py-1 rounded">
                        {coupon.code}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(coupon.code)}
                        className="h-6 w-6 p-0"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {coupon.description || '-'}
                  </TableCell>
                  <TableCell>
                    <div className="font-semibold">{getDiscountDisplay(coupon)}</div>
                    {coupon.discount_type === 'percentage' && coupon.max_discount && (
                      <div className="text-xs text-muted-foreground">
                        Máx: {formatPrice(coupon.max_discount)}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {coupon.min_purchase > 0 ? formatPrice(coupon.min_purchase) : '-'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3 text-muted-foreground" />
                      <span className="font-medium">{coupon.used_count}</span>
                      {coupon.usage_limit && (
                        <span className="text-muted-foreground">/ {coupon.usage_limit}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {coupon.valid_until ? (
                        <>
                          <div>Até {formatDate(coupon.valid_until)}</div>
                          {isExpired(coupon) && (
                            <Badge variant="destructive" className="mt-1">
                              Expirado
                            </Badge>
                          )}
                        </>
                      ) : (
                        <span className="text-muted-foreground">Sem limite</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <Switch
                        checked={coupon.active}
                        onCheckedChange={() => handleToggleActive(coupon)}
                        disabled={isExpired(coupon) || isLimitReached(coupon)}
                      />
                      {isLimitReached(coupon) && (
                        <Badge variant="secondary" className="text-xs">
                          Limite atingido
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenDialog(coupon)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setCouponToDelete(coupon.id);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este cupom? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setCouponToDelete(null)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
