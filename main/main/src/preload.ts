import electron from 'electron';
import path from 'path';

(global as any).require = (name: string) => {
  switch (name) {
    case 'electron': {
      return electron;
    }
    case 'path': {
      return path;
    }
    default: {
      return {};
    }
  }
};
