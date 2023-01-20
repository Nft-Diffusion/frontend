import { createContext } from 'react';
import { Web3Client } from './types';

export const Context = createContext<Web3Client | undefined>(undefined);

export default Context;