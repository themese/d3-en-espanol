import * as d3 from 'd3';

export function createScale(scaleType: "linear" | "date" | "ordinal" | "band" | "point", domain: Array<any>, range: Array<any>) {
    switch (scaleType) {
        case "band":
            return createBandScale(domain, range);
        case "date":
            return createDateScale(domain, range);
        case "linear":
            return createLinearScale(domain, range);
        case "ordinal":
            return createOrdinalScale(domain, range);
        case "point":
            return createPointScale(domain, range);
    }
}

function createLinearScale(domain: Array<any>, range: Array<any>) {
    return d3.scaleLinear()
        .domain(domain)
        .range(range)
        .nice(10);
}

function createDateScale(domain: Array<any>, range: Array<any>) {
    return d3.scaleLinear()
        .domain(domain)
        .range(range);
}

function createOrdinalScale(domain: Array<any>, range: Array<any>) {
    return d3.scaleOrdinal()
        .domain(domain)
        .range(range);
}

function createBandScale(domain: Array<any>, range: Array<any>) {
    return d3.scaleBand()
        .domain(domain)
        // @ts-ignore
        .range(range)
        .align(1)
        .paddingOuter(0);
}

function createPointScale(domain: Array<any>, range: Array<any>) {
    return d3.scalePoint()
        .domain(domain)
        // @ts-ignore
        .range(range);
}