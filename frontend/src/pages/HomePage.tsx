import { useRoute } from 'wouter'
import { useConnection } from '../lib/connection-context'

const ConnectionDetailPage = () => {
    // Extract the connectionId from the URL using wouter
    const [, params] = useRoute('/connections/:connectionId')
    const connectionId = params?.connectionId

    const { getConnection } = useConnection()
    const connection = connectionId ? getConnection(connectionId) : null

    if (!connection) {
        return <div>Connection not found</div>
    }

    return (
        <div>
            <h1>Connection: {connection.name}</h1>
            <p>Type: {connection.type}</p>
            <p>Host: {connection.host}</p>
        </div>
    )
}

export default ConnectionDetailPage