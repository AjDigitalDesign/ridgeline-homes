"use client";

import Image from "next/image";
import { Phone, Mail, Star } from "lucide-react";

interface SalesTeamMember {
  id: string;
  homeId: string;
  salesTeamId: string;
  isPrimary: boolean;
  displayOrder: number;
  salesTeam: {
    id: string;
    name: string;
    title: string | null;
    email: string | null;
    phone: string | null;
    photo: string | null;
    profile: string | null;
  };
}

interface SalesTeamSectionProps {
  salesTeams: SalesTeamMember[];
}

export default function SalesTeamSection({ salesTeams }: SalesTeamSectionProps) {
  if (!salesTeams || salesTeams.length === 0) return null;

  // Sort by isPrimary (primary first) then by displayOrder
  const sortedTeam = [...salesTeams].sort((a, b) => {
    if (a.isPrimary !== b.isPrimary) return a.isPrimary ? -1 : 1;
    return a.displayOrder - b.displayOrder;
  });

  return (
    <div>
      {/* Section Header */}
      <div className="mb-6">
        <h2 className="text-2xl lg:text-3xl font-bold text-main-primary">
          Meet Your Sales Team
        </h2>
        <p className="text-gray-600 mt-1">
          Our team is here to help you find your perfect home
        </p>
        <div className="w-16 h-1 bg-main-secondary mt-3" />
      </div>

      {/* Team Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedTeam.map((member) => {
          const { salesTeam, isPrimary } = member;
          return (
            <div
              key={salesTeam.id}
              className={`bg-white rounded-xl shadow-sm border overflow-hidden ${
                isPrimary ? "border-main-secondary" : "border-gray-100"
              }`}
            >
              {/* Primary Badge */}
              {isPrimary && (
                <div className="bg-main-secondary px-4 py-1.5 flex items-center gap-1.5">
                  <Star className="size-4 text-main-primary fill-current" />
                  <span className="text-sm font-medium text-main-primary">
                    Primary Contact
                  </span>
                </div>
              )}

              <div className="p-5">
                <div className="flex items-start gap-4">
                  {/* Photo */}
                  <div className="relative size-16 rounded-full overflow-hidden bg-gray-100 shrink-0">
                    {salesTeam.photo ? (
                      <Image
                        src={salesTeam.photo}
                        alt={salesTeam.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-gray-400">
                        {salesTeam.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-main-primary">
                      {salesTeam.name}
                    </h3>
                    {salesTeam.title && (
                      <p className="text-sm text-gray-500">{salesTeam.title}</p>
                    )}
                  </div>
                </div>

                {/* Contact Actions */}
                <div className="mt-4 flex flex-col gap-2">
                  {salesTeam.phone && (
                    <a
                      href={`tel:${salesTeam.phone}`}
                      className="flex items-center gap-2 px-4 py-2.5 bg-main-primary/5 rounded-lg text-main-primary hover:bg-main-primary/10 transition-colors"
                    >
                      <Phone className="size-4" />
                      <span className="text-sm font-medium">{salesTeam.phone}</span>
                    </a>
                  )}
                  {salesTeam.email && (
                    <a
                      href={`mailto:${salesTeam.email}`}
                      className="flex items-center gap-2 px-4 py-2.5 bg-main-primary/5 rounded-lg text-main-primary hover:bg-main-primary/10 transition-colors"
                    >
                      <Mail className="size-4" />
                      <span className="text-sm font-medium truncate">
                        {salesTeam.email}
                      </span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
