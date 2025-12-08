import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus } from "lucide-react";

interface Ticket {
  id: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
  resolution?: string;
}

export const RaiseRequestModal = ({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        toast({ title: "Error", description: "You must be logged in to raise a request.", variant: "destructive" });
        return;
      }

      const response = await fetch("/api/v1/support/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ subject, message, category: "General" }),
      });

      if (!response.ok) throw new Error("Failed to create ticket");

      toast({ title: "Success", description: "Support request raised successfully." });
      setSubject("");
      setMessage("");
      onOpenChange(false);
    } catch (error) {
        console.error(error);
      toast({ title: "Error", description: "Failed to submit request.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Raise Support Request</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label className="text-sm font-medium">Subject</label>
            <Input 
              value={subject} 
              onChange={(e) => setSubject(e.target.value)} 
              placeholder="e.g., Login Issue" 
              required 
            />
          </div>
          <div>
            <label className="text-sm font-medium">Message</label>
            <Textarea 
              value={message} 
              onChange={(e) => setMessage(e.target.value)} 
              placeholder="Describe your issue..." 
              required 
              rows={4}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Submit Request"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export const TrackRequestView = ({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
       if (!token) return;

      const response = await fetch("/api/v1/support/my-tickets", {
         headers: { "Authorization": `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setTickets(data);
      }
    } catch (error) {
      console.error("Error fetching tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchTickets();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Your Support Requests</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          {loading ? (
             <div className="flex justify-center p-4"><Loader2 className="h-6 w-6 animate-spin" /></div>
          ) : tickets.length === 0 ? (
            <p className="text-center text-gray-500">No requests found.</p>
          ) : (
            tickets.map((ticket) => (
              <div key={ticket.id} className="border p-4 rounded-lg bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold">{ticket.subject}</h4>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    ticket.status === 'Open' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {ticket.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{ticket.message}</p>
                <div className="text-xs text-gray-400">
                  {new Date(ticket.created_at).toLocaleDateString()}
                </div>
                {ticket.resolution && (
                   <div className="mt-2 text-sm bg-green-50 p-2 rounded border border-green-200">
                      <strong>Resolution:</strong> {ticket.resolution}
                   </div>
                )}
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
