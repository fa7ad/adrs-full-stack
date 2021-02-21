import { createContext, useContext, useEffect, useState } from 'react';

type PageTitleState = Tuple3<string, string, React.Dispatch<React.SetStateAction<string>> | ((val: string) => void)>;

function _log(val: string) {
  return console.log('Page Title: ', val);
}

export function useTitle(): PageTitleState {
  const [title, setTitle] = useState('');
  return [[title || 'Home', 'ADRS Next'].join(' | '), title, setTitle];
}

export const PageTitleCtx: React.Context<PageTitleState> = createContext(['', '', _log]);

export function usePageTitle(): PageTitleState {
  return useContext(PageTitleCtx);
}

export function usePageTitleEffect(title: string = '') {
  const [, , setTitle] = usePageTitle();

  return useEffect(() => {
    setTitle(title);
  }, [setTitle]);
}
