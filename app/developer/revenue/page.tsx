"use client";

import { useState } from "react";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Star,
  Megaphone,
  Download,
  Calendar,
  Filter,
  ArrowUpRight,
  Receipt,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatTZS } from "@/lib/data";

const revenueData = {
  today: { total: 485000, transactions: 23 },
  week: { total: 2850000, transactions: 156 },
  month: { total: 12500000, transactions: 687 },
  year: { total: 145000000, transactions: 8234 },
};

const monthlyRevenue = [
  {
    month: "Jan",
    subscriptions: 3200000,
    featured: 2100000,
    promoted: 1800000,
    fees: 1500000,
  },
  {
    month: "Feb",
    subscriptions: 3500000,
    featured: 2300000,
    promoted: 2000000,
    fees: 1600000,
  },
  {
    month: "Mar",
    subscriptions: 3800000,
    featured: 2500000,
    promoted: 2200000,
    fees: 1800000,
  },
  {
    month: "Apr",
    subscriptions: 4100000,
    featured: 2800000,
    promoted: 2400000,
    fees: 1900000,
  },
  {
    month: "May",
    subscriptions: 4500000,
    featured: 3200000,
    promoted: 2800000,
    fees: 2000000,
  },
];

const transactions = [
  {
    id: "TXN001",
    type: "subscription",
    user: "John Mwangi",
    email: "john@email.com",
    plan: "Premium",
    amount: 50000,
    status: "completed",
    date: "2024-05-15 14:32",
  },
  {
    id: "TXN002",
    type: "featured",
    user: "Amina Hassan",
    email: "amina@email.com",
    product: "Toyota Vitz 2018",
    amount: 15000,
    status: "completed",
    date: "2024-05-15 13:45",
  },
  {
    id: "TXN003",
    type: "subscription",
    user: "Peter Kimaro",
    email: "peter@email.com",
    plan: "Business",
    amount: 150000,
    status: "completed",
    date: "2024-05-15 12:20",
  },
  {
    id: "TXN004",
    type: "promoted",
    user: "Grace Mbeki",
    email: "grace@email.com",
    product: "iPhone 14 Pro",
    amount: 25000,
    status: "completed",
    date: "2024-05-15 11:15",
  },
  {
    id: "TXN005",
    type: "subscription",
    user: "David Shirima",
    email: "david@email.com",
    plan: "Basic",
    amount: 15000,
    status: "completed",
    date: "2024-05-15 10:30",
  },
  {
    id: "TXN006",
    type: "featured",
    user: "Sarah Mushi",
    email: "sarah@email.com",
    product: "Land for Sale",
    amount: 30000,
    status: "pending",
    date: "2024-05-15 09:45",
  },
  {
    id: "TXN007",
    type: "promoted",
    user: "Michael Kessy",
    email: "michael@email.com",
    product: "Furniture Set",
    amount: 20000,
    status: "completed",
    date: "2024-05-15 09:00",
  },
  {
    id: "TXN008",
    type: "transaction_fee",
    user: "System",
    email: "-",
    product: "Order #45678",
    amount: 7500,
    status: "completed",
    date: "2024-05-15 08:30",
  },
];

