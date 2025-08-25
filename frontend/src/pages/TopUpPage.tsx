import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Wallet, CreditCard, Loader2, CheckCircle } from 'lucide-react';
import { useWallet } from '@/components/context/WalletContext';
import { PAYMENT_METHODS } from '@/services/paymentService';

const QUICK_AMOUNTS = [50000, 100000, 200000, 500000, 1000000, 2000000];

export default function TopUpPage() {
  const navigate = useNavigate();
  const { balance, topUp, isLoading } = useWallet();
  const [amount, setAmount] = useState<number>(0);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentResult, setPaymentResult] = useState<any>(null);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const handleQuickAmount = (quickAmount: number) => {
    setAmount(quickAmount);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value.replace(/[^0-9]/g, '')) || 0;
    setAmount(value);
  };

  const handleTopUp = async () => {
    if (!amount || amount < 10000) {
      alert('Minimum top-up amount is Rp 10.000');
      return;
    }

    if (!selectedPaymentMethod) {
      alert('Please select a payment method');
      return;
    }

    try {
      setIsProcessing(true);
      const result = await topUp(amount, selectedPaymentMethod);
      setPaymentResult(result);
    } catch (error) {
      console.error('Top-up failed:', error);
      alert('Top-up failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (paymentResult && paymentResult.success) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Button variant="ghost" onClick={() => navigate('/profile')} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Profile
          </Button>

          <Card className="text-center">
            <CardHeader className="bg-green-50 rounded-t-lg p-6">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <CardTitle className="text-2xl text-green-700">Top-up Initiated!</CardTitle>
              <CardDescription className="text-gray-600 mt-2">
                Please complete your payment to add balance to your wallet.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-left space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Top-up ID:</span>
                  <span className="font-mono bg-gray-100 p-1 rounded">{paymentResult.topUpId}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Amount:</span>
                  <span className="font-bold text-blue-600">{formatCurrency(amount)}</span>
                </div>
                {paymentResult.virtualAccount && (
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Virtual Account:</span>
                    <span className="font-mono bg-blue-50 p-2 rounded text-blue-700">
                      {paymentResult.virtualAccount}
                    </span>
                  </div>
                )}
              </div>

              <Separator className="my-6" />

              <div className="text-left">
                <h3 className="text-lg font-semibold mb-4">Payment Instructions:</h3>
                <ul className="space-y-2 text-sm">
                  {paymentResult.instructions.map((instruction: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span>{instruction}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={() => navigate('/profile')} className="w-full sm:w-auto">
                  Back to Profile
                </Button>
                <Button 
                  onClick={() => {
                    setPaymentResult(null);
                    setAmount(0);
                    setSelectedPaymentMethod('');
                  }} 
                  variant="outline" 
                  className="w-full sm:w-auto"
                >
                  Top-up Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button variant="ghost" onClick={() => navigate('/profile')} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Profile
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Side: Top-up Form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Wallet className="mr-2 h-5 w-5" />
                  Top-up Wallet
                </CardTitle>
                <CardDescription>
                  Add balance to your Siroy Paint Shop wallet for faster checkout
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Current Balance */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Current Balance</span>
                    <span className="text-xl font-bold text-blue-600">
                      {balance ? formatCurrency(balance.balance) : formatCurrency(0)}
                    </span>
                  </div>
                </div>

                {/* Amount Input */}
                <div className="space-y-2">
                  <Label htmlFor="amount">Top-up Amount</Label>
                  <Input
                    id="amount"
                    type="text"
                    placeholder="Enter amount"
                    value={amount > 0 ? formatCurrency(amount) : ''}
                    onChange={handleAmountChange}
                    className="text-lg"
                  />
                  <p className="text-xs text-gray-500">Minimum top-up: Rp 10.000</p>
                </div>

                {/* Quick Amount Buttons */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">Quick Amount</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {QUICK_AMOUNTS.map((quickAmount) => (
                      <Button
                        key={quickAmount}
                        variant={amount === quickAmount ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleQuickAmount(quickAmount)}
                        className="text-xs"
                      >
                        {formatCurrency(quickAmount)}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Payment Methods */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">Payment Method</Label>
                  <div className="space-y-2">
                    {PAYMENT_METHODS.map((method) => (
                      <div
                        key={method.id}
                        className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                          selectedPaymentMethod === method.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedPaymentMethod(method.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">{method.icon}</span>
                            <div>
                              <p className="font-medium text-sm">{method.name}</p>
                              <p className="text-xs text-gray-500">{method.description}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant="secondary" className="text-xs">
                              {method.processingTime}
                            </Badge>
                            {method.fee > 0 && (
                              <p className="text-xs text-gray-500 mt-1">
                                Fee: {formatCurrency(method.fee)}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Side: Summary */}
          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Top-up Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Current Balance</span>
                    <span>{balance ? formatCurrency(balance.balance) : formatCurrency(0)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Top-up Amount</span>
                    <span>{formatCurrency(amount)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>New Balance</span>
                    <span className="text-blue-600">
                      {formatCurrency((balance?.balance || 0) + amount)}
                    </span>
                  </div>
                </div>

                {selectedPaymentMethod && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm font-medium mb-1">Selected Payment Method</p>
                    <p className="text-sm text-gray-600">
                      {PAYMENT_METHODS.find(m => m.id === selectedPaymentMethod)?.name}
                    </p>
                  </div>
                )}

                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  size="lg"
                  onClick={handleTopUp}
                  disabled={!amount || amount < 10000 || !selectedPaymentMethod || isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-5 w-5" />
                      Top-up {formatCurrency(amount)}
                    </>
                  )}
                </Button>

                {/* Benefits */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-sm mb-2 text-green-800">Wallet Benefits</h4>
                  <ul className="text-xs text-green-700 space-y-1">
                    <li>• Faster checkout process</li>
                    <li>• No need to enter payment details repeatedly</li>
                    <li>• Instant payment confirmation</li>
                    <li>• Secure and convenient</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
