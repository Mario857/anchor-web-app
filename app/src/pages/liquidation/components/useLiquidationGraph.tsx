import { useMemo } from 'react';
import { faker } from '@faker-js/faker';

export const useLiquidationGraph = () => {
  const labels = useMemo(() => [...Array(30).keys()], []);
  faker.seed(123);
  const data = useMemo(
    () => labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
    [labels],
  );

  return useMemo(() => {
    return {
      labels,
      data,
    };
  }, [labels, data]);
};

export const useMyLiquidationStats = () => {
  const ratio = 0.121;

  const lockedCollateralUSD = 746300;

  const poolValue = 90500;

  const lockedCollateralLUNA = 54500;

  const activeBids = 0;

  const lunaPrice = 2.35;

  return useMemo(() => {
    return {
      ratio,
      otherStats: [
        {
          title: 'Total locked Collateral Value (axlUSDC)',
          value: lockedCollateralUSD,
        },
        {
          title: 'Total Pool Value (axlUSDC)',
          value: poolValue,
        },
        {
          title: 'Total locked Collateral (LUNA)',
          value: lockedCollateralLUNA,
        },
        {
          title: 'My Total active Bids (axlUSDC)',
          value: activeBids,
        },
        {
          title: 'LUNA Price',
          value: lunaPrice,
        },
      ],
    };
  }, []);
};
