import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Lock, Key, Trash2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FeatureLock } from "@/components/feature-lock";

export default function VaultPage() {
  const isPro = false; // This would be dynamic based on user auth

  return (
    <div className="space-y-8 max-w-4xl mx-auto relative">
      {!isPro && <FeatureLock />}
      <header className="text-center">
        <div className="inline-block bg-primary/10 p-4 rounded-full">
          <ShieldCheck className="w-16 h-16 text-primary" />
        </div>
        <h2 className="text-4xl font-headline font-bold mt-4">Your Data Vault</h2>
        <p className="text-muted-foreground text-lg mt-2">
          Manage your encrypted data with confidence and control.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Security Overview</CardTitle>
          <CardDescription>
            Your data is protected with industry-leading security measures.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-6">
          <div className="flex items-start space-x-4">
            <Lock className="w-8 h-8 text-accent flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold">End-to-End Encryption</h3>
              <p className="text-sm text-muted-foreground">
                Your entries are encrypted at rest and in transit. Only you can access your complete data.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <Key className="w-8 h-8 text-accent flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold">Anonymized AI Processing</h3>
              <p className="text-sm text-muted-foreground">
                Data sent for AI analysis is anonymized to protect your identity and personal information.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <ShieldCheck className="w-8 h-8 text-accent flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold">You Are in Control</h3>
              <p className="text-sm text-muted-foreground">
                You have the power to view, manage, and permanently delete your data at any time.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
          <CardDescription>
            Tools to manage your personal information.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           <Alert variant="destructive">
            <Trash2 className="h-4 w-4" />
            <AlertTitle>Danger Zone</AlertTitle>
            <AlertDescription className="flex items-center justify-between">
                <span>Permanently delete all your data. This action cannot be undone.</span>
                <Button variant="destructive">Delete All Data</Button>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
