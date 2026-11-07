'use client'
import { useEffect, useState } from 'react'

/** Existing images (keep / remove / main) + new uploads with live preview. */
export function ImagePicker({ existing }: { existing: string[] }) {
  const [previews, setPreviews] = useState<string[]>([])
  useEffect(() => () => previews.forEach(URL.revokeObjectURL), [previews])

  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="mb-2 text-[13px]">Зураг <span className="text-muted">— 8 хүртэл, нэг бүр 5MB-аас бага. Эхний зураг нь нүүр зураг болно.</span></legend>

      {existing.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {existing.map((src, i) => (
            <div key={src} className="flex flex-col gap-1.5 text-[12px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="w-full aspect-[3/4] object-cover border border-rule" />
              <label className="flex items-center gap-1.5"><input type="checkbox" name="keep_images" value={src} defaultChecked />Үлдээх</label>
              <label className="flex items-center gap-1.5"><input type="radio" name="main_image" value={src} defaultChecked={i === 0} />Нүүр зураг</label>
            </div>
          ))}
        </div>
      )}

      <label className="flex flex-col items-center justify-center gap-1 min-h-28 border border-dashed border-ink cursor-pointer text-[14px] hover:bg-paper-2">
        <span className="font-medium">+ Зураг сонгох</span>
        <span className="text-[12px] text-muted">JPG, PNG, WEBP · олныг зэрэг сонгож болно</span>
        <input
          type="file"
          name="images"
          accept="image/*"
          multiple
          className="sr-only"
          onChange={(e) => setPreviews(Array.from(e.target.files ?? []).map((f) => URL.createObjectURL(f)))}
        />
      </label>

      {previews.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {previews.map((src) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={src} src={src} alt="" className="w-full aspect-[3/4] object-cover border border-accent" />
          ))}
        </div>
      )}
    </fieldset>
  )
}
