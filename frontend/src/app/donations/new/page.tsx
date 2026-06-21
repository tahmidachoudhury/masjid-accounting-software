import { Separator } from "@/components/ui/separator"
import { DonationForm } from "@/components/DonationForm"
import { listCauses } from "@/lib/services.server"

export default function NewDonationPage() {
  const causes = listCauses()

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Record Donation
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Every donation needs a type. If you&apos;re unsure, record it as{" "}
          <strong>uncategorised</strong> and classify it later.
        </p>
      </div>

      <Separator />

      <DonationForm causes={causes} />
    </div>
  )
}
