import React, { useMemo } from 'react';
import { Editor, useRefreshUI } from '@components/editor';

import { TFunction, useTranslation } from 'react-i18next';
import { Input, InputContainer, InputWithTopLabelContainer, Label, MultiLineInput } from '@components/inputs';
import { SelectCustomSimple } from '@components/SelectCustom';
import QuestModel, { QuestCategories, QuestResolution, QuestResolutions } from '@modelEntities/quest/Quest.model';

const questCategoryEntries = (t: TFunction<'database_quests'>) => QuestCategories.map((category) => ({ value: category, label: t(category) }));

const questResolutionEntries = (t: TFunction<'database_quests'>) =>
  QuestResolutions.map((resolution) => ({ value: resolution, label: t(resolution) }));

type QuestFrameEditorProps = {
  quest: QuestModel;
};

export const QuestFrameEditor = ({ quest }: QuestFrameEditorProps) => {
  const { t } = useTranslation('database_quests');
  const categoryOptions = useMemo(() => questCategoryEntries(t), [t]);
  const resolutionOptions = useMemo(() => questResolutionEntries(t), [t]);
  const refreshUI = useRefreshUI();

  return (
    <Editor type="edit" title={t('informations')}>
      <InputContainer>
        <InputWithTopLabelContainer>
          <Label htmlFor="name" required>
            {t('quest_name')}
          </Label>
          <Input
            type="text"
            name="name"
            value={quest.name()}
            onChange={(event) => refreshUI(quest.setName(event.target.value))}
            placeholder={t('example_name')}
          />
        </InputWithTopLabelContainer>
        <InputWithTopLabelContainer>
          <Label htmlFor="select-category">{t('category')}</Label>
          <SelectCustomSimple
            id="select-category"
            options={categoryOptions}
            onChange={(value) => refreshUI((quest.isPrimary = value === 'primary'))}
            value={quest.isPrimary ? 'primary' : 'secondary'}
            noTooltip
          />
        </InputWithTopLabelContainer>
        {/* <InputWithTopLabelContainer>
          <Label htmlFor="select-resolution">{t('resolution')}</Label>
          <SelectCustomSimple
            id="select-resolution"
            options={resolutionOptions}
            onChange={(value) => refreshUI((quest.resolution = value as QuestResolution))}
            value={quest.resolution}
            noTooltip
          />
        </InputWithTopLabelContainer> */}
        <InputWithTopLabelContainer>
          <Label htmlFor="descr">{t('description')}</Label>
          <MultiLineInput
            id="descr"
            value={quest.descr()}
            onChange={(event) => refreshUI(quest.setDescr(event.target.value))}
            placeholder={t('example_descr')}
          />
        </InputWithTopLabelContainer>
      </InputContainer>
    </Editor>
  );
};