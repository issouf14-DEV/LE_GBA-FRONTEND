import { Pencil, Trash2 } from 'lucide-react';
import { SafeImage } from '@/components/common/SafeImage';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { typeLabel } from '@/features/vehicles/lib/vehicle';
import { formatPrice } from '@/lib/format';

const COLUMNS = ['Image', 'Véhicule', 'Prix', 'Type', 'Carburant', 'Statut', 'Actions'];

export function VehicleTable({ vehicles, onEdit, onDelete, onPreview }) {
  return (
    <Table className="admin-table">
      <TableHeader>
        <TableRow>
          {COLUMNS.map((column) => (
            <TableHead key={column}>{column}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {vehicles.map((vehicle) => (
          <TableRow key={vehicle.id}>
            <TableCell>
              <button
                type="button"
                className="admin-table__thumb"
                onClick={() => onPreview(vehicle.image)}
                aria-label={`Agrandir ${vehicle.name}`}
              >
                <SafeImage src={vehicle.image} alt="" />
              </button>
            </TableCell>
            <TableCell>
              <p className="admin-table__strong">{vehicle.brand}</p>
              <p className="admin-table__muted">{vehicle.model}</p>
            </TableCell>
            <TableCell className="admin-table__strong">{formatPrice(vehicle.price)}</TableCell>
            <TableCell>{typeLabel(vehicle.type)}</TableCell>
            <TableCell>{vehicle.fuel}</TableCell>
            <TableCell>
              <Badge variant={vehicle.available ? 'success' : 'destructive'}>
                {vehicle.available ? 'Disponible' : 'Indisponible'}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="admin-table__actions">
                <Button size="sm" variant="outline" onClick={() => onEdit(vehicle)}>
                  <Pencil aria-hidden="true" /> Modifier
                </Button>
                <Button size="sm" variant="destructive" onClick={() => onDelete(vehicle)}>
                  <Trash2 aria-hidden="true" /> Supprimer
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
