import { DatabaseExplorer } from "./database-explorer"

interface ConnectionPageProps {
    connectionId?: string;  // Making it optional since it could be undefined
}
export function ConnectionPage({ connectionId }: ConnectionPageProps) {

    return <DatabaseExplorer connectionId={connectionId} />
}

