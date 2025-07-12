'use client'

import React, { useState, useEffect } from 'react'
import './ThemeSelector.scss'

export type Theme = 'cyberpunk' | 'gothic' | 'mediterranean' | 'zen' | 'miyazaki' | 'starry'

interface ThemeOption {
  id: Theme
  name: string
  icon: string
  description: string
}

const themes: ThemeOption[] = [
  {
    id: 'cyberpunk',
    name: '赛博朋克',
    icon: '🌐',
    description: '未来科技感的霓虹世界'
  },
  {
    id: 'gothic',
    name: '哥特风格',
    icon: '🏰',
    description: '神秘优雅的黑暗美学'
  },
  {
    id: 'mediterranean',
    name: '地中海田园',
    icon: '🌊',
    description: '温暖惬意的自然风光'
  },
  {
    id: 'zen',
    name: '极简禅意',
    icon: '🧘',
    description: '宁静致远的简约美学'
  },
  {
    id: 'miyazaki',
    name: '宫崎骏',
    icon: '🌸',
    description: '童话般的梦幻世界'
  },
  {
    id: 'starry',
    name: '星空',
    icon: '🌌',
    description: '浩瀚宇宙的深邃美丽'
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