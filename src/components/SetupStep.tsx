import React, { useEffect, useState } from "react";
import axios from "axios";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSignMessage, useWriteContract } from "wagmi";
import { parseUnits } from "viem";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SetupStepProps {
  id: 1 | 2;
  title: string;
  icon: React.ReactNode;
  completed: boolean;
  isActive: boolean;
  onComplete: (stepId: 1 | 2) => void;
  isWalletConnected?: boolean;
  address?: string;
  onConnectWallet?: () => void;
}

// USDC token addresses for different chains
const USDC_ADDRESSES = {
  ARBITRUM: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
  OPTIMISM: "0x7F5c764cBc14f9669B88837ca1490cCa17c31607",
  AVALANCHE: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
} as const;

export function SetupStep({ id, title, icon, completed, isActive, onComplete, isWalletConnected = false, onConnectWallet, address }: SetupStepProps) {
  const { signMessage, data: signature } = useSignMessage();
  const [isLoading, setIsLoading] = useState(false);
  const [fetchedAddresses, setFetchedAddresses] = useState(false);
  const [selectedChain, setSelectedChain] = useState<string>("");
  const [depositAmount, setDepositAmount] = useState<string>("");

  const multisigAddressesMock = [
    {
      chain: "ARBITRUM",
      multisigAddress: "0xB64e40bb16DCfCb092bd1B3bc18aA8B90f795C9a",
    },
    {
      chain: "OPTIMISM",
      multisigAddress: "0xac6923F71742A53044F8b2097b9bEa708b890a54",
    },
    {
      chain: "AVALANCHE",
      multisigAddress: "0xC2b046C95eb17286e813E3d2ef0432f6c482F0Ce",
    },
  ];

  const handleCreateSmartAccount = async () => {
    if (!isWalletConnected) {
      if (onConnectWallet) {
        onConnectWallet();
      }
      return;
    }
    if (!address) {
      console.error("Wallet address is required to create a smart account.");
      return;
    }
    setIsLoading(true);
    const message = `Deploy Safe for ${address}`;
    signMessage({ message });
  };

  useEffect(() => {
    const createAccount = async () => {
      if (!signature || fetchedAddresses) return;
      setIsLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setFetchedAddresses(true);
        onComplete(1);
      } catch (error) {
        console.error("Error creating smart account:", error);
      } finally {
        setIsLoading(false);
      }
    };
    createAccount();
  }, [signature, fetchedAddresses, onComplete]);

  const selectedAddress = multisigAddressesMock.find((a) => a.chain === selectedChain)?.multisigAddress;
  const selectedUSDC = selectedChain ? USDC_ADDRESSES[selectedChain as keyof typeof USDC_ADDRESSES] : undefined;

  const handleTransfer = async () => {
    if (!selectedAddress || !depositAmount || !selectedUSDC) return;
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      onComplete(2);
    } catch (error) {
      console.error("Transfer failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">{completed ? <Check className="h-4 w-4 text-green-500" /> : icon}</div>
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>

      {isActive && !completed && (
        <>
          {id === 1 ? (
            <>
              <div className="space-y-4 rounded-lg bg-muted p-4">
                <h4 className="font-medium">Power Up Your Wallet</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">- Self-custody: Full control of your assets</li>
                  <li className="flex items-center gap-2">- One-click Trading: No approvals needed</li>
                  <li className="flex items-center gap-2">- Gas Savings: Up to 40% lower fees</li>
                </ul>
              </div>
              <div className="rounded-md p-2 text-sm bg-accent text-accent-foreground">🔒 Create your secure Smart Account in one click</div>
              <Button className="w-full" onClick={handleCreateSmartAccount} disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Creating Account...
                  </div>
                ) : !isWalletConnected ? (
                  "Connect Wallet"
                ) : (
                  "Create Smart Account →"
                )}
              </Button>
            </>
          ) : (
            <>
              <div className="space-y-4">
                <Select
                  value={selectedChain}
                  onValueChange={(value) => {
                    setSelectedChain(value);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Chain" />
                  </SelectTrigger>
                  <SelectContent>
                    {multisigAddressesMock.map((addr) => (
                      <SelectItem key={addr.chain} value={addr.chain}>
                        {addr.chain}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {selectedAddress && (
                  <div className="rounded-md bg-muted p-3 text-sm">
                    <p className="font-medium">Deposit Address:</p>
                    <p className="mt-1 font-sans text-muted-foreground break-all">{selectedAddress}</p>
                  </div>
                )}

                <Input type="number" placeholder="Enter deposit amount (USDC)" value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} min="0" step="0.000001" />
                <div className="rounded-md bg-accent p-2 text-sm text-accent-foreground">🚀 Start with just 10 USDC to begin earning</div>
              </div>

              <Button className="w-full" onClick={handleTransfer} disabled={!selectedAddress || !depositAmount || isLoading || !selectedUSDC}>
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Processing Transfer...
                  </div>
                ) : (
                  "Transfer USDC →"
                )}
              </Button>
            </>
          )}
        </>
      )}
    </div>
  );
}
