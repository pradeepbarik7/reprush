import { DemoTransaction } from '../types';
import { INITIAL_DEMO_BALANCE } from '../config/stakesConfig';

const BALANCE_KEY = 'reprush_demo_balance';
const TRANSACTIONS_KEY = 'reprush_demo_transactions';

const INITIAL_TRANSACTIONS: DemoTransaction[] = [
  {
    id: 'tx-welcome-01',
    type: 'credit',
    amount: 500,
    label: 'Welcome Demo Balance',
    category: 'welcome',
    date: 'Initial Setup',
    balanceAfter: 500,
  },
];

/**
 * Returns current simulated demo balance from localStorage
 */
export function getDemoBalance(): number {
  try {
    const stored = localStorage.getItem(BALANCE_KEY);
    if (stored !== null) {
      const parsed = parseFloat(stored);
      if (!isNaN(parsed)) return parsed;
    }
  } catch (e) {
    console.warn('Failed to read demo balance from localStorage:', e);
  }
  // Initialize with ₹500
  setDemoBalance(INITIAL_DEMO_BALANCE);
  return INITIAL_DEMO_BALANCE;
}

/**
 * Internal setter for balance
 */
function setDemoBalance(amount: number): void {
  try {
    localStorage.setItem(BALANCE_KEY, amount.toFixed(2));
  } catch (e) {
    console.warn('Failed to save demo balance to localStorage:', e);
  }
}

/**
 * Returns transaction list
 */
export function getDemoTransactions(): DemoTransaction[] {
  try {
    const stored = localStorage.getItem(TRANSACTIONS_KEY);
    if (stored !== null) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('Failed to read demo transactions from localStorage:', e);
  }
  // Initialize with welcome transaction
  try {
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(INITIAL_TRANSACTIONS));
  } catch (e) {
    // ignore
  }
  return INITIAL_TRANSACTIONS;
}

/**
 * Records a new demo transaction and updates balance
 */
export function recordDemoTransaction(
  type: 'credit' | 'debit',
  amount: number,
  label: string,
  category: DemoTransaction['category']
): { newBalance: number; transaction: DemoTransaction } {
  const current = getDemoBalance();
  const newBalance = type === 'credit' ? current + amount : Math.max(0, current - amount);
  setDemoBalance(newBalance);

  const tx: DemoTransaction = {
    id: `tx-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    type,
    amount,
    label,
    category,
    date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', Today',
    balanceAfter: newBalance,
  };

  const currentList = getDemoTransactions();
  const updatedList = [tx, ...currentList].slice(0, 50); // keep last 50 transactions
  try {
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(updatedList));
  } catch (e) {
    console.warn('Failed to save demo transactions:', e);
  }

  // Dispatch custom window event so all UI components update synchronously
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('reprush_wallet_update', { detail: { balance: newBalance } }));
  }

  return { newBalance, transaction: tx };
}

/**
 * Deducts entry fee for a 1v1 battle or tournament
 */
export function deductDemoEntry(
  amount: number,
  label: string = '1v1 Battle Entry',
  category: DemoTransaction['category'] = 'battle_entry'
): { success: boolean; newBalance: number } {
  const current = getDemoBalance();
  if (current < amount) {
    return { success: false, newBalance: current };
  }
  const result = recordDemoTransaction('debit', amount, label, category);
  return { success: true, newBalance: result.newBalance };
}

/**
 * Adds reward credits for winning a match or tournament
 */
export function addDemoCredits(
  amount: number,
  label: string = '1v1 Battle Reward',
  category: DemoTransaction['category'] = 'battle_reward'
): number {
  const result = recordDemoTransaction('credit', amount, label, category);
  return result.newBalance;
}

/**
 * Refunds entry stake upon draw or match cancellation
 */
export function refundDemoEntry(
  amount: number,
  label: string = 'Battle Draw / Refund'
): number {
  const result = recordDemoTransaction('credit', amount, label, 'refund');
  return result.newBalance;
}

/**
 * Reset demo balance back to ₹500 (Prototype test utility)
 */
export function resetDemoWallet(): number {
  setDemoBalance(INITIAL_DEMO_BALANCE);
  const resetTx: DemoTransaction = {
    id: `tx-reset-${Date.now()}`,
    type: 'credit',
    amount: INITIAL_DEMO_BALANCE,
    label: 'Demo Balance Reset',
    category: 'welcome',
    date: 'Just now',
    balanceAfter: INITIAL_DEMO_BALANCE,
  };
  try {
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify([resetTx, ...getDemoTransactions()]));
  } catch (e) {
    // ignore
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('reprush_wallet_update', { detail: { balance: INITIAL_DEMO_BALANCE } }));
  }
  return INITIAL_DEMO_BALANCE;
}
