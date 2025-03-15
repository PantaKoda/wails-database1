"use client"

import { createContext, useContext, useState, type ReactNode, useEffect } from "react"

type Theme = "light" | "dark" | "system"

interface ThemeContextProps {
    theme: Theme
    setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextProps>({
    theme: "system",
    setTheme: () => {},
})

interface ThemeProviderProps {
    children: ReactNode
    defaultTheme?: Theme
    storageKey?: string
}

export function ThemeProvider({
                                  children,
                                  defaultTheme = "system",
                                  storageKey = "db-manager-theme",
                              }: ThemeProviderProps) {
    const [theme, setTheme] = useState<Theme>(() => {
        if (typeof window === "undefined") {
            return defaultTheme
        }

        try {
            const storedTheme = window.localStorage.getItem(storageKey) as Theme | null
            return storedTheme || defaultTheme
        } catch (e) {
            return defaultTheme
        }
    })

    useEffect(() => {
        if (theme === "system") {
            document.documentElement.classList.remove("dark")
            document.documentElement.style.colorScheme = "light"
        } else if (theme === "dark") {
            document.documentElement.classList.add("dark")
            document.documentElement.style.colorScheme = "dark"
        } else {
            document.documentElement.classList.remove("dark")
            document.documentElement.style.colorScheme = "light"
        }

        if (typeof window !== "undefined") {
            localStorage.setItem(storageKey, theme)
        }
    }, [theme, storageKey])

    return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
    return useContext(ThemeContext)
}

