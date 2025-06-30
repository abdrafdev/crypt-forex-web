import React from 'react'

interface PageHeaderProps {
    title: string
    subtitle: string
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle }) => {
    return (
        <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
            <p className="text-gray-600">{subtitle}</p>
        </div>
    )
}