import React from "react"
import Link from "next/link"

interface CardProps {
    title: string
    description: string
    icon?: React.ReactNode
    className?: string
    href?: string
}

const Card: React.FC<CardProps> = ({
   title,
   description,
   icon,
   className = "",
   href,
}) => {
    const cardContent = (
        <div
            className={`rounded-xl border p-5 shadow-sm hover:shadow-md transition cursor-pointer ${
                href ? "hover:ring-2 hover:ring-indigo-500" : ""
            } ${className}`}
        >
            <div className="flex items-center gap-3 mb-3">
                {icon && (
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg ">
                        {icon}
                    </div>
                )}
                <h3 className="text-lg font-semibold">{title}</h3>
            </div>

            <p className="text-sm leading-relaxed">{description}</p>
        </div>
    )
    if (href) {
        return (
            <Link href={href}>
                {cardContent}
            </Link>
        )
    }
    return cardContent
}

export default Card