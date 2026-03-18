import React, { useState } from 'react'
import { Search, Loader2 } from 'lucide-react'

interface SearchBarProps {
    onSearch: (name: string) => void
    isLoading: boolean
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading }) => {
    const [value, setValue] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (value.trim()) {
            onSearch(value.trim())
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="glass"
            style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0.5rem',
                borderRadius: '1.5rem',
                width: '100%',
                maxWidth: '600px',
                transition: 'all 0.3s ease',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)'
            }}
        >
            <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="輸入角色 ID..."
                style={{
                    flex: 1,
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: 'white',
                    padding: '0.75rem 1.25rem',
                    fontSize: '1.1rem',
                    fontFamily: 'inherit'
                }}
            />
            <button
                type="submit"
                disabled={isLoading}
                style={{
                    background: 'var(--maple-orange)',
                    border: 'none',
                    borderRadius: '1rem',
                    padding: '0.75rem 1.5rem',
                    color: 'white',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--maple-orange-hover)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'var(--maple-orange)'}
            >
                {isLoading ? (
                    <Loader2 className="animate-spin" size={20} />
                ) : (
                    <>
                        <Search size={20} />
                        <span>搜尋</span>
                    </>
                )}
            </button>
        </form>
    )
}

export default SearchBar
