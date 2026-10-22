import { Calendar, NotebookPen } from 'lucide-react';
import { TextField } from '@/components/common/form/TextField';
import { today } from '@/features/checkout/schemas';

export function DatesStep({ form }) {
  return (
    <div className="checkout-step">
      <h2 className="checkout-step__title">Détails de la réservation</h2>
      <div className="form-grid">
        <TextField
          {...form.field('startDate')}
          label="Date de début *"
          type="date"
          icon={Calendar}
          min={today()}
          hint="À partir d'aujourd'hui"
        />
        <TextField
          {...form.field('endDate')}
          label="Date de fin *"
          type="date"
          icon={Calendar}
          min={form.values.startDate || today()}
          hint="Date de retour du véhicule"
        />
      </div>
      <TextField
        {...form.field('notes')}
        as="textarea"
        rows={3}
        maxLength={500}
        label="Notes (optionnel)"
        icon={NotebookPen}
        placeholder="Demandes spéciales..."
      />
    </div>
  );
}
