'use client'

import React, { useState, useEffect } from 'react'
import './ThemeSelector.scss'

export type Theme = 'light' | 'dark' | 'warm' | 'cool'

interface ThemeOption {
  id: Theme
  name: string
  icon: string
  description: string
}

const themes: ThemeOption[] = [
  {
    id: 'light',
    name: '浅色',
    icon: '☀️',
    description: '简洁明亮的现代设计'
  },
  {
    id: 'dark',
    name: '深色',
    icon: '🌙',
    description: '护眼舒适的暗色主题'
  },
  {
    id: 'warm',
    name: '暖色',
    icon: '🔥',
    description: '温暖舒适的橘色调'
  },
  {
    id: 'cool',
    name: '冷色',
    icon: '❄️',
    description: '清爽自然的蓝绿调'
  }
]

interface ThemeSelectorProps {
  currentTheme: Theme
  onThemeChange: (theme: Theme) => void
}

export default function ThemeSelector({ currentTheme, onThemeChange }: ThemeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const currentThemeData = themes.find(theme => theme.id === currentTheme)

  return (
    <div className="theme-selector">
      <button 
        className="theme-selector-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="选择主题"
      >
        <span className="theme-icon">{currentThemeData?.icon}</span>
        <span className="theme-name">{currentThemeData?.name}</span>
        <span className={`theme-arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </button>
      
      {isOpen && (
        <div className="theme-dropdown">
          <div className="theme-dropdown-header">
            <span>选择主题</span>
          </div>
          <div className="theme-options">
            {themes.map((theme) => (
              <button
                key={theme.id}
                className={`theme-option ${currentTheme === theme.id ? 'active' : ''}`}
                onClick={() => {
                  onThemeChange(theme.id)
                  setIsOpen(false)
                }}
              >
                <span className="theme-option-icon">{theme.icon}</span>
                <div className="theme-option-content">
                  <span className="theme-option-name">{theme.name}</span>
                  <span className="theme-option-description">{theme.description}</span>
                </div>
                {currentTheme === theme.id && (
                  <span className="theme-option-check">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {isOpen && (
        <div 
          className="theme-selector-overlay"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}