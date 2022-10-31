import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { screen } from 'env';

import { Section } from '@libs/neumorphism-ui/components/Section';
import {
  useLiquidationGraph,
  useMyLiquidationStats,
} from './useLiquidationGraph';
import { StatsFigureCard } from './StatsFigureCard';
import { StatsDoughnutCard } from './StatsDoughnutCard';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

export interface LiquidationQueueProps {
  className?: string;
}

function Component({ className }: LiquidationQueueProps) {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  //const { connected } = useAccount();

  /*
  // ---------------------------------------------
  // queries
  // ---------------------------------------------
  const { uUST, uaUST } = useBalances();

  const { data: { moneyMarketEpochState } = {} } = useEarnEpochStatesQuery();

  // ---------------------------------------------
  // computes
  // ---------------------------------------------
  const { totalDeposit } = useMemo(() => {
    return {
      totalDeposit: computeTotalDeposit(uaUST, moneyMarketEpochState),
    };
  }, [moneyMarketEpochState, uaUST]);

  // ---------------------------------------------
  // dialogs
  // ---------------------------------------------
  const [openDepositDialog, depositDialogElement] = useDepositDialog();

  const [openWithdrawDialog, withdrawDialogElement] = useWithdrawDialog();

  const openDeposit = useCallback(async () => {
    await openDepositDialog();
  }, [openDepositDialog]);

  const openWithdraw = useCallback(async () => {
    await openWithdrawDialog();
  }, [openWithdrawDialog]);
  */

  // ---------------------------------------------
  // Graph imports
  // ---------------------------------------------

  const graphData = useLiquidationGraph();
  const chartRef = useRef(null);

  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  );

  const options = useMemo(
    () => ({
      responsive: true,
      plugins: {
        legend: {
          position: 'top' as const,
          align: 'end',
          labels: {
            usePointStyle: true,
          },
          title: { text: 'UST positions' },
        },
        title: {
          display: false,
        },
        tooltip: {
          callbacks: {
            title: (item: TooltipItem) => 'Click to Bid',
            label: (item: TooltipItem) => [
              `Premium : ${item.label}`,
              `Value : ${item.formattedValue} axlUSDC`,
            ],
          },
          displayColors: false,
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
          ticks: {
            // Include a dollar sign in the ticks
            callback: function (value, index, ticks) {
              if (value % 2 === 0) {
                return value + '%';
              }
            },
          },
        },
      },
    }),
    [],
  );

  const data = useMemo(
    () => ({
      labels: graphData.labels,
      datasets: [
        {
          label: 'Dataset 1',
          data: graphData.data,
          backgroundColor: 'cyan',
        },
      ],
    }),
    [graphData],
  );

  const [chartData, setChartData] = useState({
    datasets: [],
  });
  const [chartOptions, setChartOptions] = useState({
    plugins: {},
  });

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) {
      return;
    }
    const barGradient = chart.ctx.createLinearGradient(0, 0, 0, 500);
    barGradient.addColorStop(0, 'green');
    barGradient.addColorStop(0.5, 'cyan');
    barGradient.addColorStop(1, 'green');

    const chartData = {
      ...data,
      datasets: data.datasets.map((dataset) => ({
        ...dataset,
        backgroundColor: barGradient,
      })),
    };
    const chartOptions = {
      ...options,
      plugins: {
        ...options.plugins,
        legend: {
          ...options.plugins.legend,
          labels: {
            ...options.plugins.legend.labels,
            generateLabels: (label) => [
              {
                text: 'axlUSDC Positions',
                fillStyle: barGradient,
                strokeStyle: barGradient,
              },
            ],
          },
        },
      },
    };
    setChartData(chartData);
    setChartOptions(chartOptions);
  }, [data, options]);

  // ---------------------------------------------
  // Liquidation Stats
  // ---------------------------------------------

  const liquidationStats = useMyLiquidationStats();

  // ---------------------------------------------
  // presentation
  // ---------------------------------------------
  return (
    <Section className={className}>
      <div className="liquidation-stats-graph">
        <Bar ref={chartRef} options={chartOptions} data={chartData} />
      </div>
      <FlexContainer>
        <StatsFigureCardContainer
          className="liquidation-stats-numbers"
          elnb={liquidationStats.otherStats.length + 1}
        >
          <StatsDoughnutCard
            title="Pool Ratio"
            value={liquidationStats.ratio}
          />
        </StatsFigureCardContainer>

        <StatsFigureCardContainer
          className="liquidation-stats-numbers"
          elnb={liquidationStats.otherStats.length + 1}
        >
          {liquidationStats.otherStats.map((stat) => {
            console.log('quid');
            return (
              <StatsFigureCard title={stat.title} key={stat.title}>
                {stat.value}
              </StatsFigureCard>
            );
          })}
        </StatsFigureCardContainer>
      </FlexContainer>
    </Section>
  );
}

const FlexContainer = styled.div`
  // pc
  @media (min-width: ${screen.mobile.max}px) {
    flex-direction: row;
    display: flex;
    align-items: center;
    gap: 20px;
  }
`;

const StatsFigureCardContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: end;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;
`;

export const LiquidationQueueSection = Component;
