import { useState, useEffect } from "react"
import { useLocation } from "wouter"
import { toast } from "sonner"
import { useConnection } from "../lib/connection-context"
import { DATABASE_TYPES } from "../lib/database-icons"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { ArrowLeft, ArrowRight, Search } from "lucide-react"

interface ConnectionDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function ConnectionDialog({ open, onOpenChange }: ConnectionDialogProps) {
    // Step management
    const [step, setStep] = useState<"select" | "configure">("select")

    // Database selection state
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedType, setSelectedType] = useState<string | null>(null)
    const [filteredDatabases, setFilteredDatabases] = useState(DATABASE_TYPES)

    // Form state
    const [connectionName, setConnectionName] = useState("")
    const [host, setHost] = useState("localhost")
    const [port, setPort] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [database, setDatabase] = useState("")
    const [filePath, setFilePath] = useState("")

    const { addConnection } = useConnection()
    const [, setLocation] = useLocation()

    // Filter databases based on search query
    useEffect(() => {
        if (!searchQuery) {
            setFilteredDatabases(DATABASE_TYPES)
            return
        }

        const filtered = DATABASE_TYPES.filter((db) => db.name.toLowerCase().includes(searchQuery.toLowerCase()))
        setFilteredDatabases(filtered)
    }, [searchQuery])

    // Reset state when dialog opens
    useEffect(() => {
        if (open) {
            setStep("select")
            setSelectedType(null)
            setSearchQuery("")
            resetForm()
        }
    }, [open])

    const handleDatabaseSelect = (dbType: string) => {
        setSelectedType(dbType)
    }

    const handleNextStep = () => {
        if (!selectedType) {
            toast.error("No database selected", {
                description: "Please select a database type to continue"
            })
            return
        }

        // Set default port based on selected database
        setPort(getDefaultPort(selectedType))

        // Move to next step
        setStep("configure")
    }

    const handlePreviousStep = () => {
        setStep("select")
    }

    const handleConnect = () => {
        // Validate form
        if (!connectionName) {
            toast.error("Connection name required", {
                description: "Please provide a name for this connection"
            })
            return
        }

        if (!selectedType) {
            toast.error("No database selected", {
                description: "Please select a database type"
            })
            return
        }

        if (selectedType === "sqlite") {
            if (!filePath) {
                toast.error("File path required", {
                    description: "Please provide a path to your SQLite database file"
                })
                return
            }
        } else {
            if (!host || !username || !database) {
                toast.error("Missing connection details", {
                    description: "Please fill in all required fields"
                })
                return
            }
        }

        // Create connection object
        const connection = {
            id: crypto.randomUUID(),
            name: connectionName,
            type: selectedType,
            host: selectedType === "sqlite" ? filePath : host,
            port: port || getDefaultPort(selectedType),
            username,
            database,
        }

        // Add connection
        const newConnectionId = addConnection(connection)

        // Show success message
        toast.success("Connection successful", {
            description: `Connected to ${connectionName}`
        })

        // Close the dialog
        onOpenChange(false)

        // Reset form
        resetForm()

        // Navigate to the connection page
        setLocation(`/connections/${newConnectionId}`)
    }

    const resetForm = () => {
        setConnectionName("")
        setHost("localhost")
        setPort("")
        setUsername("")
        setPassword("")
        setDatabase("")
        setFilePath("")
    }

    const getDefaultPort = (type: string) => {
        switch (type) {
            case "postgresql":
                return "5432"
            case "mysql":
                return "3306"
            case "mssql":
                return "1433"
            default:
                return ""
        }
    }

    const getSelectedDatabase = () => {
        return DATABASE_TYPES.find((db) => db.id === selectedType)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl">
                {step === "select" ? (
                    <>
                        <DialogHeader>
                            <DialogTitle>Select Database Type</DialogTitle>
                            <DialogDescription>Choose the type of database you want to connect to</DialogDescription>
                        </DialogHeader>

                        <div className="relative mb-4">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search databases..."
                                className="pl-9"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[400px] overflow-y-auto p-1">
                            {filteredDatabases.map((db) => (
                                <div
                                    key={db.id}
                                    className={`
                    flex flex-col items-center justify-center p-4 rounded-lg border cursor-pointer
                    transition-colors hover:bg-muted
                    ${selectedType === db.id ? "bg-primary/10 border-primary" : "border-border"}
                  `}
                                    onClick={() => handleDatabaseSelect(db.id)}
                                >
                                    <img
                                        src={db.icon}
                                        alt={db.name}
                                        className="h-12 w-12 mb-2"
                                    />
                                    <span className="text-sm font-medium text-center">{db.name}</span>
                                </div>
                            ))}

                            {filteredDatabases.length === 0 && (
                                <div className="col-span-full text-center py-8 text-muted-foreground">
                                    No databases found matching "{searchQuery}"
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end mt-6">
                            <Button onClick={handleNextStep} disabled={!selectedType} className="flex items-center gap-2">
                                Next <ArrowRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </>
                ) : (
                    <>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                {getSelectedDatabase() && (
                                    <img
                                        src={getSelectedDatabase()?.icon}
                                        alt={getSelectedDatabase()?.name}
                                        className="h-6 w-6"
                                    />
                                )}
                                Configure {getSelectedDatabase()?.name} Connection
                            </DialogTitle>
                            <DialogDescription>
                                Enter the details to connect to your {getSelectedDatabase()?.name} database
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 py-2">
                            <div className="space-y-2">
                                <Label htmlFor="connection-name">Connection Name</Label>
                                <Input
                                    id="connection-name"
                                    placeholder={`My ${getSelectedDatabase()?.name} Database`}
                                    value={connectionName}
                                    onChange={(e) => setConnectionName(e.target.value)}
                                />
                            </div>

                            {selectedType === "sqlite" ? (
                                <div className="space-y-2">
                                    <Label htmlFor="file-path">Database File</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="file-path"
                                            placeholder="/path/to/database.db"
                                            value={filePath}
                                            onChange={(e) => setFilePath(e.target.value)}
                                            className="flex-1"
                                        />
                                        <Button variant="outline">Browse...</Button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="host">Host</Label>
                                            <Input id="host" placeholder="localhost" value={host} onChange={(e) => setHost(e.target.value)} />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="port">Port</Label>
                                            <Input
                                                id="port"
                                                placeholder={getDefaultPort(selectedType || "")}
                                                value={port}
                                                onChange={(e) => setPort(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="username">Username</Label>
                                            <Input
                                                id="username"
                                                placeholder="username"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="password">Password</Label>
                                            <Input
                                                id="password"
                                                type="password"
                                                placeholder="••••••••"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="database">Database Name</Label>
                                        <Input
                                            id="database"
                                            placeholder="my_database"
                                            value={database}
                                            onChange={(e) => setDatabase(e.target.value)}
                                        />
                                    </div>
                                </>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="connection-options">Advanced Options</Label>
                                <Input id="connection-options" placeholder="key1=value1&key2=value2" />
                                <p className="text-xs text-muted-foreground">Additional connection string parameters</p>
                            </div>
                        </div>

                        <div className="flex justify-between mt-6">
                            <Button variant="outline" onClick={handlePreviousStep} className="flex items-center gap-2">
                                <ArrowLeft className="h-4 w-4" /> Back
                            </Button>

                            <div className="space-x-2">
                                <Button variant="outline">Test Connection</Button>
                                <Button onClick={handleConnect}>Connect</Button>
                            </div>
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    )
}