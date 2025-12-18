/**
 *  reference/teams/index.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */


import { ListCard } from '../../components/ListCard';

import { EntityListPage } from '../../components/EntityListPage';
import { Discipline, disciplineService } from '../../services/dasDisciplineService';
import { ReferenceDisciplineDetails } from '../discipline/ReferenceDisciplineDetails';
import { useEffect, useState } from 'react';

const ReferenceDisciplinesPage = () => {
  const [entities, setEntities] = useState<Discipline[]>([]);

  useEffect(() => {
    fetchData()
  }, []);

  async function fetchData() {
    const found = await disciplineService
      .getAll()
      .then(data => data.sort((a, b) => (a.name.localeCompare(b.name))))
    setEntities(found);
  }

  return (
    <EntityListPage
      title={'Disciplines'}
      entities={entities}
      listItemRenderer={entity =>
        <ListCard
          key={entity.id}
          title={entity.name}
          avatarImageSrc={disciplineService.getIconUrl(entity)} />}
      detailRenderer={entity =>
        <ReferenceDisciplineDetails entity={entity} />} />
  );
};

export default ReferenceDisciplinesPage;
