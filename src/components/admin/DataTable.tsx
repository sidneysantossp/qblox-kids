import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';

interface Column<T> {
  key: string;
  label: string;
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchKey?: keyof T;
  searchPlaceholder?: string;
  onRowClick?: (item: T) => void;
  actions?: (item: T) => React.ReactNode;
  getRowId?: (item: T) => string;
  selectable?: boolean;
  selectedRowIds?: string[];
  onSelectedRowIdsChange?: (ids: string[]) => void;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  searchKey,
  searchPlaceholder = 'Buscar...',
  onRowClick,
  actions,
  getRowId,
  selectable = false,
  selectedRowIds = [],
  onSelectedRowIdsChange,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(() => {
    // Carregar preferência do localStorage
    const saved = localStorage.getItem('productsPerPage');
    return saved ? parseInt(saved, 10) : 10;
  });

  // Salvar preferência no localStorage quando mudar
  useEffect(() => {
    localStorage.setItem('productsPerPage', itemsPerPage.toString());
  }, [itemsPerPage]);

  // Filter data
  const filteredData = searchKey
    ? data.filter((item) =>
        String(item[searchKey]).toLowerCase().includes(searchTerm.toLowerCase())
      )
    : data;

  // Paginate data
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);
  const paginatedRowIds = getRowId ? paginatedData.map((item) => getRowId(item)) : [];
  const allPaginatedRowsSelected = selectable && paginatedRowIds.length > 0 && paginatedRowIds.every((id) => selectedRowIds.includes(id));
  const somePaginatedRowsSelected = selectable && paginatedRowIds.some((id) => selectedRowIds.includes(id));

  // Resetar para página 1 ao alterar quantidade por página
  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(parseInt(value, 10));
    setCurrentPage(1);
  };

  const handleToggleAllVisibleRows = (checked: boolean) => {
    if (!selectable || !getRowId || !onSelectedRowIdsChange) return;

    if (checked) {
      const merged = Array.from(new Set([...selectedRowIds, ...paginatedRowIds]));
      onSelectedRowIdsChange(merged);
      return;
    }

    onSelectedRowIdsChange(selectedRowIds.filter((id) => !paginatedRowIds.includes(id)));
  };

  const handleToggleRow = (rowId: string, checked: boolean) => {
    if (!selectable || !onSelectedRowIdsChange) return;

    if (checked) {
      onSelectedRowIdsChange(Array.from(new Set([...selectedRowIds, rowId])));
      return;
    }

    onSelectedRowIdsChange(selectedRowIds.filter((id) => id !== rowId));
  };

  return (
    <div className="space-y-4">
      {/* Search and Items Per Page Filter */}
      {searchKey && (
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-9"
            />
          </div>
          
          {/* Items Per Page Selector */}
          <div className="flex items-center gap-2">
            <label htmlFor="items-per-page" className="text-sm font-medium text-foreground whitespace-nowrap">
              Exibir:
            </label>
            <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
              <SelectTrigger id="items-per-page" className="w-[140px] h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 por página</SelectItem>
                <SelectItem value="50">50 por página</SelectItem>
                <SelectItem value="100">100 por página</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {selectable && (
                <TableHead className="w-12">
                  <Checkbox
                    checked={allPaginatedRowsSelected ? true : somePaginatedRowsSelected ? 'indeterminate' : false}
                    onCheckedChange={(checked) => handleToggleAllVisibleRows(checked === true)}
                    aria-label="Selecionar produtos visíveis"
                  />
                </TableHead>
              )}
              {columns.map((column) => (
                <TableHead key={column.key}>{column.label}</TableHead>
              ))}
              {actions && <TableHead className="text-right">Ações</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((item, index) => {
                const rowId = getRowId ? getRowId(item) : String(index);
                const isSelected = selectedRowIds.includes(rowId);

                return (
                  <TableRow
                    key={rowId}
                    className={onRowClick ? 'cursor-pointer' : ''}
                    onClick={() => onRowClick?.(item)}
                  >
                    {selectable && (
                      <TableCell onClick={(e) => e.stopPropagation()} className="w-12">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={(checked) => handleToggleRow(rowId, checked === true)}
                          aria-label="Selecionar produto"
                        />
                      </TableCell>
                    )}
                    {columns.map((column) => (
                      <TableCell key={column.key}>
                        {column.render ? column.render(item) : item[column.key]}
                      </TableCell>
                    ))}
                    {actions && (
                      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                        {actions(item)}
                      </TableCell>
                    )}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length + (actions ? 1 : 0) + (selectable ? 1 : 0)} className="text-center py-8">
                  <p className="text-muted-foreground">Nenhum registro encontrado</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Mostrando {startIndex + 1} a {Math.min(startIndex + itemsPerPage, filteredData.length)} de{' '}
            {filteredData.length} registros
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">
              Página {currentPage} de {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
