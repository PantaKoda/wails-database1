import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Label } from "./ui/label"
import { Switch } from "./ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"

export function SettingsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">Manage your application preferences and connection settings.</p>
            </div>

            <Tabs defaultValue="general">
                <TabsList>
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="connections">Connections</TabsTrigger>
                    <TabsTrigger value="appearance">Appearance</TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="space-y-4 mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Application Settings</CardTitle>
                            <CardDescription>Configure general application behavior.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="auto-connect">Auto-connect on startup</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Automatically connect to the last used database on startup
                                    </p>
                                </div>
                                <Switch id="auto-connect" />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="save-queries">Save query history</Label>
                                    <p className="text-sm text-muted-foreground">Save your query history for future reference</p>
                                </div>
                                <Switch id="save-queries" defaultChecked />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="connections" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Connection Settings</CardTitle>
                            <CardDescription>Configure how connections are managed.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="timeout">Connection timeout (seconds)</Label>
                                    <p className="text-sm text-muted-foreground">
                                        How long to wait before timing out a connection attempt
                                    </p>
                                </div>
                                <input
                                    type="number"
                                    id="timeout"
                                    className="w-20 h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                                    defaultValue={30}
                                    min={5}
                                    max={120}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="ssl-verify">Verify SSL certificates</Label>
                                    <p className="text-sm text-muted-foreground">Verify SSL certificates when connecting to databases</p>
                                </div>
                                <Switch id="ssl-verify" defaultChecked />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="appearance" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Appearance Settings</CardTitle>
                            <CardDescription>Customize the look and feel of the application.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="theme">Theme</Label>
                                    <p className="text-sm text-muted-foreground">Choose between light and dark mode</p>
                                </div>
                                <select
                                    id="theme"
                                    className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                                    defaultValue="system"
                                >
                                    <option value="light">Light</option>
                                    <option value="dark">Dark</option>
                                    <option value="system">System</option>
                                </select>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="font-size">Font size</Label>
                                    <p className="text-sm text-muted-foreground">Adjust the font size for the application</p>
                                </div>
                                <select
                                    id="font-size"
                                    className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                                    defaultValue="medium"
                                >
                                    <option value="small">Small</option>
                                    <option value="medium">Medium</option>
                                    <option value="large">Large</option>
                                </select>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

