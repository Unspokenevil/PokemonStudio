import React, { useState } from 'react';
import styled from 'styled-components';
import { Editor, useRefreshUI } from '@components/editor';
import { useTranslation } from 'react-i18next';
import { Input, InputContainer, InputWithTopLabelContainer, Label } from '@components/inputs';
import { ToolTip, ToolTipContainer } from '@components/Tooltip';
import { DarkButton, PrimaryButton } from '@components/buttons';
import { useConfigLanguage } from '@utils/useProjectConfig';

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 8px 0 0 0;
  gap: 8px;
`;

const CodeInfoContainer = styled.span`
  ${({ theme }) => theme.fonts.normalSmall}
  color: ${({ theme }) => theme.colors.text400};
`;

const CodeErrorContainer = styled.span`
  ${({ theme }) => theme.fonts.normalSmall}
  color: ${({ theme }) => theme.colors.dangerBase};
`;

type LanguageDefaultValue = {
  text: string;
  code: string;
};

type DashboardLanguageNewEditorProps = {
  defaultValue: LanguageDefaultValue;
  onClose: () => void;
  onCloseNew: () => void;
};

export const DashboardLanguageNewEditor = ({ defaultValue, onClose, onCloseNew }: DashboardLanguageNewEditorProps) => {
  const { projectConfigValues: language, setProjectConfigValues: setLanguage } = useConfigLanguage();
  const [languageText, setLanguageText] = useState<LanguageDefaultValue>(defaultValue);
  const { t } = useTranslation('dashboard_language');
  const refreshUI = useRefreshUI();

  const onClickNew = () => {
    const currentEditedLanguage = language.clone();
    currentEditedLanguage.choosableLanguageTexts.push(languageText.text);
    currentEditedLanguage.choosableLanguageCode.push(languageText.code);
    setLanguage(currentEditedLanguage);
    onCloseNew();
  };

  const onChangePrefix = (event: React.ChangeEvent<HTMLInputElement>) => {
    const prefix = event.target.value.toLocaleLowerCase();
    if (prefix.length >= 5) return event.preventDefault();

    setLanguageText({ ...languageText, code: prefix });
  };

  const isCodeUnique = () => language.choosableLanguageCode.find((code) => code === languageText.code) === undefined;
  const checkDisabled = () => languageText.text === '' || languageText.code === '' || !isCodeUnique();

  return (
    <Editor type="creation" title={t('supported_languages')}>
      <InputContainer>
        <InputWithTopLabelContainer>
          <Label htmlFor="language-text" required>
            {t('language')}
          </Label>
          <Input
            type="text"
            name="language-text"
            value={languageText.text}
            onChange={(event) => refreshUI(setLanguageText({ ...languageText, text: event.target.value }))}
            placeholder={t('placeholder_language')}
          />
        </InputWithTopLabelContainer>
        <InputWithTopLabelContainer>
          <Label htmlFor="language-prefix" required>
            {t('prefix')}
          </Label>
          <Input
            type="text"
            name="language-prefix"
            value={languageText.code}
            onChange={(event) => refreshUI(onChangePrefix(event))}
            error={!isCodeUnique()}
            placeholder={t('placeholder_prefix')}
          />
          {!isCodeUnique() && <CodeErrorContainer>{t('code_error')}</CodeErrorContainer>}
          <CodeInfoContainer>{t('code_info')}</CodeInfoContainer>
        </InputWithTopLabelContainer>
        <ButtonContainer>
          <ToolTipContainer>
            {checkDisabled() && <ToolTip bottom="100%">{t('fields_asterisk_required')}</ToolTip>}
            <PrimaryButton onClick={onClickNew} disabled={checkDisabled()}>
              {t('add_language')}
            </PrimaryButton>
          </ToolTipContainer>
          <DarkButton onClick={onClose}>{t('cancel')}</DarkButton>
        </ButtonContainer>
      </InputContainer>
    </Editor>
  );
};