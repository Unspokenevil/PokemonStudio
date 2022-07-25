import React from 'react';
import { DatabasePageStyle } from '@components/database/DatabasePageStyle';
import { DataBlockWithTitleNoActive, DataBlockWrapper } from '@components/database/dataBlocks';
import { AbilityControlBar, AbilityPokemonTable } from '@components/database/ability';
import { SelectOption } from '@components/SelectCustom/SelectCustomPropsInterface';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { PageContainerStyle, PageDataConstrainerStyle } from './PageContainerStyle';
import { SubPageTitle } from '@components/database/SubPageTitle';
import { useProjectData } from '@utils/useProjectData';

export const AbilityPokemonPage = () => {
  const { projectDataValues: abilities, selectedDataIdentifier: abilityDbSymbol, setSelectedDataIdentifier } = useProjectData('abilities', 'ability');
  const { t } = useTranslation('database_abilities');
  const history = useHistory();
  const ability = abilities[abilityDbSymbol];

  const onChange = (selected: SelectOption) => {
    setSelectedDataIdentifier({ ability: selected.value });
  };
  const onClickedBack = () => history.push('database/abilities');

  return (
    <DatabasePageStyle>
      <AbilityControlBar onChange={onChange} ability={ability} />
      <PageContainerStyle>
        <PageDataConstrainerStyle>
          <DataBlockWrapper>
            <SubPageTitle title={t('pokemon_with_ability', { ability: ability.name() })} onClickedBack={onClickedBack} />
            <DataBlockWithTitleNoActive title={t('pokemon_with_ability', { ability: ability.name() })} size="full">
              <AbilityPokemonTable ability={ability} />
            </DataBlockWithTitleNoActive>
          </DataBlockWrapper>
        </PageDataConstrainerStyle>
      </PageContainerStyle>
    </DatabasePageStyle>
  );
};