"use client";

import { GraduationCap, School, Building, BookOpen } from "lucide-react";

interface SchoolsSectionProps {
  schoolDistrict: string | null;
  elementarySchool: string | null;
  middleSchool: string | null;
  highSchool: string | null;
}

export default function SchoolsSection({
  schoolDistrict,
  elementarySchool,
  middleSchool,
  highSchool,
}: SchoolsSectionProps) {
  const schools = [
    {
      level: "Elementary School",
      name: elementarySchool,
      icon: BookOpen,
      grades: "K-5",
    },
    {
      level: "Middle School",
      name: middleSchool,
      icon: School,
      grades: "6-8",
    },
    {
      level: "High School",
      name: highSchool,
      icon: Building,
      grades: "9-12",
    },
  ].filter((school) => school.name);

  if (schools.length === 0 && !schoolDistrict) return null;

  return (
    <div>
      {/* Section Header */}
      <div className="mb-6">
        <h2 className="text-2xl lg:text-3xl font-bold text-main-primary">
          Schools & Education
        </h2>
        {schoolDistrict && (
          <div className="flex items-center gap-2 mt-2">
            <GraduationCap className="size-5 text-main-primary" />
            <p className="text-gray-600">
              <span className="font-medium text-main-primary">{schoolDistrict}</span>{" "}
              School District
            </p>
          </div>
        )}
        <div className="w-16 h-1 bg-main-secondary mt-3" />
      </div>

      {/* Schools Grid */}
      {schools.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {schools.map((school, index) => {
            const Icon = school.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center size-12 bg-main-primary/5 rounded-lg">
                    <Icon className="size-6 text-main-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{school.level}</p>
                    <p className="text-xs text-gray-400">Grades {school.grades}</p>
                  </div>
                </div>
                <h3 className="font-semibold text-main-primary">{school.name}</h3>
              </div>
            );
          })}
        </div>
      )}

      {/* Note */}
      <p className="text-sm text-gray-500 mt-6">
        School assignments may vary. Please verify with the school district for current boundaries.
      </p>
    </div>
  );
}
