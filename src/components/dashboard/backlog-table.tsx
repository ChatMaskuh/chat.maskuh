import type { BacklogItem } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const backlogData: BacklogItem[] = [
  { storeName: "GadgetGrove", paymentOrder: 189, marketplace: "Shopify" },
  { storeName: "FashionFiesta", paymentOrder: 250, marketplace: "Amazon" },
  { storeName: "HomeHaven", paymentOrder: 120, marketplace: "Etsy" },
  { storeName: "BookNook", paymentOrder: 78, marketplace: "Shopify" },
  { storeName: "ToyTrove", paymentOrder: 310, marketplace: "Amazon" },
];

export function BacklogTable() {
  return (
    <Card className="col-span-1 lg:col-span-3">
      <CardHeader>
        <CardTitle>Order Backlog</CardTitle>
        <CardDescription>A list of current pending orders.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Store Name</TableHead>
              <TableHead>Marketplace</TableHead>
              <TableHead className="text-right">Payment Order</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {backlogData.map((item) => (
              <TableRow key={item.storeName}>
                <TableCell className="font-medium">{item.storeName}</TableCell>
                <TableCell>
                  <Badge variant="outline">{item.marketplace}</Badge>
                </TableCell>
                <TableCell className="text-right">${item.paymentOrder.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
