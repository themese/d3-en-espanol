import React from 'react';
import { VerticalBarChart } from './components/bar_chart_vertical';
import { HorizontalBarChart } from './components/bar_chart_horizontal';
import { IndexPage } from './components/index_page';

const routes = {
    '/': () => <IndexPage />,
    '/vertical': () => <VerticalBarChart />,
    '/horizontal': () => <HorizontalBarChart />,
};

export default routes;
