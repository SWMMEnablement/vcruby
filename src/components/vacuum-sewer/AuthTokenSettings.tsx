import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getAuthToken, setAuthToken } from "@/lib/authToken";
import { Shield, Check } from "lucide-react";

export function AuthTokenSettings() {
  const [token, setToken] = useState(getAuthToken());
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setAuthToken(token);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Security Settings
        </CardTitle>
        <CardDescription>
          Configure authentication token for edge function access
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertDescription>
            <strong>Important:</strong> This token must match the APP_AUTH_TOKEN secret configured in your backend.
            Contact your administrator for the correct token value.
          </AlertDescription>
        </Alert>
        
        <div className="space-y-2">
          <Label htmlFor="auth-token">Authentication Token</Label>
          <Input
            id="auth-token"
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Enter authentication token"
          />
        </div>

        <Button onClick={handleSave} className="w-full">
          {saved ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              Saved Successfully
            </>
          ) : (
            "Save Token"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
