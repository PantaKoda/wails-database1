import { DatabaseExplorer } from "./database-explorer"

interface ConnectionPageProps {
    connectionId?: string;
}

export function ConnectionPage({ connectionId }: ConnectionPageProps) {
    return <DatabaseExplorer connectionId={connectionId} />
}