import { Link, Outlet, useLocation } from 'react-router';
import { LayoutDashboard, Network, Users, Shield, Bell, Settings, FileEdit } from 'lucide-react';
import { useState, useEffect } from 'react';

export function Root() {
    const location = useLocation();
    const [logoError, setLogoError] = useState(false);
    const [logoPath, setLogoPath] = useState('');

    useEffect(() => {
        // Determine correct logo path based on environment
        const isNetlify = window.location.hostname.includes('netlify.app');
        const basePath = isNetlify ? '/' : '/';
        setLogoPath(`${basePath}assets/Logo.png`);

        // Log for debugging
        console.log('🖼️ Logo path:', `${basePath}assets/Logo.png`);
        console.log('🌐 Hostname:', window.location.hostname);
        console.log('📁 Environment:', isNetlify ? 'netlify' : 'local');
    }, []);

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
            {/* Header - Mobile Responsive */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
                <div className="px-4 sm:px-6 py-3 sm:py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                            {/* Logo - Responsive sizing with fallback */}
                            <div className="w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center overflow-hidden shadow-md flex-shrink-0">
                                {!logoError && logoPath ? (
                                    <img
                                        src={logoPath}
                                        alt="PDIE Logo"
                                        className="w-8 h-8 sm:w-12 sm:h-12 object-contain"
                                        onError={(e) => {
                                            console.error('❌ Logo failed to load:', {
                                                src: e.currentTarget.src,
                                                path: logoPath,
                                                hostname: window.location.hostname
                                            });
                                            setLogoError(true);
                                        }}
                                        onLoad={() => console.log('✅ Logo loaded successfully from:', logoPath)}
                                        loading="eager"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center w-full h-full">
                                        <span className="text-white text-lg sm:text-xl font-bold">
                                            PDIE
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Title - Hidden on very small screens, truncates on mobile */}
                            <div className="min-w-0">
                                <h1 className="text-sm sm:text-base md:text-xl font-bold text-slate-900 truncate">
                                    Pre-Delinquency Intervention Engine
                                </h1>
                                <p className="text-xs text-slate-600 hidden sm:block">
                                    Predictive Risk Management Platform
                                </p>
                                <p className="text-xs text-slate-600 sm:hidden">
                                    PDIE Platform
                                </p>
                            </div>
                        </div>

                        {/* Action Buttons - Compact on mobile */}
                        <div className="flex items-center gap-1 sm:gap-3 flex-shrink-0">
                            <button className="p-1.5 sm:p-2 hover:bg-slate-100 rounded-lg relative">
                                <Bell size={16} className="sm:w-5 sm:h-5 text-slate-600" />
                                <span className="absolute top-1 right-1 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-500 rounded-full"></span>
                            </button>
                            <button className="p-1.5 sm:p-2 hover:bg-slate-100 rounded-lg">
                                <Settings size={16} className="sm:w-5 sm:h-5 text-slate-600" />
                            </button>
                            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs sm:text-sm font-semibold">RC</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation - Scrollable on mobile */}
                <nav className="px-4 sm:px-6 flex gap-1 border-t border-slate-200 overflow-x-auto hide-scrollbar">
                    {navigation.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.href);

                        return (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap flex-shrink-0 ${
                                    active
                                        ? 'border-blue-600 text-blue-600'
                                        : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                                }`}
                            >
                                <Icon size={14} className="sm:w-4 sm:h-4" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </header>

            {/* Main Content - Responsive padding */}
            <main className="p-3 sm:p-4 md:p-6">
                <div className="max-w-[1600px] mx-auto">
                    <Outlet />
                </div>
            </main>

            {/* Footer - Responsive text */}
            <footer className="bg-white border-t border-slate-200 mt-8 sm:mt-12">
                <div className="px-4 sm:px-6 py-3 sm:py-4 text-center text-xs sm:text-sm text-slate-600">
                    © 2026 Pre-Delinquency Intervention Engine. Protecting customers and portfolio value through proactive intervention.
                </div>
            </footer>

            <style>{`
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div>
    );
}