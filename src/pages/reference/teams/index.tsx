/**
 *  reference/teams/index.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */

import { useStorageService } from '@digitalaidseattle/core';
import { PageInfo } from '@digitalaidseattle/supabase';
import { Card, CardContent, CardHeader } from '@mui/material';
import { useEffect, useState } from 'react';

import { EntityList } from '../../../components/EntityList';
import { ListCard } from '../../../components/ListCard';

import { Team, teamService } from '../../../services/dasTeamService';
import { TeamDetails } from '../../team';

const ReferenceTeamsPage = () => {
  const [pageInfo, setPageInfo] = useState<PageInfo<Team>>({ rows: [], totalRowCount: 0 });
  const storageService = useStorageService()!;

  useEffect(() => {
    teamService.getAll()
      .then(teams => setPageInfo({ rows: teams, totalRowCount: teams.length }))
  }, []);

  return (
    <Card >
      <CardHeader
        slotProps={{ title: { fontSize: 24 } }} // TODO move magic number into style constants
        title={"Teams"} />
      <CardContent sx={{ p: 0 }}>
        <EntityList
          pageInfo={pageInfo}
          listItemRenderer={entity => <ListCard
            key={entity.id}
            title={entity.name}
            avatarImageSrc={storageService.getUrl(`/icons/${entity.id}`)} />}
          detailRenderer={entity => <TeamDetails entity={entity} onChange={() => alert('nrfpt')} />}
        />
      </CardContent>
    </Card>
  );
};

export default ReferenceTeamsPage;
