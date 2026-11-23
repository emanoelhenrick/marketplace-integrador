import { MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPhone, formatZipCode } from "@/lib/text";
import type { ShippingAddress } from "@/types/order";

export function ShippingAddressCard({ address }: { address?: ShippingAddress }) {
  if (!address) return null;
  const line = [address.street, address.number].filter(Boolean).join(", ");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-brand-strong" aria-hidden /> Entrega
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm space-y-0.5">
        <p className="font-semibold">{address.recipientName}</p>
        <p>
          {line}
          {address.complement ? ` · ${address.complement}` : ""}
        </p>
        <p>
          {address.neighborhood} · {address.city}/{address.state} · CEP {formatZipCode(address.zipCode)}
        </p>
        <p className="text-muted-foreground">{formatPhone(address.phone)}</p>
      </CardContent>
    </Card>
  );
}
