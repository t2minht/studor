import { ActionIcon, useMantineColorScheme, useComputedColorScheme } from '@mantine/core';
import { IconSun, IconMoon } from '@tabler/icons-react';
import cx from 'clsx';
import classes from './lightordarkmode.module.css';
import classes2 from './navbar.module.css';

// Mantine component that allows for toggling between light and dark mode for all pages
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
      <IconSun className={cx(classes.icon, classes.light)} stroke={1.5} />
      <IconMoon className={cx(classes.icon, classes.dark)} stroke={1.5} />
    </ActionIcon>
  );
}