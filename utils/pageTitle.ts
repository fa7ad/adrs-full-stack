import { createContext, useContext, useState } from 'react';

type PageTitleState = Tuple<string, React.Dispatch<React.SetStateAction<string>> | ((val: string) => void)>;

function _log(val: string) {
  return console.log('Page Title: ', val);
}
export function useTitle(): PageTitleState {
  const [title, setTitle] = useState('');
  return [[title || 'Home', 'ADRS Next'].join(' | '), setTitle];
}

export const PageTitleCtx: React.Context<PageTitleState> = createContext(['', _log]);

export function useSetPageTitle(): PageTitleState[1] {
  return useContext(PageTitleCtx)[1];
}
