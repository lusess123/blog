'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

export type Theme = 'cyberpunk' | 'gothic' | 'mediterranean' | 'zen' | 'miyazaki' | 'starry'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

interface ThemeProviderProps {
  children: React.ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>('cyberpunk')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Get theme from localStorage on mount
    const savedTheme = localStorage.getItem('blog-theme') as Theme
    if (savedTheme && ['cyberpunk', 'gothic', 'mediterranean', 'zen', 'miyazaki', 'starry'].includes(savedTheme)) {
      setThemeState(savedTheme)
    }
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      // Apply theme to document
      document.documentElement.setAttribute('data-theme', theme)
      // Save theme to localStorage
      localStorage.setItem('blog-theme', theme)
    }
  }, [theme, mounted])

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}