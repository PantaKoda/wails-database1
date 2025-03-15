import { Route, Switch } from 'wouter'
import { AppLayout } from './components/app-layout'
import HomePage from './pages/HomePage'
import SettingsPage from './pages/SettingsPage'
import ConnectionDetailPage from './pages/ConnectionDetailPage'

function App() {
    return (
        <AppLayout>
            <Switch>
                <Route path="/" component={HomePage} />
                <Route path="/settings" component={SettingsPage} />
                <Route path="/connections/:connectionId" component={ConnectionDetailPage} />
            </Switch>
        </AppLayout>
    )
}

export default App