export default function RevenuePage() {
  const [period, setPeriod] = useState<"today" | "week" | "month" | "year">(
    "month",
  );
  const [filterType, setFilterType] = useState<
    "all" | "subscription" | "featured" | "promoted" | "transaction_fee"
  >("all");

  const filteredTransactions =
    filterType === "all"
      ? transactions
      : transactions.filter((t) => t.type === filterType);

  const currentData = revenueData[period];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Revenue Dashboard</h1>
          <p className="text-muted-foreground">
            Track your platform earnings and monetization
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Calendar className="w-4 h-4" />
            Custom Range
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Period selector and stats */}
      <div className="flex flex-col lg:flex-row gap-6">
        <Card className="flex-1">
          <CardContent className="p-6">
            <Tabs
              value={period}
              onValueChange={(v) => setPeriod(v as typeof period)}
            >
              <TabsList className="grid grid-cols-4 w-full mb-6">
                <TabsTrigger value="today">Today</TabsTrigger>
                <TabsTrigger value="week">This Week</TabsTrigger>
                <TabsTrigger value="month">This Month</TabsTrigger>
                <TabsTrigger value="year">This Year</TabsTrigger>
              </TabsList>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Total Revenue
                  </p>
                  <p className="text-4xl font-bold text-primary">
                    {formatTZS(currentData.total)}
                  </p>
                  <p className="text-sm text-green-600 flex items-center gap-1 mt-2">
                    <TrendingUp className="w-4 h-4" />
                    +23.5% vs previous period
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Transactions
                  </p>
                  <p className="text-4xl font-bold">
                    {currentData.transactions}
                  </p>
                  <p className="text-sm text-green-600 flex items-center gap-1 mt-2">
                    <ArrowUpRight className="w-4 h-4" />+
                    {Math.round(currentData.transactions * 0.15)} more than
                    before
                  </p>
                </div>
              </div>
            </Tabs>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-4 lg:w-80">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mx-auto mb-2">
                <CreditCard className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-xs text-muted-foreground">Subscriptions</p>
              <p className="text-lg font-bold">TZS 4.5M</p>
              <p className="text-xs text-green-600">+18%</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center mx-auto mb-2">
                <Star className="w-5 h-5 text-yellow-600" />
              </div>
              <p className="text-xs text-muted-foreground">Featured</p>
              <p className="text-lg font-bold">TZS 3.2M</p>
              <p className="text-xs text-green-600">+24%</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center mx-auto mb-2">
                <Megaphone className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-xs text-muted-foreground">Promoted</p>
              <p className="text-lg font-bold">TZS 2.8M</p>
              <p className="text-xs text-green-600">+31%</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center mx-auto mb-2">
                <Receipt className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-xs text-muted-foreground">Fees</p>
              <p className="text-lg font-bold">TZS 2.0M</p>
              <p className="text-xs text-green-600">+12%</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Monthly trend */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Revenue Trend</CardTitle>
          <CardDescription>
            Revenue breakdown by category over the last 5 months
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {monthlyRevenue.map((month) => {
              const total =
                month.subscriptions +
                month.featured +
                month.promoted +
                month.fees;
              return (
                <div key={month.month} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium w-12">{month.month}</span>
                    <span className="font-bold">{formatTZS(total)}</span>
                  </div>
                  <div className="flex h-4 rounded-lg overflow-hidden bg-muted">
                    <div
                      className="bg-blue-500 transition-all"
                      style={{
                        width: `${(month.subscriptions / total) * 100}%`,
                      }}
                      title={`Subscriptions: ${formatTZS(month.subscriptions)}`}
                    />
                    <div
                      className="bg-yellow-500 transition-all"
                      style={{ width: `${(month.featured / total) * 100}%` }}
                      title={`Featured: ${formatTZS(month.featured)}`}
                    />
                    <div
                      className="bg-purple-500 transition-all"
                      style={{ width: `${(month.promoted / total) * 100}%` }}
                      title={`Promoted: ${formatTZS(month.promoted)}`}
                    />
                    <div
                      className="bg-green-500 transition-all"
                      style={{ width: `${(month.fees / total) * 100}%` }}
                      title={`Fees: ${formatTZS(month.fees)}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-blue-500" />
              <span className="text-sm">Subscriptions</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-yellow-500" />
              <span className="text-sm">Featured Listings</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-purple-500" />
              <span className="text-sm">Promoted Ads</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-green-500" />
              <span className="text-sm">Transaction Fees</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>
                All revenue transactions on the platform
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={filterType === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("all")}
              >
                All
              </Button>
              <Button
                variant={filterType === "subscription" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("subscription")}
              >
                Subscriptions
              </Button>
              <Button
                variant={filterType === "featured" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("featured")}
              >
                Featured
              </Button>
              <Button
                variant={filterType === "promoted" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("promoted")}
              >
                Promoted
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Transaction ID
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Type
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    User
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Description
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                    Amount
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((tx) => (
                  <tr
                    key={tx.id}
                    className="border-b last:border-0 hover:bg-muted/50"
                  >
                    <td className="py-3 px-4 text-sm font-mono">{tx.id}</td>
                    <td className="py-3 px-4">
                      <Badge
                        variant="secondary"
                        className={`text-xs ${
                          tx.type === "subscription"
                            ? "bg-blue-100 text-blue-700"
                            : tx.type === "featured"
                              ? "bg-yellow-100 text-yellow-700"
                              : tx.type === "promoted"
                                ? "bg-purple-100 text-purple-700"
                                : "bg-green-100 text-green-700"
                        }`}
                      >
                        {tx.type.replace("_", " ")}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-sm font-medium">{tx.user}</p>
                        <p className="text-xs text-muted-foreground">
                          {tx.email}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {tx.type === "subscription"
                        ? `${tx.plan} Plan`
                        : tx.product}
                    </td>
                    <td className="py-3 px-4 text-sm font-bold text-right text-green-600">
                      +{formatTZS(tx.amount)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Badge
                        variant={
                          tx.status === "completed" ? "default" : "secondary"
                        }
                      >
                        {tx.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">
                      {tx.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              Showing {filteredTransactions.length} of {transactions.length}{" "}
              transactions
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Previous
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
