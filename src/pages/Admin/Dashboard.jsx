import { AlertCircle, Car, Clock, Package, RefreshCw, Users, Wallet } from 'lucide-react';
import { EmptyState } from '@/components/common/EmptyState';
import { StatCard } from '@/components/common/StatCard';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { AdminPageHeader } from '@/features/admin/components/AdminPageHeader';
import { BarChartCard } from '@/features/admin/dashboard/components/BarChartCard';
import { DashboardSkeleton } from '@/features/admin/dashboard/components/DashboardSkeleton';
import { RecentOrders } from '@/features/admin/dashboard/components/RecentOrders';
import { useDashboardStats } from '@/features/admin/dashboard/hooks/useDashboardStats';
import { formatCompact, formatPrice } from '@/lib/format';

export default function Dashboard() {
  const { stats, loading, error, reload } = useDashboardStats();

  return (
    <div className="admin-page">
      <AdminPageHeader title="Tableau de bord" subtitle="Vue d'ensemble de l'activité">
        <Button variant="outline" onClick={reload} disabled={loading}>
          {loading ? <Spinner /> : <RefreshCw aria-hidden="true" />} Actualiser
        </Button>
      </AdminPageHeader>

      {loading && !stats ? (
        <DashboardSkeleton />
      ) : error || !stats ? (
        <EmptyState
          icon={AlertCircle}
          tone="error"
          title="Erreur de chargement"
          description={error}
        />
      ) : (
        <>
          <div className="stat-grid">
            <StatCard
              title="Commandes"
              value={stats.totalOrders}
              icon={Package}
              to="/admin/orders"
            />
            <StatCard
              title="En attente"
              value={stats.pendingOrders}
              icon={Clock}
              to="/admin/orders"
            />
            <StatCard
              title="Chiffre d'affaires"
              value={formatPrice(stats.totalRevenue)}
              icon={Wallet}
              hint="Commandes validées et terminées"
            />
            <StatCard
              title="Utilisateurs"
              value={stats.totalUsers}
              icon={Users}
              to="/admin/users"
            />
            <StatCard
              title="Véhicules"
              value={stats.totalVehicles}
              icon={Car}
              to="/admin/vehicles"
            />
          </div>

          <div className="chart-grid">
            <BarChartCard
              title="Chiffre d'affaires (6 derniers mois)"
              data={stats.monthly}
              dataKey="revenus"
              label="Chiffre d'affaires"
              format={formatPrice}
              axisFormat={formatCompact}
            />
            <BarChartCard
              title="Commandes reçues (6 derniers mois)"
              data={stats.monthlyOrders}
              dataKey="commandes"
              label="Commandes"
            />
            <BarChartCard
              title="Commandes par statut"
              data={stats.byStatus}
              dataKey="value"
              label="Commandes"
              horizontal
            />
          </div>

          <RecentOrders orders={stats.recentOrders} />
        </>
      )}
    </div>
  );
}
