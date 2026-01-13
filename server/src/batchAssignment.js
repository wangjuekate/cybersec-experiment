/**
 * Custom Batch Assignment Logic
 * 
 * This module allows you to control how participants are assigned to batches
 * based on custom criteria like URL parameters, participant attributes, etc.
 */

/**
 * Custom batch assignment function
 * 
 * @param {Object} player - The player object
 * @param {Array} batches - Available batches
 * @returns {Object|null} - Selected batch or null for default behavior
 */
export function assignPlayerToBatch(player, batches) {
  // Example 1: Assign based on player identifier pattern
 /** const playerId = player.get("identifier") || "";
  
  if (playerId.startsWith("batch1_")) {
    return batches.find(b => b.get("name") === "Batch 1");
  }
  
  if (playerId.startsWith("batch2_")) {
    return batches.find(b => b.get("name") === "Batch 2");
  } 
  
  // Example 2: Assign based on custom player attributes
  const assignedBatch = player.get("assignedBatch");
  if (assignedBatch) {
    return batches.find(b => b.get("name") === assignedBatch);
  }
  **/
  
  // Example 3: Round-robin assignment
  // const batchIndex = player.get("createdAt") % batches.length;
  // return batches[batchIndex];
  
  // Example 4: Load balancing - assign to batch with fewest players
  // DISABLED FOR TESTING - This spreads players across multiple batches
  // const batchWithFewest = batches.reduce((min, batch) => {
  //   const currentPlayers = batch.get("playerCount") || 0;
  //   const minPlayers = min.get("playerCount") || 0;
  //   return currentPlayers < minPlayers ? batch : min;
  // });
  // return batchWithFewest;
  
  // Return null to use Empirica's default assignment logic
  // This will assign all players to the first available batch
  return null;
}

/**
 * Filter which batches a player can join
 * 
 * @param {Object} player - The player object
 * @param {Array} batches - All available batches
 * @returns {Array} - Filtered list of batches the player can join
 */
export function filterAvailableBatches(player, batches) {
  
 /** 
    // Example 1: Filter by player attribute
  const playerExperience = player.get("experienceLevel");
  
  if (playerExperience === "beginner") {
    return batches.filter(b => b.get("difficulty") === "easy");
  }
  
  if (playerExperience === "advanced") {
    return batches.filter(b => b.get("difficulty") === "hard");
  }
  
  // Example 2: Filter by time-based criteria
  const now = new Date();
  const hour = now.getHours();
  
  // Morning batches (8am-12pm)
  if (hour >= 8 && hour < 12) {
    return batches.filter(b => b.get("timeSlot") === "morning");
  }
  **/
  // Example 3: Filter by capacity
  return batches.filter(b => {
    const currentPlayers = b.get("playerCount") || 0;
    const maxPlayers = b.get("maxPlayers") || 100;
    return currentPlayers < maxPlayers;
  });
  
  // Return all batches for default behavior
  // return batches;
}

/**
 * Custom lobby assignment logic
 * 
 * @param {Object} player - The player object
 * @param {Object} batch - The assigned batch
 * @param {Array} lobbies - Available lobbies in the batch
 * @returns {Object|null} - Selected lobby or null for default behavior
 */
export function assignPlayerToLobby(player, batch, lobbies) {
  // Example 1: Assign based on player skill level
 /** const skillLevel = player.get("skillLevel") || "medium";
  
  const matchingLobby = lobbies.find(lobby => {
    const lobbySkillLevel = lobby.get("skillLevel");
    return lobbySkillLevel === skillLevel;
  });
  
  if (matchingLobby) {
    return matchingLobby;
  }
  **/
  // Example 2: Assign to lobby with similar players
  // const playerRegion = player.get("region");
  // return lobbies.find(l => l.get("region") === playerRegion);
  
  // Example 3: Assign to least full lobby
  return lobbies.reduce((min, lobby) => {
    const currentSize = lobby.get("playerCount") || 0;
    const minSize = min.get("playerCount") || 0;
    return currentSize < minSize ? lobby : min;
  });
  
  // Return null for default behavior
  // return null;
}

/**
 * Validate if a player can join a specific batch
 * 
 * @param {Object} player - The player object
 * @param {Object} batch - The batch to validate
 * @returns {Object} - { allowed: boolean, reason: string }
 */
export function validateBatchAccess(player, batch) {
  /**
  // Example 1: Check if player has required attributes
  const hasConsented = player.get("hasConsented");
  if (!hasConsented) {
    return {
      allowed: false,
      reason: "Player must consent before joining"
    };
  }
  
  // Example 2: Check batch capacity
  const currentPlayers = batch.get("playerCount") || 0;
  const maxPlayers = batch.get("maxPlayers") || 100;
  
  if (currentPlayers >= maxPlayers) {
    return {
      allowed: false,
      reason: "Batch is full"
    };
  }
  
  // Example 3: Check time restrictions
  const batchStartTime = batch.get("startTime");
  const batchEndTime = batch.get("endTime");
  const now = new Date();
  
  if (batchStartTime && now < new Date(batchStartTime)) {
    return {
      allowed: false,
      reason: "Batch has not started yet"
    };
  }
  
  if (batchEndTime && now > new Date(batchEndTime)) {
    return {
      allowed: false,
      reason: "Batch has ended"
    };
  }
  
  // Example 4: Check player eligibility
  const playerAge = player.get("age");
  const minAge = batch.get("minAge") || 18;
  
  if (playerAge && playerAge < minAge) {
    return {
      allowed: false,
      reason: `Must be at least ${minAge} years old`
    };
  }
  **/
  
  return { allowed: true };
}

/**
 * Priority-based batch assignment
 * Assigns players to batches based on priority scores
 * 
 * @param {Object} player - The player object
 * @param {Array} batches - Available batches
 * @returns {Object|null} - Highest priority batch
 */
export function priorityBasedAssignment(player, batches) {
  /**
  const scoredBatches = batches.map(batch => {
    let score = 0;
    
    // Priority 1: Match treatment to player preference
    const preferredTreatment = player.get("preferredTreatment");
    if (batch.get("treatment") === preferredTreatment) {
      score += 100;
    }
    
    // Priority 2: Prefer batches with similar players
    const playerExperience = player.get("experienceLevel");
    const batchAvgExperience = batch.get("avgExperienceLevel");
    if (playerExperience === batchAvgExperience) {
      score += 50;
    }
    
    // Priority 3: Prefer less full batches
    const currentPlayers = batch.get("playerCount") || 0;
    const maxPlayers = batch.get("maxPlayers") || 100;
    const fillRate = currentPlayers / maxPlayers;
    score += (1 - fillRate) * 30;
    
    // Priority 4: Prefer batches starting soon
    const startTime = batch.get("startTime");
    if (startTime) {
      const minutesUntilStart = (new Date(startTime) - new Date()) / 60000;
      if (minutesUntilStart > 0 && minutesUntilStart < 30) {
        score += 20;
      }
    }
    
    return { batch, score };
  });
  
  // Sort by score and return highest
  scoredBatches.sort((a, b) => b.score - a.score);
  return scoredBatches[0]?.batch || null;
  **/
  
  return null;
}
