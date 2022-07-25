import React, { createContext, ReactChild, useContext, useEffect, useRef, useState } from 'react';

type LoaderTitle = 'creating_project' | 'importing_project' | 'saving_project' | 'loading_project' | 'updating_psdk';
type LoaderErrorTitle =
  | 'creating_project_error'
  | 'importing_project_error'
  | 'saving_project_error'
  | 'loading_project_error'
  | 'updating_psdk_error';

type LoaderState = {
  thingInProgress: LoaderTitle;
  step: number;
  total: number;
  stepText: string;
  errorTitle?: LoaderErrorTitle;
  errorText: string;
  isOpen: boolean;
};

export type LoaderContext = LoaderState & {
  close: () => void;
  open: (thingInProgress: LoaderTitle, step: number, total: number, stepText: string) => void;
  setProgress: (step: number, total: number, stepText: string) => void;
  setError: (errorTitle: LoaderErrorTitle, errorText: string) => void;
};

const LoaderContextHolder = createContext<LoaderContext>({
  thingInProgress: 'creating_project',
  step: 0,
  total: 0,
  stepText: '',
  errorTitle: undefined,
  errorText: '',
  isOpen: false,
  close: () => null,
  open: (_thingInProgress: LoaderTitle, _step: number, _total: number, _stepText: string) => null,
  setProgress: (_step: number, _total: number, _stepText: string) => null,
  setError: (_errorTitle: LoaderErrorTitle, _errorText: string) => null,
});

export const useLoaderContext = () => useContext(LoaderContextHolder);

// Hook to use when you execute function that takes time and needs to have the most updated version of the loader context
export const useLoaderRef = () => {
  const loaderContext = useLoaderContext();
  const loaderContextRef = useRef(loaderContext);

  useEffect(() => {
    loaderContextRef.current = loaderContext;
  }, [loaderContext]);

  return loaderContextRef;
};

const useLoaderContextService = (): LoaderContext => {
  const [loaderState, setLoaderState] = useState<LoaderState>({
    thingInProgress: 'creating_project',
    step: 0,
    total: 0,
    stepText: '',
    errorTitle: undefined,
    errorText: '',
    isOpen: false,
  });

  return {
    ...loaderState,
    close: () => setLoaderState({ ...loaderState, isOpen: false }),
    open: (thingInProgress: LoaderTitle, step: number, total: number, stepText: string) =>
      setLoaderState({
        ...loaderState,
        thingInProgress,
        step,
        total,
        stepText,
        errorTitle: undefined,
        errorText: '',
        isOpen: true,
      }),
    setProgress: (step: number, total: number, stepText: string) =>
      setLoaderState({
        ...loaderState,
        step,
        total,
        stepText,
      }),
    setError: (errorTitle: LoaderErrorTitle, errorText: string) =>
      setLoaderState({
        ...loaderState,
        errorTitle,
        errorText,
      }),
  };
};

export const LoaderContextProvider = ({ children }: { children: ReactChild }) => {
  const loaderContext = useLoaderContextService();
  return <LoaderContextHolder.Provider value={loaderContext}>{children}</LoaderContextHolder.Provider>;
};