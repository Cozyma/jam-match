"use client"

import * as React from "react"
import { Music2 } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface SongRegisterSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  songTitle: string
  songKey: string
  hasVocal?: boolean
  defaultPart?: string
  onRegister?: (data: { part: string; sub_parts: string[]; vocal: string; preferred_keys: string[]; proficiency: string }) => void
  initialValues?: { part: string; sub_parts: string[]; vocal: string; preferred_keys: string[]; proficiency: string }
  mode?: "register" | "edit"
}

const instruments = [
  { value: "guitar", label: "Guitar", icon: "🎸" },
  { value: "banjo", label: "Banjo", icon: "🪕" },
  { value: "mandolin", label: "Mandolin", icon: "🎸" },
  { value: "fiddle", label: "Fiddle", icon: "🎻" },
  { value: "bass", label: "Bass", icon: "🎸" },
  { value: "dobro", label: "Dobro", icon: "🎸" },
  { value: "other", label: "Other", icon: "🎵" },
]

const vocalOptions = [
  { value: "lead", label: "Lead" },
  { value: "harmony_high", label: "Harmony (High)" },
  { value: "harmony_low", label: "Harmony (Low)" },
  { value: "none", label: "なし" },
]

const keys = ["C", "D", "E", "F", "G", "A", "B♭", "B"]

const proficiencyOptions = [
  {
    value: "ready",
    label: "いつでもOK",
    icon: "◎",
    dotColor: "bg-emerald-500",
    description: "いつでも演奏できます",
  },
  {
    value: "with_practice",
    label: "たぶん弾ける",
    icon: "○",
    dotColor: "bg-amber-500",
    description: "曲は知ってる、多少あやしい部分あり",
  },
  {
    value: "learning",
    label: "挑戦中",
    icon: "△",
    dotColor: "bg-stone-400",
    description: "弾いたことはあるが通しは厳しい",
  },
]

