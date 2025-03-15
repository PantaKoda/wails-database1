import { createContext, useContext, useState, type ReactNode } from "react"

export interface ConnectionType {
    id: string
    name: string
    type: string
    host: string
    port?: string
    username?: string
    database?: string
}

interface ConnectionContextType {
    connections: ConnectionType[]
    addConnection: (connection: ConnectionType) => string
    removeConnection: (id: string) => void
    getConnection: (id: string) => ConnectionType | undefined
}

const ConnectionContext = createContext<ConnectionContextType | undefined>(undefined)

// Sample initial connections for demo purposes
const initialConnections: ConnectionType[] = [
    {
        id: "1",
        name: "Local PostgreSQL",
        type: "postgresql",
        host: "localhost",
        port: "5432",
        username: "postgres",
        database: "postgres",
    },
    {
        id: "2",
        name: "Production MySQL",
        type: "mysql",
        host: "db.example.com",
        port: "3306",
        username: "admin",
        database: "production",
    },
]

export function ConnectionProvider({ children }: { children: ReactNode }) {
    const [connections, setConnections] = useState<ConnectionType[]>(initialConnections)

    const addConnection = (connection: ConnectionType) => {
        // Ensure connection has an ID if not provided
        if (!connection.id) {
            connection.id = crypto.randomUUID()
        }
        setConnections((prev) => [...prev, connection])
        return connection.id
    }

    const removeConnection = (id: string) => {
        setConnections((prev) => prev.filter((conn) => conn.id !== id))
    }

    const getConnection = (id: string) => {
        return connections.find((conn) => conn.id === id)
    }

    return (
        <ConnectionContext.Provider value={{ connections, addConnection, removeConnection, getConnection }}>
            {children}
        </ConnectionContext.Provider>
    )
}

export function useConnection() {
    const context = useContext(ConnectionContext)
    if (context === undefined) {
        throw new Error("useConnection must be used within a ConnectionProvider")
    }
    return context
}