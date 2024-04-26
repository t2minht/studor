import { ActionIcon, useMantineColorScheme, useComputedColorScheme } from '@mantine/core';
import { IconSun, IconMoon } from '@tabler/icons-react';
import cx from 'clsx';
import classes from './lightordarkmode.module.css';
import classes2 from './navbar.module.css';

export default function LightOrDarkMode() {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });

  return (
    <ActionIcon className={classes2.element}
      onClick={() => setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')}
      variant="subtle"
      size="lg"
      radius="xl"
      color="rgba(255, 255, 255, 1)"
      aria-label="Toggle color scheme"
    >
      <IconSun data-testid="Sun icon" className={cx(classes.icon, classes.light)} stroke={1.5} />
      <IconMoon data-testid="Moon icon" className={cx(classes.icon, classes.dark)} stroke={1.5} />
    </ActionIcon>
  );
}