import React from 'react';
import { Engine } from '../models';

export const EngineContext = React.createContext<Engine>(new Engine({}))
