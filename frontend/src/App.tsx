import { Route, Switch } from 'wouter'
import { AppLayout } from './components/app-layout'
import { HomePage } from './components/home-page'
import { SettingsPage } from './components/settings-page'
import { ConnectionPage } from './components/connection-page'

function App() {
    return (
        <AppLayout>
            <Switch>
                <Route path="/" component={HomePage} />
                <Route path="/settings" component={SettingsPage} />
                <Route path="/connections/:connectionId">
                    {params => <ConnectionPage connectionId={params.connectionId} />}
                </Route>
            </Switch>
        </AppLayout>
    )
}

export default App