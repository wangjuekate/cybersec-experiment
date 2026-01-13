/**
 * Custom Lobby Configuration
 * 
 * Override Empirica's default lobby behavior to implement custom
 * batch and lobby assignment logic
 */

import { assignPlayerToBatch, filterAvailableBatches, validateBatchAccess } from "./batchAssignment.js";

export function CustomLobby() {
  return function (ctx) {
    const { Empirica } = ctx;
    
    /**
     * Hook into player joining lobby
     */
    ctx.on("player:join", async (player) => {
      console.log(`Player ${player.id} joining lobby`);
      
      // Extract custom parameters from player identifier or attributes
      const identifier = player.get("identifier") || "";
      
      // Parse URL parameters if they were stored
      const urlParams = player.get("urlParams") || {};
      const batchParam = urlParams.batch;
      const sourceParam = urlParams.source;
      
      // Store metadata for tracking
      player.set("joinedAt", new Date().toISOString());
      player.set("source", sourceParam || "direct");
      
      if (batchParam) {
        player.set("requestedBatch", batchParam);
      }
      
      console.log(`Player metadata: batch=${batchParam}, source=${sourceParam}`);
    });
    
    /**
     * Custom batch assignment logic
     */
    ctx.on("player:assignBatch", async (player, batches) => {
      console.log(`Assigning batch for player ${player.id}`);
      console.log(`Available batches: ${batches.length}`);
      
      // Filter batches based on custom criteria
      let availableBatches = filterAvailableBatches(player, batches);
      
      if (availableBatches.length === 0) {
        console.log("No available batches after filtering");
        return null;
      }
      
      // Validate access for each batch
      availableBatches = availableBatches.filter(batch => {
        const validation = validateBatchAccess(player, batch);
        if (!validation.allowed) {
          console.log(`Batch ${batch.id} rejected: ${validation.reason}`);
        }
        return validation.allowed;
      });
      
      if (availableBatches.length === 0) {
        console.log("No batches passed validation");
        return null;
      }
      
      // Apply custom assignment logic
      const assignedBatch = assignPlayerToBatch(player, availableBatches);
      
      if (assignedBatch) {
        console.log(`Assigned player ${player.id} to batch ${assignedBatch.id}`);
        player.set("assignedBatchId", assignedBatch.id);
        player.set("assignedAt", new Date().toISOString());
      }
      
      return assignedBatch;
    });
    
    /**
     * Track batch assignment completion
     */
    ctx.on("player:batchAssigned", async (player, batch) => {
      console.log(`Player ${player.id} successfully assigned to batch ${batch.id}`);
      
      // Update batch statistics
      const currentCount = batch.get("playerCount") || 0;
      batch.set("playerCount", currentCount + 1);
      
      // Store assignment history
      const assignments = batch.get("playerAssignments") || [];
      assignments.push({
        playerId: player.id,
        assignedAt: new Date().toISOString(),
        source: player.get("source")
      });
      batch.set("playerAssignments", assignments);
    });
    
    /**
     * Handle batch assignment failures
     */
    ctx.on("player:batchAssignmentFailed", async (player, reason) => {
      console.error(`Failed to assign batch for player ${player.id}: ${reason}`);
      
      // Store failure for analytics
      player.set("batchAssignmentFailed", true);
      player.set("failureReason", reason);
      player.set("failedAt", new Date().toISOString());
      
      // Could implement retry logic or redirect to waiting room
    });
  };
}
