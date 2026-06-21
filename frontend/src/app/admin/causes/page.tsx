"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useTreasury } from "@/lib/demoStore"
import type { CauseImage } from "@/lib/api"

const newImage = (): CauseImage => ({
  id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`,
  url: "",
  alt: "",
  caption: "",
})

export default function AdminCausesPage() {
  const { causes, updateCauseContent } = useTreasury()
  const [selectedId, setSelectedId] = useState(causes[0]?.id ?? "")
  const selectedCause = causes.find((cause) => cause.id === selectedId)

  const [description, setDescription] = useState("")
  const [story, setStory] = useState("")
  const [impact, setImpact] = useState("")
  const [images, setImages] = useState<CauseImage[]>([])

  useEffect(() => {
    if (!selectedId && causes[0]) setSelectedId(causes[0].id)
  }, [causes, selectedId])

  useEffect(() => {
    if (!selectedCause) return

    setDescription(selectedCause.description ?? "")
    setStory(selectedCause.story ?? "")
    setImpact(selectedCause.impact ?? "")
    setImages(selectedCause.images ?? [])
  }, [selectedCause])

  function updateImage(id: string, patch: Partial<CauseImage>) {
    setImages((current) =>
      current.map((image) => (image.id === id ? { ...image, ...patch } : image))
    )
  }

  function removeImage(id: string) {
    setImages((current) => current.filter((image) => image.id !== id))
  }

  function save() {
    if (!selectedCause) return

    updateCauseContent(selectedCause.id, {
      description,
      story,
      impact,
      images: images.filter((image) => image.url.trim()),
    })

    toast.success(`${selectedCause.name} page updated`)
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium text-primary">Admin</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">
          Cause pages
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Add donor-facing text and image URLs for each cause. These details
          appear on the public cause page.
        </p>
      </div>

      <Separator />

      <div className="grid gap-8 lg:grid-cols-[16rem_1fr]">
        <aside className="space-y-2">
          {causes.map((cause) => (
            <button
              key={cause.id}
              type="button"
              onClick={() => setSelectedId(cause.id)}
              className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                cause.id === selectedId
                  ? "border-primary bg-primary/10 text-foreground"
                  : "border-border bg-card text-muted-foreground hover:text-foreground"
              }`}
            >
              {cause.name}
            </button>
          ))}
        </aside>

        {selectedCause ? (
          <section className="space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">
                  {selectedCause.name}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Public URL:{" "}
                  <Link
                    href={`/causes/${selectedCause.id}`}
                    className="text-primary underline underline-offset-4"
                  >
                    /causes/{selectedCause.id}
                  </Link>
                </p>
              </div>

              <Link
                href={`/causes/${selectedCause.id}`}
                className="inline-flex h-8 items-center justify-center rounded-lg border border-border bg-background px-2.5 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground"
              >
                Preview
              </Link>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium">
                Short description
              </label>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={3}
                placeholder="One or two sentences that explain the appeal."
                className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium">Story</label>
              <textarea
                value={story}
                onChange={(event) => setStory(event.target.value)}
                rows={7}
                placeholder="Explain the need, what happened, and why the community should support it."
                className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium">Impact</label>
              <textarea
                value={impact}
                onChange={(event) => setImpact(event.target.value)}
                rows={5}
                placeholder="Explain what donations will fund and who benefits."
                className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-medium">Images</h3>
                  <p className="text-sm text-muted-foreground">
                    Add image URLs for the appeal. The first image becomes the
                    hero image.
                  </p>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setImages((current) => [...current, newImage()])}
                >
                  Add image
                </Button>
              </div>

              {images.length === 0 && (
                <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                  No images added yet.
                </div>
              )}

              {images.map((image, index) => (
                <div
                  key={image.id}
                  className="grid gap-4 rounded-xl border border-border bg-card p-4 md:grid-cols-[10rem_1fr]"
                >
                  <div className="overflow-hidden rounded-lg border border-border bg-muted">
                    {image.url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={image.url}
                        alt={image.alt || selectedCause.name}
                        className="h-32 w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-32 items-center justify-center text-xs text-muted-foreground">
                        Image preview
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">
                        Image {index + 1}
                        {index === 0 && (
                          <span className="ml-2 text-xs text-muted-foreground">
                            hero
                          </span>
                        )}
                      </p>

                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => removeImage(image.id)}
                      >
                        Remove
                      </Button>
                    </div>

                    <Input
                      value={image.url}
                      onChange={(event) =>
                        updateImage(image.id, { url: event.target.value })
                      }
                      placeholder="Image URL"
                    />

                    <Input
                      value={image.alt}
                      onChange={(event) =>
                        updateImage(image.id, { alt: event.target.value })
                      }
                      placeholder="Alt text"
                    />

                    <Input
                      value={image.caption ?? ""}
                      onChange={(event) =>
                        updateImage(image.id, { caption: event.target.value })
                      }
                      placeholder="Caption"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <Button type="button" onClick={save}>
                Save cause page
              </Button>
            </div>
          </section>
        ) : (
          <div className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            No causes available.
          </div>
        )}
      </div>
    </div>
  )
}
