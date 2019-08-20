import { LocationState } from 'history';
import { useContext, useEffect } from 'react';
import { __RouterContext, RouteComponentProps, StaticContext } from 'react-router';

import useForceUpdate from './use-force-update';

const INCORRECT_VERSION_ERROR = new Error('use-react-router may only be used with react-router@^5.');
const MISSING_CONTEXT_ERROR = new Error('useReactRouter may only be called within a <Router /> context.');

export default function useRouter<
    P extends { [K in keyof P]?: string } = {},
    C extends StaticContext = StaticContext,
    S = LocationState,
>(): RouteComponentProps<P, C, S> {
    // 检测 react router 的版本
    if (!__RouterContext) {
        throw INCORRECT_VERSION_ERROR;
    }

    // 此函数必须是 <Router /> 的子元素 
    const context = useContext<RouteComponentProps<P, C, S>>(
        __RouterContext as any,
    );

    if (!context) {
        throw MISSING_CONTEXT_ERROR;
    }

    const forceUpdate = useForceUpdate();

    useEffect(
        () => context.history.listen(forceUpdate),
        [context],
    );

    return context;
}
