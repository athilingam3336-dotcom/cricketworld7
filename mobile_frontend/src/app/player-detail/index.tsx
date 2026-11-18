import React from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import PlayerPublicProfileScreen from '../../screens/player/PlayerPublicProfileScreen';

export default function PlayerDetailRoute() {
  const params = useLocalSearchParams();
  const playerId = typeof params.playerId === 'string' ? params.playerId : typeof params.id === 'string' ? params.id : undefined;
  const playerName = typeof params.playerName === 'string' ? params.playerName : typeof params.name === 'string' ? params.name : undefined;

  return (
    <PlayerPublicProfileScreen
      onExit={() => router.replace('/')}
      initialPlayerId={playerId}
      initialPlayerName={playerName}
    />
  );
}
