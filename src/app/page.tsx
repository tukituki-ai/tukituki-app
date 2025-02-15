"use client";

import { useState, useEffect } from "react";
import { ArrowRight, ArrowUpRight, Bot, Shield, Wallet } from "lucide-react";
import { DashboardHeader } from "@/components/DashboardHeader";
import { PositionCard } from "@/components/PositionCard";
import { SetupModal, initialSteps, type Step } from "@/components/SetupModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createPublicClient, http } from "viem";
import { formatUnits } from "ethers";
import { arbitrum } from "viem/chains";

interface Transaction {
  id: string;
  type: string;
  amount: string;
  timestamp: string;
  status: "completed" | "pending";
}

const mockTransactions: Transaction[] = [
  {
    id: "1",
    type: "Yield Optimization",
    amount: "+2.45 USDC",
    timestamp: "2 minutes ago",
    status: "completed",
  },
  {
    id: "2",
    type: "Position Rebalancing",
    amount: "+1.20 USDC",
    timestamp: "15 minutes ago",
    status: "completed",
  },
  {
    id: "3",
    type: "Strategy Update",
    amount: "+0.85 USDC",
    timestamp: "1 hour ago",
    status: "completed",
  },
];

export default function Home() {
  const [activeStep, setActiveStep] = useState<1 | 2>(1);
  const [modalOpen, setModalOpen] = useState(true);
  const [steps, setSteps] = useState<Step[]>(initialSteps);
  const [usdcBalance, setUsdcBalance] = useState<string>("0");

  useEffect(() => {
    async function getUSDCBalance() {
      try {
        const client = createPublicClient({
          chain: arbitrum,
          transport: http(),
        });

        const address = "0xC41CfBcfF3f3D75B8C6d7677f3C14051E03dAb1D";
        const balance = await client.readContract({
          address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
          abi: [
            {
              name: "balanceOf",
              type: "function",
              stateMutability: "view",
              inputs: [{ name: "account", type: "address" }],
              outputs: [{ name: "", type: "uint256" }],
            },
          ],
          functionName: "balanceOf",
          args: [address],
        });

        const formattedBalance = formatUnits(balance, 6);
        setUsdcBalance(formattedBalance);
      } catch (error) {
        console.error("Error fetching USDC balance:", error);
      }
    }

    getUSDCBalance();
  }, []);

  const completeStep = (stepId: 1 | 2) => {
    setSteps(steps.map((step) => (step.id === stepId ? { ...step, completed: true } : step)));
    if (stepId === 1) setActiveStep(2);
    if (stepId === 2) setModalOpen(false);
  };

  return (
    <>
      <div className={`space-y-6 p-6 transition-all duration-200 ${modalOpen ? "pointer-events-none blur-sm" : ""}`}>
        <DashboardHeader />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <PositionCard positionValue="$1,234.56" percentageChange="+2.45%" apy="12.5%" initialDeposit="1,000 USDC" activationDate="15.02.2024" />

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Active Assets</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-chart-1/20 p-2">
                    <Wallet className="h-4 w-4 text-chart-1" />
                  </div>
                  <span>USDC</span>
                </div>
                <span className="font-sans">{usdcBalance}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-chart-2/20 p-2">
                    <Shield className="h-4 w-4 text-chart-2" />
                  </div>
                  <span>stUSDC</span>
                </div>
                <span className="font-sans">245.32</span>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <CardHeader>
              <CardTitle className="text-lg">AI Agent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="absolute right-0 top-0 h-[200px] w-[200px] animate-pulse rounded-full bg-chart-1/5" />
              <div className="relative space-y-6">
                <div className="flex items-center justify-between gap-4">
                  <Bot className="h-8 w-8 text-chart-1" />
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  <Shield className="h-8 w-8 text-chart-2" />
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  <Bot className="h-8 w-8 text-chart-3" />
                </div>
                <div className="text-sm text-muted-foreground">Optimizing yields across multiple protocols</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockTransactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{tx.type}</span>
                      <ArrowUpRight className="h-4 w-4 text-green-500" />
                    </div>
                    <span className="text-sm text-muted-foreground">{tx.timestamp}</span>
                  </div>
                  <span className="font-mono text-green-500">{tx.amount}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <SetupModal open={modalOpen} onOpenChange={setModalOpen} steps={steps} activeStep={activeStep} onCompleteStep={completeStep} />
    </>
  );
}
