interface HashMap {
    [index: number]: boolean;
}

/** 全局 id 记录 */
const Map: AnyObject<IdMap> = {};

/** id 类 */
class IdMap {
    /** id 映射表 */
    private map: HashMap = {};
    /** 当前最小空闲值 */
    private minIndex = 1;

    createId() {
        const current = this.minIndex++;

        while (this.map[this.minIndex]) {
            this.minIndex++;
        }

        this.map[current] = true;

        return current;
    }

    deleteId(id: number) {
        if (!this.map[id]) {
            return;
        }

        delete this.map[id];

        this.minIndex = id;
    }
}

/** 创建 ID */
export function createId(namespace = 'default') {
    if (!Map[namespace]) {
        Map[namespace] = new IdMap();
    }

    return Map[namespace].createId();
}

/** 删除某个域下的 ID */
export function deleteId(namespace = 'default', id: number) {
    if (!Map[namespace]) {
        return;
    }

    Map[namespace].deleteId(id);
}
