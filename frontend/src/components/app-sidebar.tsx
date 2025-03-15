// src/components/app-sidebar.tsx
import { Link, useLocation } from "wouter"
import { Button } from "./ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"
import { Home, Settings, HelpCircle, PlusCircle } from "lucide-react"
import { useConnection } from "../lib/connection-context"
import { getDatabaseIcon } from "../lib/database-icons"
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarGroup
} from "./ui/sidebar"

export function AppSidebar() {
    const [location] = useLocation()
    const { connections } = useConnection()

    return (
        <Sidebar>
            <SidebarHeader className="py-4">
                <SidebarGroup>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link href="/">
                                <Button
                                    variant={location === "/" ? "secondary" : "ghost"}
                                    size="icon"
                                    className="h-9 w-9"
                                >
                                    <Home size={18} />
                                </Button>
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right">Home</TooltipContent>
                    </Tooltip>
                </SidebarGroup>
            </SidebarHeader>

            <SidebarContent>
                <SidebarMenu>
                    {connections.map((connection) => (
                        <SidebarMenuItem key={connection.id}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Link href={`/connections/${connection.id}`}>
                                        <Button
                                            variant={location === `/connections/${connection.id}` ? "secondary" : "ghost"}
                                            size="icon"
                                            className="h-9 w-9"
                                        >
                                            {getDatabaseIcon(connection.type)}
                                        </Button>
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent side="right">
                                    {connection.name}
                                </TooltipContent>
                            </Tooltip>
                        </SidebarMenuItem>
                    ))}

                    <SidebarMenuItem>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-9 w-9"
                                    onClick={() => {
                                        // Trigger connection dialog here directly
                                        // or use a state to control the dialog open state
                                    }}
                                >
                                    <PlusCircle size={18} />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="right">Add connection</TooltipContent>
                        </Tooltip>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarContent>

            <SidebarGroup className="mt-auto">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Link href="/about">
                            <Button
                                variant={location === "/about" ? "secondary" : "ghost"}
                                size="icon"
                                className="h-9 w-9"
                            >
                                <HelpCircle size={18} />
                            </Button>
                        </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">About</TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Link href="/settings">
                            <Button
                                variant={location === "/settings" ? "secondary" : "ghost"}
                                size="icon"
                                className="h-9 w-9"
                            >
                                <Settings size={18} />
                            </Button>
                        </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">Settings</TooltipContent>
                </Tooltip>
            </SidebarGroup>
        </Sidebar>
    )
}