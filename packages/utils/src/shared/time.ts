export function format(time: number, format: string) {
    const date = new Date(time);
    const year = String(date.getFullYear());
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    const second = String(date.getSeconds()).padStart(2, '0');

    return (
        format
            .replace('yyyy', year)
            .replace('MM', month)
            .replace('dd', day)
            .replace('hh', hour)
            .replace('mm', minute)
            .replace('ss', second)
    );
}
