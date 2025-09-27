"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

interface TermsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAccept: () => void
  orderTotal: number
}

export function TermsDialog({ open, onOpenChange, onAccept, orderTotal }: TermsDialogProps) {
  const [isAccepted, setIsAccepted] = useState(false)

  const handleAccept = () => {
    if (isAccepted) {
      onAccept()
      onOpenChange(false)
      setIsAccepted(false) // Reset for next time
    }
  }

  const handleCancel = () => {
    onOpenChange(false)
    setIsAccepted(false) // Reset checkbox
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Terms and Conditions</DialogTitle>
          <DialogDescription>
            Please read and accept our terms and conditions before placing your order.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[400px] w-full rounded-md border p-4">
          <div className="space-y-4 text-sm">
            <div>
              <h3 className="font-semibold text-base mb-2">1. Order and Delivery Terms</h3>
              <p className="text-muted-foreground leading-relaxed">
                By placing an order with our water refilling station, you agree to the following terms:
                All orders are subject to availability and confirmation. Delivery times are estimates and may vary due to weather conditions, traffic, or other unforeseen circumstances.
              </p>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold text-base mb-2">2. Payment and Pricing</h3>
              <p className="text-muted-foreground leading-relaxed">
                Payment is due upon delivery unless otherwise arranged. Prices are subject to change without notice.
                Additional charges may apply for deliveries outside our standard service area. 
                Your current order total is ₱{orderTotal.toFixed(2)}.
              </p>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold text-base mb-2">3. Water Quality and Safety</h3>
              <p className="text-muted-foreground leading-relaxed">
                Our water undergoes rigorous purification processes and meets all health and safety standards.
                We guarantee the quality of our water at the time of delivery. Containers should be properly cleaned and maintained by the customer.
              </p>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold text-base mb-2">4. Container Policy</h3>
              <p className="text-muted-foreground leading-relaxed">
                Water containers remain the property of the customer. We provide cleaning and maintenance services upon request.
                Damaged or lost containers may incur replacement charges. Please inspect containers upon delivery and report any issues immediately.
              </p>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold text-base mb-2">5. Cancellation and Refund Policy</h3>
              <p className="text-muted-foreground leading-relaxed">
                Orders can be cancelled up to 2 hours before the scheduled delivery time without penalty.
                Refunds for cancelled orders will be processed within 3-5 business days. 
                Emergency cancellations may be subject to a cancellation fee.
              </p>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold text-base mb-2">6. Liability and Responsibility</h3>
              <p className="text-muted-foreground leading-relaxed">
                Our liability is limited to the replacement of defective products. We are not responsible for any damages resulting from improper use or storage of our products.
                Customers are responsible for providing accurate delivery information and ensuring someone is available to receive the delivery.
              </p>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold text-base mb-2">7. Privacy and Data Protection</h3>
              <p className="text-muted-foreground leading-relaxed">
                We respect your privacy and will only use your personal information for order processing and delivery purposes.
                Your data will not be shared with third parties without your consent, except as required by law.
              </p>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold text-base mb-2">8. Contact and Support</h3>
              <p className="text-muted-foreground leading-relaxed">
                For any questions, concerns, or support needs, please contact our customer service team.
                We strive to resolve all issues promptly and to your satisfaction.
              </p>
            </div>
          </div>
        </ScrollArea>

        <div className="flex items-center space-x-2 mt-4">
          <Checkbox
            id="accept-terms"
            checked={isAccepted}
            onCheckedChange={(checked) => setIsAccepted(checked as boolean)}
          />
          <label
            htmlFor="accept-terms"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            I have read and agree to the terms and conditions
          </label>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button 
            onClick={handleAccept} 
            disabled={!isAccepted}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Accept and Place Order
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}