import { Box } from "@radix-ui/themes"
import { ErrorText, Label } from "./Form"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { convertDateToTimeString } from "@/utils/dateConversions/utils"

interface DateTimePickerProps {
    value?: string
    onChange: (value: string) => void
    label?: string
    placeholder?: string
    error?: string
    required?: boolean
    minDate?: Date
    maxDate?: Date
    disabled?: boolean
    /** Inline calendar (for dialogs); avoids popovers clipped by modal overflow. */
    display?: 'field' | 'inline'
}

export const DateTimePicker = ({
    value,
    onChange,
    label,
    error,
    required = false,
    minDate = new Date(),
    maxDate,
    disabled = false,
    display = 'field',
}: DateTimePickerProps) => {
    const selectedDate = value ? new Date(value) : null

    const handleDateChange = (date: Date | null) => {
        if (date) {
            const formattedDate = convertDateToTimeString(date)
            onChange(formattedDate)
        } else {
            onChange("")
        }
    }

    const timeProps = {
        showTimeSelect: true as const,
        timeIntervals: 15,
        timeCaption: "Time",
        dateFormat: "MMM dd, yyyy h:mm aa",
        minDate,
        maxDate,
        disabled,
        dropdownMode: "select" as const,
        showMonthDropdown: true,
        showYearDropdown: true,
    }

    if (display === 'inline') {
        return (
            <Box>
                {label && <Label isRequired={required}>{label}</Label>}
                <Box className="raven-remind-datetime mx-auto w-fit max-w-full rounded-md border border-gray-6 bg-gray-2 p-2 dark:bg-gray-3">
                    <DatePicker
                        inline
                        selected={selectedDate}
                        onChange={handleDateChange}
                        {...timeProps}
                        calendarClassName="raven-inline-datepicker !border-0 !bg-transparent"
                        dayClassName={(date: Date) =>
                            selectedDate && date.toDateString() === selectedDate.toDateString()
                                ? 'raven-datepicker-day-selected'
                                : undefined
                        }
                    />
                </Box>
                {error && <ErrorText>{error}</ErrorText>}
            </Box>
        )
    }

    return (
        <Box>
            {label && <Label isRequired={required}>{label}</Label>}
            <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                {...timeProps}
                placeholderText="Select date and time"
                className="px-3 py-2.5 text-[13px] border border-gray-6 rounded-md bg-background text-foreground placeholder:text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-accent-a8 focus:border-transparent"
                wrapperClassName="w-full"
                popperClassName="!z-[9999]"
                popperProps={{ strategy: 'fixed' }}
                withPortal
                showPopperArrow={false}
                calendarClassName="!border-none !shadow-lg"
                dayClassName={(date: Date) =>
                    date && selectedDate && date.toDateString() === selectedDate.toDateString()
                        ? "!bg-[#5B5BD6] !text-white !rounded-full"
                        : "hover:!bg-[#5B5BD6]/10 !rounded-full"
                }
            />
            {error && <ErrorText>{error}</ErrorText>}
        </Box>
    )
}
