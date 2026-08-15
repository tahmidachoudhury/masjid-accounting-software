import NoorSlides from "@/components/NoorSlides"

export default async function InfoPage({
  searchParams,
}: {
  searchParams: Promise<{ slide?: string }>
}) {
  const { slide } = await searchParams
  const requestedSlide = Number.parseInt(slide ?? "1", 10)
  const initialSlide = Number.isFinite(requestedSlide)
    ? Math.min(Math.max(requestedSlide - 1, 0), 15)
    : 0

  return (
    <div className="-mx-4 -my-6 h-[calc(100vh-3.5rem)] min-h-[640px] overflow-hidden sm:-mx-6 md:-mx-8 md:-my-8">
      <NoorSlides initialSlide={initialSlide} />
    </div>
  )
}
