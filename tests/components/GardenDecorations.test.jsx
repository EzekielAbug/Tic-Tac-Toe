import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import GardenDecorations from '@/components/garden/GardenDecorations';

describe('GardenDecorations Component', () => {
  it('renders garden fence and lawn flowers', () => {
    const { container } = render(<GardenDecorations isNight={false} />);
    expect(container.querySelector('.garden-fence')).toBeDefined();
    expect(container.querySelector('.garden-lawn-flowers')).toBeDefined();
    // No fireflies during daytime
    expect(container.querySelector('.fireflies-container')).toBeNull();
  });

  it('renders fireflies container only in night mode', () => {
    const { container } = render(<GardenDecorations isNight={true} />);
    expect(container.querySelector('.fireflies-container')).toBeDefined();
    expect(container.querySelectorAll('.firefly').length).toBeGreaterThan(0);
  });
});
