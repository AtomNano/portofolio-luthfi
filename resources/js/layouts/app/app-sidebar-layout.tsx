import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import type { AppLayoutProps } from '@/types';

export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
}: AppLayoutProps) {
    return (
        <AppShell variant="sidebar">
            {/* Animated Gradient Background */}
            <div className="fixed inset-0 -z-50 overflow-hidden">
                <style>{`
                    @keyframes bgShift {
                        0%   { background-position: 0% 50%; }
                        50%  { background-position: 100% 50%; }
                        100% { background-position: 0% 50%; }
                    }
                    .dashboard-bg {
                        background: linear-gradient(
                            135deg,
                            #020817 0%,
                            #0a1628 20%,
                            #061020 35%,
                            #0d1b2a 50%,
                            #020c1b 65%,
                            #060f1e 80%,
                            #020817 100%
                        );
                        background-size: 400% 400%;
                        animation: bgShift 20s ease infinite;
                    }
                `}</style>
                <div className="dashboard-bg absolute inset-0" />
                {/* Cyan glow orbs */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl" />
                <div className="absolute top-2/3 left-1/2 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl" />
                <div className="absolute inset-0 bg-black/30" />
            </div>

            <AppSidebar />
            <AppContent variant="sidebar" className="overflow-x-hidden bg-transparent font-mono text-gray-200">
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                {children}
            </AppContent>
        </AppShell>
    );
}
