const groupBy = function(xs: any[], key: string) {
    return xs.reduce(function(rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
    }, {});
};

const toSorted = function(xs: any[], fn?: (a: any, b: any) => number): any[] {
    xs.sort(fn);
    return xs;
}

export {
    groupBy,
    toSorted,
};