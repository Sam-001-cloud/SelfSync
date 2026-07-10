
import React, { useState } from "react";
import { FileText, Download, Info } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

interface CertificateProps {
  streakDays: number;
  requiredDays?: number;
  wellnessPoints?: number;
}

export function Certificate({ streakDays, requiredDays = 7, wellnessPoints = 1250 }: CertificateProps) {
  const { user } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const isEligible = streakDays >= requiredDays;
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  
  // Format user name for certificate
  const userName = user?.name || "Wellness User";
  
  const generatePDF = async () => {
    const certificateElement = document.getElementById('certificate-content');
    if (!certificateElement) return;
    
    setIsGenerating(true);
    
    try {
      const canvas = await html2canvas(certificateElement, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`wellness-certificate-${userName.replace(/\s+/g, '-').toLowerCase()}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <FileText className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Wellness Certificate</h3>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="rounded-full">
                <Info className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Certificate Eligibility Rules</DialogTitle>
                <DialogDescription>
                  <div className="space-y-4 pt-2">
                    <p>
                      To be eligible for a wellness certificate, you must meet the following criteria:
                    </p>
                    <ul className="list-disc list-inside space-y-2">
                      <li>Use the app for at least {requiredDays} consecutive days</li>
                      <li>Complete at least one activity per day</li>
                      <li>Earn a minimum of 50 wellness points</li>
                    </ul>
                    <p>
                      Once eligible, you can generate and download your personalized certificate from
                      the rewards section.
                    </p>
                  </div>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
        {isEligible && (
          <Button 
            size="sm" 
            onClick={generatePDF}
            disabled={isGenerating}
          >
            <Download className="mr-2 h-4 w-4" />
            {isGenerating ? "Generating..." : "Download Certificate"}
          </Button>
        )}
      </div>
      
      <div className="relative mb-4">
        {!isEligible && (
          <div className="absolute inset-0 bg-card/80 flex items-center justify-center z-10 rounded-lg backdrop-blur-sm">
            <div className="text-center p-6">
              <Badge variant="secondary" className="mb-2">
                {streakDays} / {requiredDays} Days
              </Badge>
              <h4 className="text-lg font-medium">Almost there!</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Use the app for {requiredDays - streakDays} more consecutive days to unlock your certificate
              </p>
            </div>
          </div>
        )}
        
        <div 
          id="certificate-content"
          className="p-8 border rounded-lg bg-white text-black"
          style={{ fontFamily: 'serif' }}
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-2 text-primary" style={{ fontFamily: 'cursive, serif' }}>
              Certificate of Achievement
            </h2>
            <div className="mb-6 text-sm text-muted-foreground">
              This certifies that
            </div>
            <h3 className="text-2xl font-bold mb-6 text-slate-800" style={{ fontFamily: 'cursive, serif' }}>
              {userName}
            </h3>
            <p className="mb-6 text-lg">
              has successfully maintained a consistent wellness practice for 
              <span className="font-semibold"> {streakDays} </span> 
              consecutive days and earned 
              <span className="font-semibold"> {wellnessPoints} </span> 
              wellness points
            </p>
            
            <div className="flex justify-center space-x-12 mt-8 mb-4">
              <div className="text-center">
                <div className="w-20 h-1 bg-primary mx-auto mb-2"></div>
                <p className="text-sm font-semibold">SelfSync</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-1 bg-primary mx-auto mb-2"></div>
                <p className="text-sm">{today}</p>
              </div>
            </div>
            
            <div className="absolute bottom-4 right-4 opacity-20">
              <svg width="50" height="50" viewBox="0 0 100 100" fill="currentColor">
                <path d="M50 0C22.4 0 0 22.4 0 50s22.4 50 50 50 50-22.4 50-50S77.6 0 50 0zm0 90C27.9 90 10 72.1 10 50S27.9 10 50 10s40 17.9 40 40-17.9 40-40 40z"/>
                <path d="M50 25c-13.8 0-25 11.2-25 25s11.2 25 25 25 25-11.2 25-25-11.2-25-25-25zm0 40c-8.3 0-15-6.7-15-15s6.7-15 15-15 15 6.7 15 15-6.7 15-15 15z"/>
                <circle cx="50" cy="50" r="5"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      {!isEligible && (
        <div className="text-sm text-muted-foreground">
          <p>
            Maintain your streak and earn rewards! <br />
            Daily activities will help you unlock your personalized certificate.
          </p>
        </div>
      )}
    </div>
  );
}