export function SongRegisterSheet({
  open,
  onOpenChange,
  songTitle,
  songKey,
  hasVocal = true,
  defaultPart,
  onRegister,
  initialValues,
  mode = "register",
}: SongRegisterSheetProps) {
  const [selectedInstrument, setSelectedInstrument] = React.useState<string>(initialValues?.part || "")
  const [selectedSubParts, setSelectedSubParts] = React.useState<string[]>(initialValues?.sub_parts || [])
  const [selectedVocal, setSelectedVocal] = React.useState<string>(initialValues?.vocal || "none")
  const [selectedKeys, setSelectedKeys] = React.useState<string[]>(initialValues?.preferred_keys || [])
  const [selectedProficiency, setSelectedProficiency] = React.useState<string>(initialValues?.proficiency || "")

  React.useEffect(() => {
    if (open && initialValues) {
      setSelectedInstrument(initialValues.part)
      setSelectedSubParts(initialValues.sub_parts)
      setSelectedVocal(initialValues.vocal)
      setSelectedKeys(initialValues.preferred_keys)
      setSelectedProficiency(initialValues.proficiency)
    } else if (open && !initialValues) {
      setSelectedInstrument(defaultPart || "")
      setSelectedSubParts([])
      setSelectedVocal("none")
      setSelectedKeys([])
      setSelectedProficiency("")
    }
  }, [open, initialValues])

  const toggleSubPart = (value: string) => {
    setSelectedSubParts(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    )
  }

  const handleRegister = () => {
    if (onRegister) {
      onRegister({
        part: selectedInstrument,
        sub_parts: selectedSubParts,
        vocal: hasVocal ? selectedVocal : "none",
        preferred_keys: hasVocal ? selectedKeys : [],
        proficiency: selectedProficiency,
      })
    }
    onOpenChange(false)
  }

  const toggleKey = (key: string) => {
    setSelectedKeys(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    )
  }

  const isValid = selectedInstrument && selectedProficiency

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[85vh] overflow-y-auto rounded-t-2xl" aria-describedby={undefined}>
        <SheetHeader className="border-b border-stone-200 pb-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-lg">{mode === "edit" ? "レパートリーを編集" : "レパートリーに追加"}</SheetTitle>
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2">
              <Music2 className="h-5 w-5 text-amber-700" />
              <span className="font-medium text-foreground">{songTitle}</span>
            </div>
            <Badge variant="secondary" className="bg-amber-100 text-amber-800 border-0">
              Key: {songKey}
            </Badge>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
          {/* Part Selection (1タップ=メイン, 2タップ=サブトグル) */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">
              パート <span className="text-red-500">*</span>
              {selectedInstrument && (
                <span className="ml-2 font-normal text-xs text-muted-foreground">他をタップでサブ追加</span>
              )}
            </Label>
            <div className="grid grid-cols-4 gap-1.5">
              {instruments.map((instrument) => {
                const isMain = selectedInstrument === instrument.value
                const isSub = selectedSubParts.includes(instrument.value)
                return (
                  <button
                    key={instrument.value}
                    type="button"
                    onClick={() => {
                      if (!selectedInstrument || isMain) {
                        // メイン未選択 or メインを再タップ → メインに設定
                        setSelectedInstrument(instrument.value)
                        setSelectedSubParts(prev => prev.filter(p => p !== instrument.value))
                      } else {
                        // メイン選択済み + 別の楽器 → サブをトグル
                        toggleSubPart(instrument.value)
                      }
                    }}
                    className={cn(
                      "flex flex-col items-center justify-center p-2 rounded-lg border transition-all",
                      isMain
                        ? "border-amber-700 bg-amber-50 text-amber-900"
                        : isSub
                          ? "border-stone-500 bg-stone-50 text-stone-700"
                          : "border-stone-200 bg-white text-stone-400 hover:border-stone-300"
                    )}
                  >
                    <span className="text-lg">{instrument.icon}</span>
                    <span className="text-[10px] text-center leading-tight">{instrument.label}</span>
                    {isMain && <span className="text-[9px] text-amber-600 font-medium">MAIN</span>}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Vocal Selection (歌あり曲のみ) */}
          {hasVocal && <div className="space-y-3">
            <Label className="text-sm font-medium text-foreground">ボーカル</Label>
            <RadioGroup
              value={selectedVocal}
              onValueChange={setSelectedVocal}
              className="grid grid-cols-2 gap-2"
            >
              {vocalOptions.map((option) => (
                <Label
                  key={option.value}
                  className={cn(
                    "flex items-center justify-center p-3 rounded-lg border cursor-pointer transition-all",
                    selectedVocal === option.value
                      ? "border-amber-700 bg-amber-50 text-amber-900"
                      : "border-stone-200 bg-white hover:border-stone-300"
                  )}
                >
                  <RadioGroupItem
                    value={option.value}
                    className="sr-only"
                  />
                  <span className="text-sm">{option.label}</span>
                </Label>
              ))}
            </RadioGroup>
          </div>}

          {/* Preferred Keys (歌あり曲のみ) */}
          {hasVocal && <div className="space-y-3">
            <Label className="text-sm font-medium text-foreground">得意キー</Label>
            <div className="flex flex-wrap gap-2">
              {keys.map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => toggleKey(key)}
                  className={cn(
                    "px-4 py-2 rounded-full border text-sm font-medium transition-all",
                    selectedKeys.includes(key)
                      ? "bg-amber-700 text-white border-amber-700"
                      : "bg-white text-stone-700 border-stone-200 hover:border-stone-300"
                  )}
                >
                  {key}
                </button>
              ))}
            </div>
          </div>}

          {/* Proficiency Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-foreground">
              習熟度 <span className="text-red-500">*</span>
            </Label>
            <RadioGroup
              value={selectedProficiency}
              onValueChange={setSelectedProficiency}
              className="space-y-2"
            >
              {proficiencyOptions.map((option) => (
                <Label
                  key={option.value}
                  className={cn(
                    "flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all",
                    selectedProficiency === option.value
                      ? "border-amber-700 bg-amber-50"
                      : "border-stone-200 bg-white hover:border-stone-300"
                  )}
                >
                  <RadioGroupItem
                    value={option.value}
                    className="sr-only"
                  />
                  <span className={cn("w-3 h-3 rounded-full", option.dotColor)} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{option.icon}</span>
                      <span className="font-medium text-foreground">{option.label}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {option.description}
                    </p>
                  </div>
                </Label>
              ))}
            </RadioGroup>
          </div>
        </div>

        <SheetFooter className="border-t border-stone-200 pt-4">
          <Button
            onClick={handleRegister}
            disabled={!isValid}
            className="w-full bg-amber-700 hover:bg-amber-800 text-white disabled:bg-stone-300 disabled:text-stone-500"
          >
            {mode === "edit" ? "更新する" : "登録する"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
