import { usePlayer, useStage } from "@empirica/core/player/classic/react";
import React from "react";
import { TrainingStage } from "./stages/TrainingStage";
import { DisclosureStage } from "./stages/DisclosureStage";
import { AIAggregationStage } from "./stages/AIAggregationStage";
import { ResultsStage } from "./stages/ResultsStage";
import { CompetitionStage } from "./stages/CompetitionStage";
import { CompetitionResultsStage } from "./stages/CompetitionResultsStage";

export function Stage() {
  const player = usePlayer();
  const stage = useStage();

  if (!player || !stage) {
    return <div>Loading...</div>;
  }

  const stageName = stage.get("name") as string;

  switch (stageName) {
    case "training":
      return <TrainingStage />;
    case "disclosure":
      return <DisclosureStage />;
    case "aiAggregation":
      return <AIAggregationStage />;
    case "results":
      return <ResultsStage />;
    case "competition":
      return <CompetitionStage />;
    case "competitionResults":
      return <CompetitionResultsStage />;
    default:
      return <div>Unknown stage: {stageName}</div>;
  }
}
