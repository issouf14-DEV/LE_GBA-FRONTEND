import { Lock, UserCircle } from 'lucide-react';
import { PageHero } from '@/components/common/PageHero';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PasswordForm } from '@/features/profile/components/PasswordForm';
import { ProfileCard } from '@/features/profile/components/ProfileCard';
import { ProfileForm } from '@/features/profile/components/ProfileForm';

export default function Profile() {
  return (
    <div className="page page--muted">
      <PageHero
        title="Mon profil"
        subtitle="Gérez vos informations personnelles"
        icon={UserCircle}
      />
      <div className="page-container page-container--padded">
        <div className="profile-layout">
          <ProfileCard />
          <Tabs defaultValue="profile" className="profile-main">
            <TabsList className="profile-tabs">
              <TabsTrigger value="profile">
                <UserCircle aria-hidden="true" /> Informations
              </TabsTrigger>
              <TabsTrigger value="security">
                <Lock aria-hidden="true" /> Sécurité
              </TabsTrigger>
            </TabsList>
            <TabsContent value="profile">
              <ProfileForm />
            </TabsContent>
            <TabsContent value="security">
              <PasswordForm />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
