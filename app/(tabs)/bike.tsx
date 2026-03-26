import React from "react";
import { useAppStore } from "@/store/useAppStore";
import { DisciplineScreenView } from "@/components/DisciplineScreen";

export default function BikeScreen() {
  const triRank = useAppStore((s) => s.getTriRank());
  const activities = useAppStore((s) => s.getActivitiesForDiscipline("bike"));
  const personalBests = useAppStore((s) =>
    s.getPersonalBestsForDiscipline("bike")
  );
  const rankHistory = useAppStore((s) => s.rankHistory);

  const historyPoints = rankHistory.map((h) => h.bikePoints);
  const historyLabels = rankHistory.map((h) =>
    new Date(h.date).toLocaleDateString("en-US", { month: "short" })
  );

  return (
    <DisciplineScreenView
      discipline="bike"
      rank={triRank.bikeRank}
      activities={activities}
      personalBests={personalBests}
      historyPoints={historyPoints}
      historyLabels={historyLabels}
    />
  );
}
