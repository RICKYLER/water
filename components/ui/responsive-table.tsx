"use client"

import React from "react"
import { cn } from "@/lib/utils"
import { Card } from "./card"

interface ResponsiveTableProps {
  data: any[]
  columns: {
    header: string
    accessor: string
    cell?: (item: any) => React.ReactNode
  }[]
  onRowClick?: (item: any) => void
  className?: string
}

export function ResponsiveTable({
  data,
  columns,
  onRowClick,
  className,
}: ResponsiveTableProps) {
  // Desktop view - traditional table
  const DesktopTable = () => (
    <div className="w-full overflow-auto hidden md:block">
      <table className={cn("w-full caption-bottom text-sm", className)}>
        <thead>
          <tr className="border-b">
            {columns.map((column, i) => (
              <th
                key={i}
                className="h-10 px-2 text-left align-middle font-medium text-muted-foreground"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, i) => (
            <tr
              key={i}
              className={cn(
                "border-b transition-colors hover:bg-muted/50",
                onRowClick && "cursor-pointer"
              )}
              onClick={() => onRowClick && onRowClick(item)}
            >
              {columns.map((column, j) => (
                <td key={j} className="p-2 align-middle">
                  {column.cell ? column.cell(item) : item[column.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  // Mobile view - card-based layout
  const MobileCards = () => (
    <div className="space-y-3 md:hidden">
      {data.map((item, i) => (
        <Card
          key={i}
          className={cn(
            "overflow-hidden",
            onRowClick && "cursor-pointer"
          )}
          onClick={() => onRowClick && onRowClick(item)}
        >
          <div className="p-3 space-y-2">
            {columns.map((column, j) => (
              <div key={j} className="flex justify-between items-start gap-2">
                <span className="text-xs font-medium text-muted-foreground">
                  {column.header}
                </span>
                <div className="text-sm text-right">
                  {column.cell ? column.cell(item) : item[column.accessor]}
                </div>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  )

  return (
    <>
      <DesktopTable />
      <MobileCards />
    </>
  )
}