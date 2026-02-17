import { Link, Outlet, useLocation } from 'react-router';
import { LayoutDashboard, Network, Users, Shield, Bell, Settings, FileEdit } from 'lucide-react';

export function Root() {
    const location = useLocation();

    const navigation = [
        { name: 'Dashboard', href: '/', icon: LayoutDashboard },
        { name: 'Manual Risk Assessment', href: '/manual-assessment', icon: FileEdit },
    ];

    const isActive = (href: string) => {
        if (href === '/') {
            return location.pathname === '/';
        }
        return location.pathname.startsWith(href);
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
                <div className="px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center overflow-hidden shadow-md">
                                <img
                                    src="/assets/Logo.png"
                                    alt="PDIE Logo"
                                    className="w-12 h-12 object-contain"
                                />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-slate-900">Pre-Delinquency Intervention Engine</h1>
                                <p className="text-xs text-slate-600">Predictive Risk Management Platform</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button className="p-2 hover:bg-slate-100 rounded-lg relative">
                                <Bell size={20} className="text-slate-600" />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                            </button>
                            <button className="p-2 hover:bg-slate-100 rounded-lg">
                                <Settings size={20} className="text-slate-600" />
                            </button>
                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-semibold">RC</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="px-6 flex gap-1 border-t border-slate-200">
                    {navigation.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.href);

                        return (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                                    active
                                        ? 'border-blue-600 text-blue-600'
                                        : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                                }`}
                            >
                                <Icon size={16} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </header>

            {/* Main Content */}
            <main className="p-6">
                <div className="max-w-[1600px] mx-auto">
                    <Outlet />
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-slate-200 mt-12">
                <div className="px-6 py-4 text-center text-sm text-slate-600">
                    © 2026 Pre-Delinquency Intervention Engine. Protecting customers and portfolio value through proactive intervention.
                </div>
            </footer>
        </div>
    );
}