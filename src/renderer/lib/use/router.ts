import { LocationState } from 'history';
import { Context, useContext, useEffect, useCallback, useState } from 'react';
import { __RouterContext, RouteComponentProps, StaticContext } from 'react-router';

const INCORRECT_VERSION_ERROR = new Error('use-react-router may only be used with react-router@^5.');
const MISSING_CONTEXT_ERROR = new Error('useReactRouter may only be called within a <Router /> context.');

export function useForceUpdate(): () => void {
    const [ , dispatch] = useState<{}>(Object.create(null));

    // Turn dispatch(required_parameter) into dispatch().
    const memoizedDispatch = useCallback(
        () => dispatch(Object.create(null)),
        [dispatch],
    );

    return memoizedDispatch;
}

export function useRouter<
    P extends { [K in keyof P]?: string } = {},
    C extends StaticContext = StaticContext,
    S = LocationState,
>(): RouteComponentProps<P, C, S> {
    // If this version of react-router does not support Context,
    if (!__RouterContext) {
        throw INCORRECT_VERSION_ERROR;
    }

    // If the react-router Context is not a parent Component,
    const context = useContext<RouteComponentProps<P, C, S>>(
        __RouterContext as any,
    );

    if (!context) {
        throw MISSING_CONTEXT_ERROR;
    }

    const forceUpdate: VoidFunction = useForceUpdate();

    useEffect(
        (): VoidFunction => context.history.listen(forceUpdate),
        [context],
    );

    return context;
}
