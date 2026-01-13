import React, { useState } from 'react';
import './Table.css';

export interface TableColumn<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  keyExtractor: (item: T) => string | number;
  hoverable?: boolean;
  onRowClick?: (item: T) => void;
  stickyHeader?: boolean;
  className?: string;
}

type SortDirection = 'asc' | 'desc' | null;

export function Table<T extends Record<string, any>>({
  columns,
  data,
  keyExtractor,
  hoverable = true,
  onRowClick,
  stickyHeader = false,
  className = ''
}: TableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const handleSort = (key: string) => {
    const column = columns.find(col => col.key === key);
    if (!column?.sortable) return;

    if (sortKey === key) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortKey(null);
        setSortDirection(null);
      }
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const sortedData = React.useMemo(() => {
    if (!sortKey || !sortDirection) return data;

    return [...data].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];

      if (aVal === bVal) return 0;
      
      const comparison = aVal < bVal ? -1 : 1;
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [data, sortKey, sortDirection]);

  const tableClassNames = [
    'table',
    stickyHeader ? 'table--sticky-header' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className="table-container">
      <table className={tableClassNames}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={`table__header ${column.sortable ? 'table__header--sortable' : ''} ${column.align ? `table__header--${column.align}` : ''}`}
                onClick={() => column.sortable && handleSort(column.key)}
              >
                <div className="table__header-content">
                  <span>{column.header}</span>
                  {column.sortable && sortKey === column.key && (
                    <span className="table__sort-icon">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((item) => (
            <tr
              key={keyExtractor(item)}
              className={`table__row ${hoverable ? 'table__row--hoverable' : ''} ${onRowClick ? 'table__row--clickable' : ''}`}
              onClick={() => onRowClick?.(item)}
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={`table__cell ${column.align ? `table__cell--${column.align}` : ''}`}
                >
                  {column.render ? column.render(item) : item[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {sortedData.length === 0 && (
        <div className="table__empty">No data available</div>
      )}
    </div>
  );
}
