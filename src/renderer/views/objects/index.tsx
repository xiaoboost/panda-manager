import * as React from 'react';

import { useEffect } from 'react';
import { toServer, EventName } from 'src/server/renderer';

export function Renderer() {
    useEffect(() => {
        toServer(EventName.GetConfig).then((data) => {
            debugger;
            console.log(data);
        });
    }, []);

    return <div>列表</div>;
}
