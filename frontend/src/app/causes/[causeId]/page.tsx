"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { PublicDonateForm } from "@/components/PublicDonateForm"
import { useTreasury } from "@/lib/demoStore"
import { formatPence } from "@/lib/currency"
import { FUND_CONFIG } from "@/lib/fundConfig"

export default function CausePage() {
  const params = useParams<{ causeId: string }>()
  const causeId = params.causeId
  const { causes, donations } = useTreasury()

  const cause = causes.find((item) => item.id === causeId)

  if (!cause) {
    return (
      <div className="rounded-xl border border-border bg-card p-8">
        <h1 className="text-2xl font-semibold">Cause not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This cause may have been removed or renamed.
        </p>
          <Link
            href="/donate"
            className="mt-5 inline-flex h-8 items-center justify-center rounded-lg bg-primary px-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
          >
            View all causes
          </Link>
      </div>
    )
  }

  const raisedPence = donations
    .filter((donation) => donation.causeId === cause.id)
    .reduce((total, donation) => total + donation.amountPence, 0)

  const percentage = cause.targetPence
    ? (raisedPence / cause.targetPence) * 100
    : null

  const mainImage = cause.images?.[0]

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        {mainImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={mainImage.url}
            alt={mainImage.alt || cause.name}
            className="h-72 w-full object-cover"
          />
        ) : (
          <div className="flex h-56 items-center justify-center bg-muted/40">
            <span className="text-sm text-muted-foreground">
              {cause.name}
            </span>
          </div>
        )}

        <div className="grid gap-8 p-6 lg:grid-cols-[1fr_22rem] lg:p-8">
          <div>
            <Link
              href="/donate"
              className="text-sm font-medium text-primary underline underline-offset-4"
            >
              ← All causes
            </Link>

            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-foreground">
              {cause.name}
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
              {cause.description ||
                "Support this masjid cause and help us deliver direct community benefit."}
            </p>

            {cause.allowedTypes.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {cause.allowedTypes.map((type) => (
                  <span
                    key={type}
                    className="rounded-full border px-3 py-1 text-xs font-medium"
                    style={{
                      borderColor: FUND_CONFIG[type].color,
                      color: FUND_CONFIG[type].color,
                      backgroundColor: FUND_CONFIG[type].bg,
                    }}
                  >
                    {FUND_CONFIG[type].label}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-8 max-w-xl">
              <div className="flex items-baseline justify-between">
                <p className="font-medium text-foreground">
                  {formatPence(raisedPence)} raised
                </p>
                {cause.targetPence !== null && (
                  <p className="text-sm text-muted-foreground">
                    of {formatPence(cause.targetPence)}
                  </p>
                )}
              </div>

              {cause.targetPence !== null && (
                <>
                  <Progress
                    value={Math.min(percentage ?? 0, 100)}
                    className="mt-3 h-2"
                  />
                  <p className="mt-2 text-xs text-muted-foreground">
                    {(percentage ?? 0).toFixed(1)}% funded
                  </p>
                </>
              )}
            </div>
          </div>

          <aside className="rounded-xl border border-border bg-background p-5 shadow-sm">
            <h2 className="text-lg font-semibold">Donate to this cause</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Your donation will be recorded against {cause.name}.
            </p>

            <div className="mt-5">
              <PublicDonateForm
                causes={causes}
                initialCauseId={cause.id}
                lockCause
                submitLabel={`Donate to ${cause.name}`}
              />
            </div>
          </aside>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-xl font-semibold">The story</h2>
          <p className="mt-3 whitespace-pre-line text-sm leading-7 text-muted-foreground">
            {cause.story || "The masjid team has not added a story yet."}
          </p>
        </article>

        <article className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-xl font-semibold">Your impact</h2>
          <p className="mt-3 whitespace-pre-line text-sm leading-7 text-muted-foreground">
            {cause.impact ||
              "Your donation helps the masjid serve the community with transparency and care."}
          </p>
        </article>
      </section>

      {cause.images && cause.images.length > 1 && (
        <section>
          <h2 className="text-xl font-semibold">Updates and images</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cause.images.slice(1).map((image) => (
              <figure
                key={image.id}
                className="overflow-hidden rounded-xl border border-border bg-card"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.url}
                  alt={image.alt || cause.name}
                  className="h-48 w-full object-cover"
                />
                {(image.caption || image.alt) && (
                  <figcaption className="p-3 text-sm text-muted-foreground">
                    {image.caption || image.alt}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
