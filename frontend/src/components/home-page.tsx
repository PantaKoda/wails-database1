import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Database, Plus } from "lucide-react"
import { useConnection } from "../lib/connection-context"
import { Link } from "wouter"
import { getDatabaseIcon } from "../lib/database-icons"
import { ConnectionDialog } from "./connection-dialog"

export function HomePage() {
    const { connections } = useConnection()
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Database Connection Manager</h1>
                    <p className="text-muted-foreground">Connect to your databases and explore schemas, tables, and more.</p>
                </div>
                <Button onClick={() => setIsDialogOpen(true)} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add Connection
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {connections.map((connection) => (
                    <Link
                        key={connection.id}
                        href={`/connections/${connection.id}`}
                        className="no-underline"
                    >
                        <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                            <CardHeader className="pb-2">
                                <div className="flex items-center gap-2">
                                    <img
                                        src={getDatabaseIcon(connection.type)}
                                        alt={connection.type}
                                        className="h-8 w-8"
                                    />
                                    <CardTitle>{connection.name}</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="flex flex-col gap-1">
                                    <span>Host: {connection.host}</span>
                                    {connection.database && <span>Database: {connection.database}</span>}
                                </CardDescription>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>

            {connections.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Database className="h-12 w-12 text-muted-foreground mb-4" />
                    <h2 className="text-xl font-semibold mb-2">No connections yet</h2>
                    <p className="text-muted-foreground mb-4 max-w-md">
                        Click the + button to add your first database connection.
                    </p>
                    <Button onClick={() => setIsDialogOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Connection
                    </Button>
                </div>
            )}

            <ConnectionDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
            />
        </div>
    )
}