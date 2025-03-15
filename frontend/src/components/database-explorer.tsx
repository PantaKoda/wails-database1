import { useState } from "react"
import { useLocation } from "wouter"
import { useConnection } from "../lib/connection-context"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./ui/resizable"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import {
    ChevronRight,
    Database,
    TableIcon,
    Key,
    Search,
    Play,
    Save,
    Download,
    Columns,
    Code,
    ArrowLeft,
} from "lucide-react"
import { ScrollArea } from "./ui/scroll-area"

interface DatabaseExplorerProps {
    connectionId?: string
}

export function DatabaseExplorer({ connectionId }: DatabaseExplorerProps) {
    const { getConnection } = useConnection()
    const [, navigate] = useLocation()

    if (!connectionId) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
                <h2 className="text-2xl font-bold">Connection not found</h2>
                <Button onClick={() => navigate("/")}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to connections
                </Button>
            </div>
        )
    }

    const connection = getConnection(connectionId)

    // If connection is not found with the valid ID
    if (!connection) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
                <h2 className="text-2xl font-bold">Connection not found</h2>
                <Button onClick={() => navigate("/")}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to connections
                </Button>
            </div>
        )
    }

    const [activeTab, setActiveTab] = useState<string>("browser")
    const [expandedSchemas, setExpandedSchemas] = useState<Record<string, boolean>>({
        public: true,
    })

    const [expandedTables, setExpandedTables] = useState<Record<string, boolean>>({})

    // Mock data for UI demonstration
    const schemas = [
        {
            name: "public",
            tables: [
                { name: "users", columns: ["id", "name", "email", "created_at"] },
                { name: "products", columns: ["id", "name", "price", "category_id"] },
                { name: "orders", columns: ["id", "user_id", "total", "status"] },
            ],
        },
        {
            name: "auth",
            tables: [
                { name: "users", columns: ["id", "email", "password_hash"] },
                { name: "sessions", columns: ["id", "user_id", "token", "expires_at"] },
            ],
        },
    ]

    const toggleSchema = (schema: string) => {
        setExpandedSchemas((prev) => ({
            ...prev,
            [schema]: !prev[schema],
        }))
    }

    const toggleTable = (table: string) => {
        setExpandedTables((prev) => ({
            ...prev,
            [table]: !prev[table],
        }))
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" onClick={() => navigate("/")}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                        <img
                            src={`https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${connection.type}/${connection.type}-original.svg`}
                            alt={connection.type}
                            className="h-8 w-8"
                        />
                        {connection.name}
                    </h1>
                    <p className="text-muted-foreground">{connection.host}</p>
                </div>
            </div>

            <ResizablePanelGroup direction="horizontal" className="min-h-[600px] rounded-lg border">
                {/* Schema Browser */}
                <ResizablePanel defaultSize={20} minSize={15}>
                    <div className="h-full flex flex-col">
                        <div className="p-2 border-b">
                            <Input placeholder="Search objects..." className="h-8" />
                        </div>
                        <ScrollArea className="flex-1">
                            <div className="p-2">
                                {schemas.map((schema) => (
                                    <div key={schema.name} className="mb-2">
                                        <div
                                            className="flex items-center gap-1 p-1 rounded hover:bg-muted cursor-pointer"
                                            onClick={() => toggleSchema(schema.name)}
                                        >
                                            <ChevronRight
                                                className={`h-4 w-4 transition-transform ${expandedSchemas[schema.name] ? "rotate-90" : ""}`}
                                            />
                                            <Database className="h-4 w-4 text-primary" />
                                            <span className="text-sm font-medium">{schema.name}</span>
                                        </div>

                                        {expandedSchemas[schema.name] && (
                                            <div className="ml-6 mt-1 space-y-1">
                                                {schema.tables.map((table) => (
                                                    <div key={table.name}>
                                                        <div
                                                            className="flex items-center gap-1 p-1 rounded hover:bg-muted cursor-pointer"
                                                            onClick={() => toggleTable(`${schema.name}.${table.name}`)}
                                                        >
                                                            <ChevronRight
                                                                className={`h-4 w-4 transition-transform ${expandedTables[`${schema.name}.${table.name}`] ? "rotate-90" : ""}`}
                                                            />
                                                            <TableIcon className="h-4 w-4 text-blue-500" />
                                                            <span className="text-sm">{table.name}</span>
                                                        </div>

                                                        {expandedTables[`${schema.name}.${table.name}`] && (
                                                            <div className="ml-6 mt-1 space-y-1">
                                                                {table.columns.map((column) => (
                                                                    <div key={column} className="flex items-center gap-1 p-1">
                                                                        <Columns className="h-4 w-4 text-muted-foreground" />
                                                                        <span className="text-sm">{column}</span>
                                                                        {column === "id" && <Key className="h-3 w-3 text-amber-500 ml-auto" />}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>
                </ResizablePanel>

                <ResizableHandle />

                {/* Main Content */}
                <ResizablePanel defaultSize={80}>
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
                        <div className="border-b px-4">
                            <TabsList className="mt-2">
                                <TabsTrigger value="browser">Data Browser</TabsTrigger>
                                <TabsTrigger value="query">Query Editor</TabsTrigger>
                                <TabsTrigger value="structure">Structure</TabsTrigger>
                            </TabsList>
                        </div>

                        <TabsContent value="browser" className="flex-1 p-0 m-0">
                            <div className="h-full flex flex-col">
                                <div className="p-4 border-b flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <TableIcon className="h-5 w-5 text-blue-500" />
                                        <span className="font-medium">public.users</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="relative">
                                            <Search className="h-4 w-4 absolute left-2 top-2.5 text-muted-foreground" />
                                            <Input placeholder="Search records..." className="pl-8 h-9 w-60" />
                                        </div>
                                        <Button size="sm" variant="outline">
                                            <Download className="h-4 w-4 mr-1" />
                                            Export
                                        </Button>
                                    </div>
                                </div>

                                <div className="flex-1 p-4 overflow-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>id</TableHead>
                                                <TableHead>name</TableHead>
                                                <TableHead>email</TableHead>
                                                <TableHead>created_at</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {Array.from({ length: 10 }).map((_, i) => (
                                                <TableRow key={i}>
                                                    <TableCell>{i + 1}</TableCell>
                                                    <TableCell>User {i + 1}</TableCell>
                                                    <TableCell>user{i + 1}@example.com</TableCell>
                                                    <TableCell>2023-01-{10 + i}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="query" className="flex-1 p-0 m-0">
                            <div className="h-full flex flex-col">
                                <div className="p-4 border-b flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Code className="h-5 w-5 text-blue-500" />
                                        <span className="font-medium">SQL Query</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button size="sm" variant="outline">
                                            <Save className="h-4 w-4 mr-1" />
                                            Save
                                        </Button>
                                        <Button size="sm">
                                            <Play className="h-4 w-4 mr-1" />
                                            Run
                                        </Button>
                                    </div>
                                </div>

                                <div className="flex-1 p-4">
                                    <div className="h-40 border rounded-md p-2 font-mono text-sm">
                                        SELECT * FROM public.users WHERE created_at &gt; '2023-01-15' ORDER BY id DESC LIMIT 100;
                                    </div>

                                    <div className="mt-4">
                                        <h3 className="text-sm font-medium mb-2">Results</h3>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>id</TableHead>
                                                    <TableHead>name</TableHead>
                                                    <TableHead>email</TableHead>
                                                    <TableHead>created_at</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {Array.from({ length: 5 }).map((_, i) => (
                                                    <TableRow key={i}>
                                                        <TableCell>{i + 6}</TableCell>
                                                        <TableCell>User {i + 6}</TableCell>
                                                        <TableCell>user{i + 6}@example.com</TableCell>
                                                        <TableCell>2023-01-{15 + i}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="structure" className="flex-1 p-0 m-0">
                            <div className="h-full flex flex-col p-4">
                                <h3 className="text-lg font-medium mb-4">Table Structure: public.users</h3>

                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Column</TableHead>
                                            <TableHead>Type</TableHead>
                                            <TableHead>Nullable</TableHead>
                                            <TableHead>Default</TableHead>
                                            <TableHead>Description</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell className="font-medium">id</TableCell>
                                            <TableCell>integer</TableCell>
                                            <TableCell>NO</TableCell>
                                            <TableCell>nextval('users_id_seq'::regclass)</TableCell>
                                            <TableCell>Primary key</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="font-medium">name</TableCell>
                                            <TableCell>varchar(255)</TableCell>
                                            <TableCell>NO</TableCell>
                                            <TableCell></TableCell>
                                            <TableCell>User's full name</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="font-medium">email</TableCell>
                                            <TableCell>varchar(255)</TableCell>
                                            <TableCell>NO</TableCell>
                                            <TableCell></TableCell>
                                            <TableCell>User's email address</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="font-medium">created_at</TableCell>
                                            <TableCell>timestamp</TableCell>
                                            <TableCell>NO</TableCell>
                                            <TableCell>CURRENT_TIMESTAMP</TableCell>
                                            <TableCell>Creation timestamp</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>

                                <h4 className="text-md font-medium mt-6 mb-2">Indexes</h4>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Columns</TableHead>
                                            <TableHead>Type</TableHead>
                                            <TableHead>Unique</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>users_pkey</TableCell>
                                            <TableCell>id</TableCell>
                                            <TableCell>btree</TableCell>
                                            <TableCell>YES</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>users_email_idx</TableCell>
                                            <TableCell>email</TableCell>
                                            <TableCell>btree</TableCell>
                                            <TableCell>YES</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </div>
                        </TabsContent>
                    </Tabs>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    )
}