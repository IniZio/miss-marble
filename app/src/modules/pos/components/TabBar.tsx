// Add a tab bar for /pos and /pos/inventory
import { Routes } from 'generated';
import { HomeIcon, WarehouseIcon } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

const TabBar: React.FC = () => {
  return (
    <nav style={{ marginTop: 'auto', backgroundColor: '#f8f9fa', borderTop: '1px solid #dee2e6' }}>
      <ul style={{ display: 'flex', justifyContent: 'space-around', listStyle: 'none', padding: '1em 0' }}>
        <li>
          <Link href={Routes.PosHomePage()}><HomeIcon /> Home</Link>
        </li>
        <li>
          <Link href={Routes.InventoryListPage()}><WarehouseIcon /> Inventory</Link>
        </li>
      </ul>
    </nav>
  );
}

export default TabBar