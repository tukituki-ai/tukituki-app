import React from "react";
import { Shield, Wallet } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { SetupStep } from "./SetupStep";
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";

export type Step = {
  id: 1 | 2;
  title: string;
  icon: React.ReactNode;
  completed: boolean;
};

interface SetupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  steps: Step[];
  activeStep: 1 | 2;
  onCompleteStep: (stepId: 1 | 2) => void;
}

export function SetupModal({ open, onOpenChange, steps, activeStep, onCompleteStep }: Omit<SetupModalProps, "isWalletConnected" | "onConnectWallet">) {
  const { isConnected, address } = useAppKitAccount();
  const { open: openAppKit } = useAppKit();
  const allStepsCompleted = steps.every((step) => step.completed);

  const handleOpenChange = (open: boolean) => {
    // Only allow closing if all steps are completed
    if (allStepsCompleted || open) {
      onOpenChange(open);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px] [&>button]:hidden">
        <DialogTitle className="sr-only">Account Setup</DialogTitle>
        <div className="space-y-4">
          {steps.map((step) => (
            <SetupStep key={step.id} {...step} isActive={activeStep === step.id} onComplete={onCompleteStep} isWalletConnected={isConnected} onConnectWallet={openAppKit} address={address} />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export const initialSteps: Step[] = [
  {
    id: 1,
    title: "Deploy Safe{Wallet}",
    icon: <Shield className="h-5 w-5" />,
    completed: false,
  },
  {
    id: 2,
    title: "Deposit funds",
    icon: <Wallet className="h-5 w-5" />,
    completed: false,
  },
];
