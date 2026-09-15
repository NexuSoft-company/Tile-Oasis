const fs = require('fs');
let code = fs.readFileSync('src/engine/LevelResultSystem.ts', 'utf8');

const replacement = `    // Calculate stars
    let stars = 0;
    if (completed) {
      // 1. Calculate base projected stats if missing objectives
      const totalMatches = Math.floor(levelDef.tiles.length / 3);
      const projectedMaxMoves = Math.floor(totalMatches * 1.4); 
      const projectedTimeLimit = Math.floor(totalMatches * 5.0); 

      // 2. Factor in move efficiency
      const maxMoves = (levelDef.objectives as any)?.maxMoves || (levelDef.objectives?.find(o => o.type === 'move_limit') as any)?.maxMoves || projectedMaxMoves;
      let moveEfficiency = 1;
      if (maxMoves > 0) {
        const remainingMoves = Math.max(0, maxMoves - session.state.movesUsed);
        moveEfficiency = 1 + (remainingMoves / maxMoves); // max 2.0x
      }

      // 3. Factor in time efficiency
      const maxTime = (levelDef.objectives as any)?.timeLimitSeconds || (levelDef.objectives?.find(o => o.type === 'time_trial') as any)?.timeLimitSeconds || projectedTimeLimit;
      const timeUsed = session.getElapsedTimeSeconds();
      let timeEfficiency = 1;
      if (maxTime > 0) {
        const remainingTime = Math.max(0, maxTime - timeUsed);
        timeEfficiency = 1 + (remainingTime / maxTime); // max 2.0x
      }

      // 4. Calculate effective score
      // Total max multiplier from efficiency is ~4.0x
      const effectiveScore = Math.floor(score * moveEfficiency * timeEfficiency);

      if (levelDef.starRules) {
        stars = scoreSystem.calculateFinalStars(effectiveScore, levelDef.starRules);
      } else {
        // Dynamic fallback star calculation based on optimal score projection
        const basePointsPerMatch = 150;
        const threeStarThreshold = totalMatches * basePointsPerMatch * 3.6;
        const twoStarThreshold = totalMatches * basePointsPerMatch * 2.2;
        
        if (effectiveScore >= threeStarThreshold) {
          stars = 3;
        } else if (effectiveScore >= twoStarThreshold) {
          stars = 2;
        } else {
          stars = 1;
        }
      }
    }`;

code = code.replace(/    \/\/ Calculate stars[\s\S]*?      }\n    }/, replacement);
fs.writeFileSync('src/engine/LevelResultSystem.ts', code);
