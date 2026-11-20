import React from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import TeamPublicProfileScreen from '../../screens/team/TeamPublicProfileScreen';

export default function TeamDetailByIdRoute() {
  const params = useLocalSearchParams();
  const teamId = typeof params.teamId === 'string' ? params.teamId : undefined;
  const teamName = typeof params.teamName === 'string' ? params.teamName : typeof params.name === 'string' ? params.name : undefined;

  return (
    <TeamPublicProfileScreen
      onExit={() => router.replace('/')}
      initialTeamId={teamId}
      initialTeamName={teamName}
    />
  );
}
