import type { Meta, StoryObj } from "@storybook/nextjs"
import { PartIcon, partConfig } from "@/components/icons/part-icon"

const parts = Object.keys(partConfig)
const sizes = ["sm", "md", "lg"] as const

function PartIconGrid() {
  return (
    <div className="p-6 bg-white">
      <table className="border-collapse">
        <thead>
          <tr>
            <th className="p-3 border-b-2 border-stone-200 text-left text-sm text-stone-500">Part</th>
            {sizes.map((s) => (
              <th key={s} className="p-3 border-b-2 border-stone-200 text-center text-sm text-stone-500">{s}</th>
            ))}
            <th className="p-3 border-b-2 border-stone-200 text-left text-sm text-stone-500">Inline example</th>
          </tr>
        </thead>
        <tbody>
          {parts.map((part) => (
            <tr key={part} className="border-b border-stone-100">
              <td className="p-3 text-sm font-medium text-stone-800">{part}</td>
              {sizes.map((s) => (
                <td key={s} className="p-3 text-center">
                  <PartIcon part={part} size={s} />
                </td>
              ))}
              <td className="p-3 text-sm text-stone-700">
                <span className="inline-flex items-center gap-1.5">
                  <PartIcon part={part} size="sm" />
                  <span>{part}</span>
                  {part !== "other" && (
                    <>
                      <span className="text-stone-300">+</span>
                      <PartIcon part="other" size="sm" />
                    </>
                  )}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const meta: Meta = {
  title: "Components/InstrumentIcons",
  component: PartIconGrid,
}
export default meta

type Story = StoryObj
export const AllSizes: Story = {}
