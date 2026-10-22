import { SelectField } from '@/components/common/form/SelectField';
import { TextField } from '@/components/common/form/TextField';
import {
  DOOR_OPTIONS,
  FUEL_OPTIONS,
  SEAT_OPTIONS,
  TRANSMISSION_OPTIONS,
  TYPE_OPTIONS,
} from '@/features/admin/vehicles/schemas';

// Champs texte / listes du formulaire véhicule
export function VehicleFormFields({ form }) {
  return (
    <>
      <div className="form-grid">
        <TextField {...form.field('brand')} label="Marque *" placeholder="Ex : BMW, Toyota..." />
        <TextField
          {...form.field('model')}
          label="Modèle *"
          placeholder="Ex : Série 3, Corolla..."
        />
        <TextField {...form.field('price')} label="Prix par jour (FCFA) *" type="number" min="0" />
        <TextField {...form.field('year')} label="Année *" type="number" />
        <SelectField {...form.field('type')} label="Motorisation *" options={TYPE_OPTIONS} />
        <SelectField
          {...form.field('fuel')}
          label="Carburant"
          options={FUEL_OPTIONS}
          placeholder="Sélectionner..."
        />
        <SelectField
          {...form.field('transmission')}
          label="Transmission"
          options={TRANSMISSION_OPTIONS}
          placeholder="Sélectionner..."
        />
        <TextField {...form.field('power')} label="Puissance" placeholder="Ex : 150 ch" />
        <SelectField {...form.field('doors')} label="Portes" options={DOOR_OPTIONS} />
        <SelectField {...form.field('seats')} label="Places" options={SEAT_OPTIONS} />
        <TextField {...form.field('color')} label="Couleur" placeholder="Ex : Noir" />
        <TextField {...form.field('mileage')} label="Kilométrage" type="number" min="0" />
      </div>
      <TextField
        {...form.field('description')}
        as="textarea"
        rows={3}
        maxLength={1000}
        label="Description"
      />
      <TextField
        {...form.field('tags')}
        label="Tags"
        placeholder="Séparés par des virgules"
        hint="Ex : luxe, familiale"
      />
      <label className="checkbox-row" htmlFor="available">
        <input
          id="available"
          name="available"
          type="checkbox"
          checked={form.values.available}
          onChange={form.handleChange}
        />
        Véhicule disponible à la location
      </label>
    </>
  );
}
