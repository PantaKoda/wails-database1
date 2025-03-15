import { createFileRoute } from '@tanstack/react-router'
import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
    const [greeting, setGreeting] = useState('');

    useEffect(() => {
        // Example calling backend Go function
        window.go?.main?.App?.Greet("from React").then(result => {
            setGreeting(result);
        }).catch(err => {
            console.error("Error calling Greet:", err);
        });
    }, []);

    return (
        <div className="container py-8">
            <h1 className="text-3xl font-bold mb-4">Home Page</h1>
            <p className="mb-4">Welcome to your Wails application with modern React stack!</p>

            {greeting && (
                <div className="bg-muted p-4 rounded-md mb-6">
                    <p>{greeting}</p>
                </div>
            )}

            <div className="flex gap-4">
                <Button>Default Button</Button>
                <Button variant="secondary">Secondary Button</Button>
                <Button variant="outline">Outline Button</Button>
                <Button variant="destructive">Destructive Button</Button>
            </div>
        </div>
    );
}