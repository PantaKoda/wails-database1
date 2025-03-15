// Define the Go runtime interface
interface Go {
    main: {
        App: {
            Greet(name: string): Promise<string>;
            // Add other Go functions here as needed
        };
    };
}

// Augment the Window interface
interface Window {
    go?: Go;
}