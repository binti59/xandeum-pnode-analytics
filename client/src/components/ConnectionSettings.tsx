import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";

interface ConnectionSettingsProps {
  currentEndpoint: string;
  currentStatsEndpoint?: string;
  useCustomStats: boolean;
  onSave: (endpoint: string, statsEndpoint?: string, useCustomStats?: boolean) => void;
}

export function ConnectionSettings({ 
  currentEndpoint, 
  currentStatsEndpoint,
  useCustomStats,
  onSave 
}: ConnectionSettingsProps) {
  const [endpoint, setEndpoint] = useState(currentEndpoint);
  const [statsEndpoint, setStatsEndpoint] = useState(currentStatsEndpoint || "");
  const [customStats, setCustomStats] = useState(useCustomStats);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setEndpoint(currentEndpoint);
    setStatsEndpoint(currentStatsEndpoint || "");
    setCustomStats(useCustomStats);
  }, [currentEndpoint, currentStatsEndpoint, useCustomStats]);

  const handleSave = () => {
    onSave(endpoint, statsEndpoint, customStats);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" title="Connection Settings">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px] border-2 border-foreground shadow-none rounded-none">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold tracking-tight uppercase">Connection Settings</DialogTitle>
          <DialogDescription>
            Configure the Xandeum pNode RPC endpoints.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="endpoint" className="font-bold">Discovery Endpoint (get-pods)</Label>
            <Input
              id="endpoint"
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
              placeholder="http://192.190.136.36:6000/rpc"
              className="font-mono text-sm border-2 border-foreground rounded-none focus-visible:ring-0 focus-visible:border-primary"
            />
            <p className="text-xs text-muted-foreground">
              Public node for discovering all pNodes in the network
            </p>
          </div>

          <div className="border-t border-border pt-4 grid gap-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="custom-stats" className="font-bold">Use Custom Stats Endpoint</Label>
                <p className="text-xs text-muted-foreground">
                  Fetch detailed stats from your own tunneled pNode
                </p>
              </div>
              <Switch
                id="custom-stats"
                checked={customStats}
                onCheckedChange={setCustomStats}
              />
            </div>

            {customStats && (
              <div className="grid gap-2 animate-in fade-in-50 duration-200">
                <Label htmlFor="stats-endpoint" className="font-bold">Stats Endpoint (get-stats)</Label>
                <Input
                  id="stats-endpoint"
                  value={statsEndpoint}
                  onChange={(e) => setStatsEndpoint(e.target.value)}
                  placeholder="https://your-ngrok-url.ngrok.io/rpc"
                  className="font-mono text-sm border-2 border-foreground rounded-none focus-visible:ring-0 focus-visible:border-primary"
                />
                <p className="text-xs text-muted-foreground">
                  Use ngrok to tunnel your localhost:3000 (SSH tunnel to port 6000)
                </p>
                <div className="mt-2 p-3 bg-muted/50 rounded-md border border-border">
                  <p className="text-xs font-mono text-muted-foreground">
                    Example: ngrok http 3000<br />
                    Then paste the HTTPS URL here
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave} className="rounded-none font-bold border-2 border-transparent hover:border-foreground">Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
