import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelectOptions } from '@utils/useSelectOptions';
import { StudioDropDown } from '@components/StudioDropDown';
import { SelectContainerWithLabel } from './SelectContainerWithLabel';
import styled from 'styled-components';
import { Select } from '@ds/Select';
import { DbSymbol } from '@modelEntities/dbSymbol';
import { SelectOption } from '@ds/Select/types';

export const BreakableSpan = styled.span<{ breakpoint?: string }>`
  @media ${({ theme, breakpoint }) => (breakpoint ? breakpoint : theme.breakpoints.dataBox422)} {
    & {
      display: none;
    }
  }
`;

type SelectPokemonProps = {
  dbSymbol: string;
  onChange: (dbSymbol: string) => void;
  undefValueOption?: string;
  breakpoint?: string;
  noLabel?: boolean;
};

export const SelectPokemon = ({ dbSymbol, onChange, breakpoint, noLabel, undefValueOption }: SelectPokemonProps) => {
  const { t } = useTranslation('database_pokemon');
  const creatureOptions = useSelectOptions('creatures');
  const options = useMemo(() => {
    if (undefValueOption) return [{ value: '__undef__', label: undefValueOption }, ...creatureOptions];
    return creatureOptions;
  }, [creatureOptions, undefValueOption]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const optionals = useMemo(() => ({ deletedOption: t('pokemon_deleted') }), []);

  if (noLabel) return <StudioDropDown value={dbSymbol} options={options} onChange={onChange} optionals={optionals} />;

  return (
    <SelectContainerWithLabel>
      <BreakableSpan breakpoint={breakpoint}>{t('pokemon')}</BreakableSpan>
      <StudioDropDown value={dbSymbol} options={options} onChange={onChange} optionals={optionals} />
    </SelectContainerWithLabel>
  );
};

type SelectPokemon2Props = {
  name: string;
  defaultValue?: DbSymbol;
  onChange?: (v: DbSymbol) => void;
};

export const SelectPokemon2 = (props: SelectPokemon2Props) => {
  const { t } = useTranslation('database_pokemon');
  const creatureOptions = useSelectOptions('creatures') as SelectOption<DbSymbol>[];

  return <Select options={creatureOptions} notFoundLabel={t('pokemon_deleted')} chooseValue="__undef__" {...props} />;
};
