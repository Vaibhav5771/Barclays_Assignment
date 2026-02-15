import { createBrowserRouter } from 'react-router';
import { Root } from './pages/Root';
import { Dashboard } from './pages/Dashboard';
import { Architecture } from './pages/Architecture';
import { Customers } from './pages/Customers';
import { CustomerDetail } from './pages/CustomerDetail';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      { index: true, Component: Dashboard },
      { path: 'architecture', Component: Architecture },
      { path: 'customers', Component: Customers },
      { path: 'customers/:customerId', Component: CustomerDetail },
      { 
        path: '*', 
        Component: () => (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Page Not Found</h2>
            <p className="text-slate-600">The page you're looking for doesn't exist.</p>
          </div>
        )
      }
    ]
  }
]);
