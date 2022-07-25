import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import ZoneModel from '@modelEntities/zone/Zone.model';
import { useTranslation } from 'react-i18next';
import { Editor, useRefreshUI } from '@components/editor';
import { InputContainer, InputWithTopLabelContainer, Label } from '@components/inputs';
import { SelectGroup } from '@components/selects';
import { ProjectData } from '@src/GlobalStateProvider';
import { DarkButton, PrimaryButton, SecondaryButton } from '@components/buttons';
import { TagWithSelection } from '@components/Tag';
import { padStr } from '@utils/PadStr';
import GroupModel from '@modelEntities/group/Group.model';

const GroupContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const MapsListContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  gap: 4px;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 8px 0 0 0;
  gap: 8px;
`;

const mapIdIndexInGroup = (mapId: number, group: GroupModel) =>
  group.customConditions.filter((condition) => condition.type === 'mapId').findIndex((condition) => condition.value === mapId);

type ZoneAddGroupEditorProps = {
  zone: ZoneModel;
  groups: ProjectData['groups'];
  onAddGroup: (group: GroupModel) => void;
  onClose: () => void;
};

export const ZoneAddGroupEditor = ({ zone, groups, onAddGroup, onClose }: ZoneAddGroupEditorProps) => {
  const { t } = useTranslation(['database_zones', 'database_groups']);
  const firstDbSymbol = Object.entries(groups)
    .map(([value, groupData]) => ({ value, index: groupData.id }))
    .filter((d) => !zone.wildGroups.includes(d.value))
    .sort((a, b) => a.index - b.index)[0].value;
  const [selectedGroup, setSelectedGroup] = useState(firstDbSymbol);
  const group = groups[selectedGroup];
  const currentEditedGroup = useMemo(() => group.clone(), [group]);
  const refreshUI = useRefreshUI();

  const onClickTag = (mapId: number) => {
    const index = mapIdIndexInGroup(mapId, currentEditedGroup);
    if (index === -1) currentEditedGroup.customConditions.push({ type: 'mapId', relationWithPreviousCondition: 'OR', value: mapId });
    else currentEditedGroup.customConditions.splice(index, 1);
  };

  return (
    <Editor type="creation" title={t('database_groups:groups')}>
      <InputContainer>
        <InputWithTopLabelContainer>
          <Label htmlFor="groups">{t('database_groups:group')}</Label>
          <GroupContainer>
            <SelectGroup dbSymbol={group.dbSymbol} onChange={(selected) => setSelectedGroup(selected.value)} rejected={zone.wildGroups} noLabel />
            <SecondaryButton disabled>{t('database_zones:create_new_group')}</SecondaryButton>
          </GroupContainer>
        </InputWithTopLabelContainer>
        {zone.maps.length !== 0 && (
          <InputWithTopLabelContainer>
            <Label htmlFor="present-on-maps">{t('database_zones:present_on_maps')}</Label>
            <MapsListContainer>
              {zone.maps
                .sort((a, b) => a - b)
                .map((id, index) => (
                  <TagWithSelection key={index} onClick={() => refreshUI(onClickTag(id))} selected={mapIdIndexInGroup(id, currentEditedGroup) !== -1}>
                    <span className="map-id">{padStr(id, 2)}</span>
                  </TagWithSelection>
                ))}
            </MapsListContainer>
          </InputWithTopLabelContainer>
        )}
        <ButtonContainer>
          <PrimaryButton onClick={() => onAddGroup(currentEditedGroup)}>{t('database_zones:add_this_group')}</PrimaryButton>
          <DarkButton onClick={onClose}>{t('database_zones:cancel')}</DarkButton>
        </ButtonContainer>
      </InputContainer>
    </Editor>
  );
};