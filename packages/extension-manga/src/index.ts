import { ListCover } from './list-cover';
import { from } from './utils';

const Manga: panda.Extension = {
    name: 'manga',
    from,
    ListCover,
};

export default Manga;
