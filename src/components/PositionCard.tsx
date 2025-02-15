import React, { useEffect, useState } from "react";
import { createPublicClient, http, formatUnits } from "viem";
import { arbitrum } from "viem/chains";

interface PositionCardProps {
  positionValue: string;
  percentageChange: string;
  apy: string;
  initialDeposit: string;
  activationDate: string;
}

export function PositionCard({ percentageChange = "+0.00%", apy = "0.00%", initialDeposit = "0 USDC", activationDate = "15.02.2025" }: PositionCardProps) {
  const [usdcBalance, setUsdcBalance] = useState<string>("0");

  const USDC_ADDRESS = "0xaf88d065e77c8cC2239327C5EDb3A432268e5831";

  useEffect(() => {
    async function getUSDCBalance() {
      try {
        const client = createPublicClient({
          chain: arbitrum,
          transport: http(),
        });

        // Replace with the address you want to check
        const address = "0xC41CfBcfF3f3D75B8C6d7677f3C14051E03dAb1D";
        const balance = await client.readContract({
          address: USDC_ADDRESS,
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

        // USDC has 6 decimals
        const formattedBalance = formatUnits(balance, 6);
        setUsdcBalance(formattedBalance);
      } catch (error) {
        console.error("Error fetching USDC balance:", error);
      }
    }

    getUSDCBalance();
  }, []);

  return (
    <div className="space-y-4 rounded-xl border bg-card p-6">
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground">Position Value</h3>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold">${usdcBalance}</span>
          <span className="text-xs text-green-500">{percentageChange}</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 pt-4">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Current APY</p>
          <p className="font-medium">{apy}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Initial Deposit</p>
          <p className="font-medium">{initialDeposit}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Activation Date</p>
          <p className="font-medium">{activationDate}</p>
        </div>
      </div>
    </div>
  );
}
