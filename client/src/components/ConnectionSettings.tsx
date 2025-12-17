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

interface ConnectionSettingsProps {
  currentEndpoint: string;
  onSave: (endpoint: string) => void;
}

export function ConnectionSettings({ currentEndpoint, onSave }: ConnectionSettingsProps) {
  const [endpoint, setEndpoint] = useState(currentEndpoint);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setEndpoint(currentEndpoint);
  }, [currentEndpoint]);

  const handleSave = () => {
    onSave(endpoint);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" title="Connection Settings">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] border-2 border-foreground shadow-none rounded-none">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold tracking-tight uppercase">Connection Settings</DialogTitle>
          <DialogDescription>
            Configure the Xandeum pNode RPC endpoint.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="endpoint" className="font-bold">RPC Endpoint URL</Label>
            <Input
              id="endpoint"
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
              placeholder="http://localhost:6000/rpc"
              className="font-mono text-sm border-2 border-foreground rounded-none focus-visible:ring-0 focus-visible:border-primary"
            />
            <p className="text-xs text-muted-foreground">
              Default: http://localhost:6000/rpc (or your tunneled port)
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave} className="rounded-none font-bold border-2 border-transparent hover:border-foreground">Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
