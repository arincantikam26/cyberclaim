// types/common.ts
export interface BaseEntity {
    id: string;
    name: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  }
  
  export interface ActionHandlers {
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    deleteLoading?: string | null;
  }
  
  export interface ViewConfig {
    type: 'grid' | 'list';
    columns?: ColumnConfig[];
  }
  
  export interface ColumnConfig {
    key: string;
    label: string;
    width?: string;
    sortable?: boolean;
    render?: (value: any, item: any) => React.ReactNode;
  }