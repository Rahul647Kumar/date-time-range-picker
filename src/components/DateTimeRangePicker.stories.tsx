import type { Meta, StoryObj } from '@storybook/react'
import { DateTimeRangePicker } from './DateTimeRangePicker'

const meta: Meta<typeof DateTimeRangePicker> = {
  title: 'Components/DateTimeRangePicker',
  component: DateTimeRangePicker,
}

export default meta
type Story = StoryObj<typeof DateTimeRangePicker>

export const Default: Story = {
  args: {
    initialTimezone: 'UTC',
  },
}

// DST time jumps from 02:00 to 03:00
export const NewYork_SpringForward: Story = {
  args: {
    initialTimezone: 'America/New_York',
    initialStart: '2026-03-08T01:30',
    initialEnd: '2026-03-08T03:30',
  },
}

// DST 01:00 hour happens twice
export const NewYork_FallBack: Story = {
  args: {
    initialTimezone: 'America/New_York',
    initialStart: '2026-11-01T01:30',
    initialEnd: '2026-11-01T02:30',
  },
}

export const Kolkata_Example: Story = {
  args: {
    initialTimezone: 'Asia/Kolkata',
    initialStart: '2026-01-20T10:00',
    initialEnd: '2026-01-20T12:00',
  },
}