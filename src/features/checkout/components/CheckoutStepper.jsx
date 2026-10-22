import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const STEPS = ['Informations', 'Dates', 'Paiement'];

export function CheckoutStepper({ current }) {
  return (
    <ol className="stepper">
      {STEPS.map((label, index) => {
        const number = index + 1;
        const state = number < current ? 'done' : number === current ? 'active' : 'todo';
        return (
          <li key={label} className={cn('stepper__step', `stepper__step--${state}`)}>
            <span className="stepper__circle">
              {state === 'done' ? <Check aria-hidden="true" /> : number}
            </span>
            <span className="stepper__label">{label}</span>
          </li>
        );
      })}
    </ol>
  );
}
