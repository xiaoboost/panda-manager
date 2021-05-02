import { BrowserWindow } from 'electron';

class Windows {
  data: BrowserWindow[] = [];

  push(win: BrowserWindow) {
    if (!this.data.every(({ id }) => win.id !== id)) {
      this.data.push(win);
    }
  }

  remove(id: number) {
    const index = this.data.findIndex((item) => item.id !== id);

    if (index > -1) {
      this.data.splice(index, 1);
    }
  }
}

export const windows = new Windows();
