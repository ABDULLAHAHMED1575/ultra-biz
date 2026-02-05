type Option = {
    label: string
    value: string
}

interface DropdownProps {
    options: Option[]
    value: string
    onChange: (value: string) => void
    placeholder?: string
}

export default function Dropdown({
  options,
  value,
  onChange,
  placeholder = "Select option",
}: DropdownProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="
      bg-transparent
      outline-none
      border-none
      focus:ring-0
      focus:outline-none
      px-2
      py-1
      "
    >
      <option value="" disabled>
        {placeholder}
      </option>

      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  )
}