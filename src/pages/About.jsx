import React from 'react';
import { Building2, Users, Trophy, Target, Shield, Zap, Award } from 'lucide-react';

const About = () => {
  const stats = [
    { value: '10+', label: 'Années d\'expérience', icon: Building2 },
    { value: '1000+', label: 'Clients satisfaits', icon: Users },
    { value: '150+', label: 'Véhicules vendus', icon: Trophy },
    { value: '98%', label: 'Taux de satisfaction', icon: Target }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-[#1a0505] via-[#2b0b0b] to-[#180707] text-white py-28 overflow-hidden">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative container mx-auto px-4 text-center">
          <p className="text-red-500 font-semibold uppercase tracking-widest text-sm mb-4">Notre entreprise</p>
          <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
            À Propos de <span className="text-red-600">LE-GBA</span>
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Votre partenaire de confiance pour l'acquisition de véhicules premium en Côte d'Ivoire
          </p>
        </div>
      </div>

      {/* Notre Histoire - pleine largeur, pas d'espace blanc */}
      <div className="bg-gray-50">
        <div className="grid md:grid-cols-2 min-h-[500px]">
          {/* Image - prend toute la moitié */}
          <div className="relative overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1200&q=80&auto=format"
              alt="LE-GBA - Véhicules Premium"
              className="w-full h-full object-cover absolute inset-0"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20"></div>
          </div>
          {/* Texte */}
          <div className="flex items-center p-10 md:p-16 lg:p-20">
            <div>
              <p className="text-red-700 font-semibold uppercase tracking-widest text-sm mb-3">Notre Histoire</p>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6">Un engagement envers l'excellence</h2>
              <p className="text-gray-600 leading-relaxed mb-5">
                Depuis notre création, <span className="font-bold text-red-700">LE-GBA</span> s'est imposé comme un leader dans le secteur automobile en Côte d'Ivoire. Notre engagement envers l'excellence et la satisfaction client nous a permis de construire une réputation solide dans le domaine des véhicules premium.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Notre mission est de fournir à nos clients une expérience d'achat automobile exceptionnelle, en proposant une sélection rigoureuse de véhicules de qualité et un service client irréprochable.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="bg-gradient-to-br from-[#1a0505] via-[#2b0b0b] to-[#0d0303] py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-red-700/20 border border-red-700/30 rounded-full mb-4">
                    <Icon className="w-7 h-7 text-red-500" />
                  </div>
                  <h3 className="text-4xl font-black text-white mb-2">{stat.value}</h3>
                  <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Nos Valeurs - pleine largeur */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-red-700 font-semibold uppercase tracking-widest text-sm mb-3">Ce qui nous définit</p>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900">Nos Valeurs</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { icon: Award, title: 'Excellence', desc: 'Nous maintenons les plus hauts standards de qualité dans tous nos services.' },
              { icon: Shield, title: 'Intégrité', desc: 'La transparence et l\'honnêteté sont au coeur de toutes nos interactions.' },
              { icon: Zap, title: 'Innovation', desc: 'Nous adoptons les dernières technologies pour améliorer notre service.' },
            ].map((val, i) => (
              <div key={i} className="bg-gray-50 p-8 rounded-xl border border-gray-100 hover:border-red-200 transition-colors">
                <div className="w-12 h-12 bg-red-700 rounded-lg flex items-center justify-center mb-5">
                  <val.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{val.title}</h3>
                <p className="text-gray-600 leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
