import { ThemeProvider } from "./theme-provider"
import { AppSidebar } from "./app-sidebar"
import { Toaster } from "@/components/ui/sonner"
import { ConnectionProvider } from "../lib/connection-context"

interface AppLayoutProps {
    children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {

    return (
        <ThemeProvider defaultTheme="light" storageKey="db-manager-theme">
            <ConnectionProvider>
                <div className="min-h-screen">
                    <AppSidebar />
                    <div className="transition-all duration-300 md:pl-64">
                        <main className="container mx-auto p-4 md:p-8">
                            {children}
                        </main>
                    </div>
                </div>
                <Toaster />
            </ConnectionProvider>
        </ThemeProvider>
    )
}