import { urlParamEncode } from '@utils/web';

/** 输入路由参数 */
export interface InputRouterParam {
    path: string;
    name: number;
    component: () => JSX.Element;
    meta?: {
        sidebarLight?: number;
    };
}

/** 实际路由参数 */
interface RouterParam extends InputRouterParam {
    matcher: Array<{
        name: string;
        match: RegExp;
    }>;
}

/** 路由数据 */
export interface RouterData {
    router: InputRouterParam;
    params: Record<string, string>;
    query: Record<string, string>;
}

export interface ToPathParam {
    name: number;
    params?: Record<string, string | number>;
    query?: Record<string, string | number>;
}

export class RouterController {
    /** 所有路由 */
    private _routers: RouterParam[] = [];

    /** 构造函数 */
    constructor(routers: InputRouterParam[]) {
        this._routers = routers.map((data) => ({
            ...data,
            matcher: data.path.substring(1).split('/').map((path) => ({
                name: path[0] === ':' ? path.substring(1) : '',
                match: path[0] === ':' ? /.*/ : new RegExp(path),
            })),
        }));
    }

    get current() {
        return this.findRouterByPath(location.pathname)!;
    }

    private matchRouter(basepath: string) {
        const pathSplit = basepath.substring(1).split('/');

        const router = this._routers.find(({ matcher }) => {
            if (pathSplit.length !== matcher.length) {
                return false;
            }

            return matcher.every((match, i) => {
                return match.match.test(pathSplit[i]);
            });
        });

        return router;
    }

    private getParams(basepath: string, router: RouterParam) {
        const pathSplit = basepath.substring(1).split('/');
        const params: Record<string, string> = {};

        router.matcher.forEach((matcher, i) => {
            if (matcher.name.length > 0) {
                params[matcher.name] = pathSplit[i];
            }
        });

        return params;
    }

    toPath(data: ToPathParam) {
        const router = this._routers.find(({ name }) => name === data.name);

        if (!router) {
            return '';
        }

        let path = router.path;

        if (data.params) {
            Object.entries(data.params).forEach(([key, value]) => {
                const match = new RegExp(`:${key}`);
                path = path.replace(match, String(value));
            });
        }

        if (data.query) {
            path += urlParamEncode(data.query);
        }

        return path;
    }

    findRouterByPath(path: string): RouterData | undefined {
        const router = this.matchRouter(path);

        if (!router) {
            return;
        }

        return {
            router,
            params: this.getParams(path, router),
            query: {},
        };
    }

    findRouterByName(name: number): InputRouterParam | undefined {
        return this._routers.find((item) => item.name === name);
    }
}
