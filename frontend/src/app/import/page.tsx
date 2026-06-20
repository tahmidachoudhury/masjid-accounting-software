import { Separator } from "@/components/ui/separator"
import { ImportUpload } from "@/components/ImportUpload"

export default function ImportPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Import Bank Statement
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Upload a CSV export from your bank. Rows with a recognised{" "}
          <code className="text-xs bg-muted px-1 py-0.5 rounded font-mono">donation_type</code>{" "}
          are classified automatically. Everything else is flagged as{" "}
          <strong>uncategorised</strong> and excluded from balances until you review it.
        </p>
      </div>

      <Separator />

      <div className="rounded-lg border border-border bg-card p-4 text-sm">
        <p className="font-medium mb-2">Expected CSV format</p>
        <pre className="text-xs text-muted-foreground overflow-x-auto font-mono">
          date,reference,amount_gbp,donation_type{"\n"}
          2024-03-01,Monthly zakat,100.00,zakat{"\n"}
          2024-03-02,Anonymous transfer,75.00,{"\n"}
        </pre>
        <p className="mt-2 text-xs text-muted-foreground">
          Valid types: zakat, sadaqah, lillah, zakat_al_fitr, fidya, kaffarah, waqf, general.
          Blank or unrecognised type → uncategorised.
        </p>
      </div>

      <ImportUpload />
    </div>
  )
}
