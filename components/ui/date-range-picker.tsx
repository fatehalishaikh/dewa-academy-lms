'use client'
import * as React from 'react'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import type { DateRange } from 'react-day-picker'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

interface DateRangePickerProps {
  value: DateRange
  onChange: (range: DateRange) => void
  className?: string
}

export function DateRangePicker({ value, onChange, className }: DateRangePickerProps) {
  const label = value.from
    ? value.to
      ? `${format(value.from, 'MMM d')} – ${format(value.to, 'MMM d, yyyy')}`
      : format(value.from, 'MMM d, yyyy')
    : 'Select date range'

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            className={cn('justify-start text-left font-normal bg-muted/30 border-border h-9 text-sm w-full', className)}
          >
            <CalendarIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
            <span>{label}</span>
          </Button>
        }
      />
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          selected={value}
          onSelect={(range) => range && onChange(range)}
          numberOfMonths={2}
          disabled={{ after: new Date() }}
        />
      </PopoverContent>
    </Popover>
  )
}
