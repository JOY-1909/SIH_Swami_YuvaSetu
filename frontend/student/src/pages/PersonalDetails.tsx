import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { UserCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function PersonalDetails() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);
  const [phoneOtpTimer, setPhoneOtpTimer] = useState(0);
  const [formData, setFormData] = useState({
    fullName: "",
    contactNumber: "",
    phoneOtp: "",
    address: "",
    differentlyAbled: false,
  });

  const handleSendPhoneOtp = () => {
    if (!formData.contactNumber || formData.contactNumber.length !== 10) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid 10-digit phone number.",
        variant: "destructive",
      });
      return;
    }

    setPhoneOtpSent(true);
    setPhoneOtpTimer(60);
    
    const interval = setInterval(() => {
      setPhoneOtpTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    toast({
      title: "OTP Sent! 📱",
      description: `Verification code sent to ${formData.contactNumber}`,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName || !formData.contactNumber || !formData.address) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (!phoneOtpSent || !formData.phoneOtp) {
      toast({
        title: "Phone Verification Required",
        description: "Please verify your phone number with OTP.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      toast({
        title: "Profile Completed! 🎉",
        description: "Welcome to your dashboard",
      });
      navigate("/dashboard");
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-2xl animate-scale-in">
        <Card className="shadow-card-hover border-2">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
              <UserCircle className="h-8 w-8 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl font-bold">Complete Your Profile</CardTitle>
            <CardDescription>Tell us more about yourself to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactNumber">Contact Number *</Label>
                <div className="flex gap-2">
                  <Input
                    id="contactNumber"
                    type="tel"
                    placeholder="10-digit mobile number"
                    value={formData.contactNumber}
                    onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                    maxLength={10}
                    required
                    disabled={phoneOtpSent}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleSendPhoneOtp}
                    disabled={phoneOtpSent && phoneOtpTimer > 0}
                  >
                    {phoneOtpSent && phoneOtpTimer > 0 ? `${phoneOtpTimer}s` : "Send OTP"}
                  </Button>
                </div>
              </div>

              {phoneOtpSent && (
                <div className="space-y-2 animate-fade-in">
                  <Label htmlFor="phoneOtp">Enter Phone OTP *</Label>
                  <Input
                    id="phoneOtp"
                    type="text"
                    placeholder="6-digit verification code"
                    value={formData.phoneOtp}
                    onChange={(e) => setFormData({ ...formData, phoneOtp: e.target.value })}
                    maxLength={6}
                    required
                  />
                  {phoneOtpTimer === 0 && (
                    <Button
                      type="button"
                      variant="link"
                      onClick={handleSendPhoneOtp}
                      className="p-0 h-auto text-primary"
                    >
                      Resend OTP
                    </Button>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Textarea
                  id="address"
                  placeholder="Enter your complete address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                  rows={3}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-0.5">
                  <Label htmlFor="differentlyAbled" className="text-base font-medium">
                    Differently Abled
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Are you a person with disabilities?
                  </p>
                </div>
                <Switch
                  id="differentlyAbled"
                  checked={formData.differentlyAbled}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, differentlyAbled: checked })
                  }
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Continue to Dashboard"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
