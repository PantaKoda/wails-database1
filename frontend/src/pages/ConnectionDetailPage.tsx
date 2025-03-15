import { useRoute } from 'wouter'
import { ConnectionPage as ConnectionDetailComponent } from '../components/connection-page'

const ConnectionDetailPage = () => {
    // Extract the connectionId parameter from the URL
    const [, params] = useRoute('/connections/:connectionId')
    const connectionId = params?.connectionId

    return <ConnectionDetailComponent connectionId={connectionId} />
}

export default ConnectionDetailPage