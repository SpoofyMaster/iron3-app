import React from "react";
import { useAppStore } from "@/store/useAppStore";
import { DisciplineScreenView } from "@/components/DisciplineScreen";

export default function SwimScreen() {
  const triRank = useAppStore((s) => s.getTriRank());
  const activities = useAppStore((s) => s.getActivitiesForDiscipline("swim"));
  const personalBests = useAppStore((s) =>
    s.getPersonalBestsForDiscipline("swim")
  );
  const rankHistory = useAppStore((s) => s.rankHistory);

  const historyPoints = rankHistory.map((h) => h.swimPoints);
  const historyLabels = rankHistory.map((h) =>
    new Date(h.date).toLocaleDateString("en-US", { month: "short" })
  );

  return (
    <DisciplineScreenView
      discipline="swim"
      rank={triRank.swimRank}
      activities={activities}
      personalBests={personalBests}
      historyPoints={historyPoints}
      historyLabels={historyLabels}
    />
  );
}
