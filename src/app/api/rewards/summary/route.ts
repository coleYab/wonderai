import { NextResponse } from 'next/server';

const rewards = [
  { name: 'Notebook', coinCost: 10 },
  { name: 'Cup', coinCost: 15 },
  { name: 'T-Shirt', coinCost: 20 },
  { name: 'Hoodie', coinCost: 25 }
];

export async function GET() {
  const totalRewardTypes = rewards.length;
  const totalCoinCost = rewards.reduce((sum, reward) => sum + reward.coinCost, 0);

  return NextResponse.json({
    totalRewardTypes,
    totalCoinCost,
    rewards,
    message: 'Rewards summary loaded successfully.'
  });
}
