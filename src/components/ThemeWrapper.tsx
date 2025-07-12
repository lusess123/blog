'use client'

import React from 'react'
import { useTheme } from '../contexts/ThemeContext'
import ThemeSelector from './ThemeSelector'

interface ThemeWrapperProps {
  children: React.ReactNode
}

export default function ThemeWrapper({ children }: ThemeWrapperProps) {
  const { theme, setTheme } = useTheme()

  return (
    <>
      <ThemeSelector currentTheme={theme} onThemeChange={setTheme} />
      {children}
    </>
  )
}