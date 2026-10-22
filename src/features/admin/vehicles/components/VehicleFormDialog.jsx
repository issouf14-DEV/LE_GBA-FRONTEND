import { CarFront, Save } from 'lucide-react';
import { useState } from 'react';
import { ImageUpload } from '@/components/common/form/ImageUpload';
import { SubmitButton } from '@/components/common/form/SubmitButton';
import { TextField } from '@/components/common/form/TextField';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { VehicleFormFields } from '@/features/admin/vehicles/components/VehicleFormFields';
import {
  EMPTY_VEHICLE,
  toFormValues,
  toPayload,
  vehicleSchema,
} from '@/features/admin/vehicles/schemas';
import { useZodForm } from '@/hooks/useZodForm';

// vehicle = null : création ; vehicle = objet : modification
export function VehicleFormDialog({ open, vehicle, onClose, onSave }) {
  const [current, setCurrent] = useState(vehicle);
  const form = useZodForm(vehicleSchema, vehicle ? toFormValues(vehicle) : EMPTY_VEHICLE);

  // Réinitialise le formulaire quand on ouvre la fenêtre pour un autre véhicule
  if (open && vehicle !== current) {
    setCurrent(vehicle);
    form.setValues(vehicle ? toFormValues(vehicle) : EMPTY_VEHICLE);
    form.setErrors({});
  }

  const onSubmit = form.handleSubmit(async (data) => {
    if (await onSave(vehicle?.id, toPayload(data))) onClose();
  });

  const isUploaded = form.values.image.startsWith('data:');

  return (
    <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
      <DialogContent className="vehicle-dialog">
        <DialogHeader>
          <DialogTitle>{vehicle ? 'Modifier le véhicule' : 'Ajouter un véhicule'}</DialogTitle>
          <DialogDescription>Les champs marqués * sont obligatoires.</DialogDescription>
        </DialogHeader>
        <form className="dialog-form" onSubmit={onSubmit} noValidate>
          <VehicleFormFields form={form} />
          <ImageUpload
            id="vehicle-image"
            label="Photo du véhicule (JPEG, PNG ou WebP, 2 Mo max.)"
            value={form.values.image || null}
            onChange={(dataUrl) => form.setValue('image', dataUrl)}
            placeholder={CarFront}
          />
          <TextField
            {...form.field('image')}
            value={isUploaded ? '' : form.values.image}
            label="Ou URL de l'image"
            type="url"
            placeholder="https://..."
          />
          <SubmitButton loading={form.submitting} loadingText="Enregistrement...">
            <Save aria-hidden="true" /> {vehicle ? 'Mettre à jour' : 'Ajouter le véhicule'}
          </SubmitButton>
        </form>
      </DialogContent>
    </Dialog>
  );
}
