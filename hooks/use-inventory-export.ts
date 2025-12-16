import { useState } from 'react';
import { toast } from 'sonner';

interface InventoryExportFilters {
  dateFrom?: string;
  dateTo?: string;
  productId?: string;
  reason?: string;
  search?: string;
  period?: string;
}

export function useInventoryExport() {
  const [exportLoading, setExportLoading] = useState<string | null>(null);

  const exportData = async (format: 'xlsx' | 'pdf', filters: InventoryExportFilters = {}) => {
    try {
      setExportLoading(format);
      
      const exportParams = new URLSearchParams();
      exportParams.set('type', 'inventoryLogs');
      
      if (filters.dateFrom) exportParams.set('dateFrom', filters.dateFrom);
      if (filters.dateTo) exportParams.set('dateTo', filters.dateTo);
      if (filters.productId) exportParams.set('productId', filters.productId);
      if (filters.reason) exportParams.set('reason', filters.reason);
      if (filters.search) exportParams.set('search', filters.search);
      if (filters.period) exportParams.set('period', filters.period);

      const exportUrl = format === 'pdf' 
        ? `/api/inventoryLogs/export/pdf?${exportParams.toString()}`
        : `/api/inventoryLogs/export?${exportParams.toString()}`;
      
      console.log('Export request:', { format, filters, exportUrl });
      
      // Debug: Check current user session first
      const sessionCheck = await fetch('/api/auth/session', { credentials: 'include' });
      const session = await sessionCheck.json();
      console.log('Current session for export:', { 
        role: session?.user?.role, 
        permissions: session?.user?.permissions 
      });
      
      // Create a temporary link to download the file
      const response = await fetch(exportUrl, {
        method: 'GET',
        credentials: 'include', // Include cookies for authentication
        headers: {
          'Accept': format === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        }
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Export API Error:', {
          status: response.status,
          statusText: response.statusText,
          url: exportUrl,
          error: errorText
        });
        throw new Error(`Export failed (${response.status}): ${errorText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Get filename from response headers or create default
      const contentDisposition = response.headers.get('Content-Disposition');
      const filename = contentDisposition
        ? contentDisposition.split('filename=')[1]?.replace(/"/g, '')
        : `inventory_logs_export_${new Date().toISOString().split('T')[0]}.${format === 'xlsx' ? 'xlsx' : 'pdf'}`;
      
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success(`Inventory logs exported successfully as ${format.toUpperCase()}`);
      return { success: true };
    } catch (error) {
      console.error('Export error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Export failed';
      toast.error(`Export failed: ${errorMessage}`);
      return { success: false, error: errorMessage };
    } finally {
      setExportLoading(null);
    }
  };

  return {
    exportData,
    exportLoading,
  };
}

export type { InventoryExportFilters };