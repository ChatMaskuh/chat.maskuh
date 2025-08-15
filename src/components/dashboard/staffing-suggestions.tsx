"use client";

import { useFormState, useFormStatus } from 'react-dom';
import { Lightbulb, LoaderCircle, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { getStaffingSuggestionsAction } from '@/app/actions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <>
          <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Lightbulb className="mr-2 h-4 w-4" />
          Get Suggestions
        </>
      )}
    </Button>
  );
}

export function StaffingSuggestions() {
  const initialState = { suggestions: null, error: null };
  const [state, formAction] = useFormState(getStaffingSuggestionsAction, initialState);

  return (
    <Card className="col-span-1 lg:col-span-3">
      <CardHeader>
        <CardTitle>Actionable Staffing Suggestions</CardTitle>
        <CardDescription>
          Use AI to analyze performance and get staffing recommendations.
        </CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="totalPickOrders">Total Pick Orders</Label>
            <Input id="totalPickOrders" name="totalPickOrders" type="number" defaultValue="5423" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="packedOrders">Packed Orders</Label>
            <Input id="packedOrders" name="packedOrders" type="number" defaultValue="3423" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="shippedOrders">Shipped Orders</Label>
            <Input id="shippedOrders" name="shippedOrders" type="number" defaultValue="3100" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="paymentAccepted">Payment Accepted</Label>
            <Input id="paymentAccepted" name="paymentAccepted" type="number" defaultValue="5600" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="inProgressOrders">In-Progress Orders</Label>
            <Input id="inProgressOrders" name="inProgressOrders" type="number" defaultValue="2000" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="numPickers">Pickers on Staff</Label>
            <Input id="numPickers" name="numPickers" type="number" defaultValue="12" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="numPackers">Packers on Staff</Label>
            <Input id="numPackers" name="numPackers" type="number" defaultValue="8" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="numDispatchers">Dispatchers on Staff</Label>
            <Input id="numDispatchers" name="numDispatchers" type="number" defaultValue="5" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pickingGoal">Picking Goal</Label>
            <Input id="pickingGoal" name="pickingGoal" type="number" defaultValue="5500" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="packingGoal">Packing Goal</Label>
            <Input id="packingGoal" name="packingGoal" type="number" defaultValue="5500" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dispatchingGoal">Dispatching Goal</Label>
            <Input id="dispatchingGoal" name="dispatchingGoal" type="number" defaultValue="5500" />
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <SubmitButton />
        </CardFooter>
      </form>
      {state.suggestions && (
        <CardContent>
          <Alert>
            <Lightbulb className="h-4 w-4 text-primary" />
            <AlertTitle>AI Suggestions</AlertTitle>
            <AlertDescription className="whitespace-pre-wrap">
              {state.suggestions}
            </AlertDescription>
          </Alert>
        </CardContent>
      )}
       {state.error && (
        <CardContent>
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {state.error}
            </AlertDescription>
          </Alert>
        </CardContent>
      )}
    </Card>
  );
}
