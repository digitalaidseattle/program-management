/**
 *  reference/teams/index.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */


import { ListCard } from '../../components/ListCard';

import { EntityListPage } from '../../components/EntityListPage';
import { disciplineService } from '../../services/dasDisciplineService';
import { ReferenceDisciplineDetails } from '../discipline/ReferenceDisciplineDetails';

const ReferenceDisciplinesPage = () => {

  return (
    <EntityListPage
      title={'Disciplines'}
      fetchData={() => disciplineService.getAll()
        .then(disciplines => disciplines.sort((d1, d2) => d1.name.localeCompare(d2.name)))}
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
