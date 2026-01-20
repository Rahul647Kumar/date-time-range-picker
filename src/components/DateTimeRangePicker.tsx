import { useMemo, useRef, useState } from 'react'

type DateTimeRangePickerProps = {
  initialStart?: string
  initialEnd?: string
  initialTimezone?: string
}

export function DateTimeRangePicker({
  initialStart = '',
  initialEnd = '',
  initialTimezone = 'UTC',
}: DateTimeRangePickerProps) {
  
  const [startValue, setStartValue] = useState(initialStart)
  const [endValue, setEndValue] = useState(initialEnd)
  const [timezone, setTimezone] = useState(initialTimezone)

  // Convert to Date, when both are present.
  const startDate = useMemo(() => (startValue ? new Date(startValue) : null), [startValue])
  const endDate = useMemo(() => (endValue ? new Date(endValue) : null), [endValue])
  
  const endInputRef = useRef<HTMLInputElement | null>(null)
  const timezones = ['UTC', 'Asia/Kolkata', 'America/New_york', 'Eurupe/London']

  // Basic validation.
  const errorMessage = useMemo(() => {
    if (!startDate || !endDate) return null
    if (endDate.getTime() < startDate.getTime()) {
      return 'End must be after Start.'
    }
    return null
  }, [startDate, endDate])

  // Helpers for constraints
const now = new Date()

// Min = start of today (00:00) in local time
const minDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)

// Max = 30 days from minDate (end of day)
const maxDate = new Date(minDate)
maxDate.setDate(maxDate.getDate() + 30)
maxDate.setHours(23, 59, 59, 999)

const constraintError = useMemo(() => {
  // If user hasn’t selected, don’t show constraint errors
  if (!startDate && !endDate) return null

  if (startDate && startDate.getTime() < minDate.getTime()) {
    return 'Start cannot be in the past.'
  }
  if (endDate && endDate.getTime() < minDate.getTime()) {
    return 'End cannot be in the past.'
  }
  if (startDate && startDate.getTime() > maxDate.getTime()) {
    return 'Start is too far in the future (max 30 days).'
  }
  if (endDate && endDate.getTime() > maxDate.getTime()) {
    return 'End is too far in the future (max 30 days).'
  }

  return null
}, [startDate, endDate, minDate, maxDate])

const rangeHelpId = 'range-help'
const errorId = 'range-error'

const combinedError = errorMessage ?? constraintError

function toDateTimeLocalValue(date: Date) {
  const pad = (n: number) => String(n).padStart(2, '0')
  const yyyy = date.getFullYear()
  const mm = pad(date.getMonth() + 1)
  const dd = pad(date.getDate())
  const hh = pad(date.getHours())
  const min = pad(date.getMinutes())
  return `${yyyy}-${mm}-${dd}T${hh}:${min}`
}

const applyTodayPreset = () => {
  const start = new Date()
  start.setHours(0, 0, 0, 0)

  const end = new Date()
  end.setHours(23, 59, 0, 0)

  setStartValue(toDateTimeLocalValue(start))
  setEndValue(toDateTimeLocalValue(end))
}

const applyLast7DaysPreset = () => {
  const end = new Date()
  end.setHours(23, 59, 0, 0)

  const start = new Date(end)
  start.setDate(start.getDate() - 6) // last 7 days includes today
  start.setHours(0, 0, 0, 0)

  setStartValue(toDateTimeLocalValue(start))
  setEndValue(toDateTimeLocalValue(end))
}

const clearPreset = () => {
  setStartValue('')
  setEndValue('')
}

const formatInTimeZone = (value: string, tz: string) => {
  if (!value) return '—'
  const d = new Date(value)

  return new Intl.DateTimeFormat('en-GB', {
    timeZone: tz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(d)
}

  return (
    <div className="p-4 border rounded-md w-[360px] space-y-4">
      <h2 className="text-lg font-semibold">Date Time Range Picker</h2>

      <div className="space-y-1">
        <label className="block text-sm font-medium" htmlFor="tz">
            Timezone
            </label>
            <select
            id="tz"
            value={timezone}
                        onChange={(e) => setTimezone(e.target.value)}
                        className="w-full border rounded px-2 py-1 bg-white"
                        >
                            {timezones.map((tz) => (
                            <option key={tz} value={tz}>
                        {tz}
                    </option>
                ))}
            </select>
        </div>

      <p id={rangeHelpId} className="text-xs text-gray-500">
        Allowed range: today to next 30 days.
      </p>

      <div className="flex gap-2">
        <button
        type="button"
        onClick={applyTodayPreset}
        className="border rounded px-2 py-1 text-sm hover:bg-gray-50"
        >
            Today
     </button>
     
      <button
      type="button"
      onClick={applyLast7DaysPreset}
      className="border rounded px-2 py-1 text-sm hover:bg-gray-50"
      >
        Last 7 Days
      </button>
      
      <button
      type="button"
      onClick={clearPreset}
      className="border rounded px-2 py-1 text-sm hover:bg-gray-50"
      >
        Clear
      </button>
      
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium" htmlFor="start-dt">
          Start Date & Time
        </label>
        <input
          id="start-dt"
          type="datetime-local"
          value={startValue}
          aria-describedby={rangeHelpId}
          aria-invalid={Boolean(combinedError)}
          aria-errormessage={combinedError ? errorId : undefined}
          onChange={(e) => setStartValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
                endInputRef.current?.focus()
            }
          }}
          className="w-full border rounded px-2 py-1"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium" htmlFor="end-dt">
          End Date & Time
        </label>
        <input
          ref={endInputRef}
          id="end-dt"
          type="datetime-local"
          value={endValue}
          aria-describedby={rangeHelpId}
          aria-invalid={Boolean(combinedError)}
          aria-errormessage={combinedError ? errorId : undefined}
          onChange={(e) => setEndValue(e.target.value)}
          className="w-full border rounded px-2 py-1"
        />
      </div>

      {/* Both error block in one block*/}
      {combinedError ? (
        <div id={errorId} role="alert" className="text-sm font-medium text-red-600">
      {combinedError}
      </div>
    ) : null}

      {/* Debug/Preview: shows what user picked (helps you + reviewers) */}
      <div className="text-xs text-gray-600 space-y-1">
        <div>
          <span className="font-semibold">Start:</span> {startValue || '—'}
        </div>
        <div>
          <span className="font-semibold">End:</span> {endValue || '—'}
        </div>
        <div>
          <span className="font-semibold">Timezone:</span> {timezone}
        </div>
        <div>
          <span className="font-semibold">Start (formatted in TZ):</span>{' '}
          {formatInTimeZone(startValue, timezone)}
        </div>
        
        <div>
          <span className="font-semibold">End (formatted in TZ):</span>{' '}
          {formatInTimeZone(endValue, timezone)}
        </div>
      </div>
    </div>
  )
}