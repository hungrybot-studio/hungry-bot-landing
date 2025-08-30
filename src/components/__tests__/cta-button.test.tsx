import { render, screen, fireEvent } from '@testing-library/react';
import { CTAButton } from '../cta-button';

// Mock analytics
jest.mock('@/lib/analytics', () => ({
  trackCTAClick: jest.fn(),
}));

describe('CTAButton', () => {
  const defaultProps = {
    buttonText: 'Test Button',
    location: 'test_location',
    children: 'Test Button',
  };

  it('renders button with correct text', () => {
    render(<CTAButton {...defaultProps} />);
    expect(screen.getByRole('button', { name: 'Test Button' })).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<CTAButton {...defaultProps} onClick={handleClick} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies correct variant classes', () => {
    const { rerender } = render(<CTAButton {...defaultProps} variant="primary" />);
    expect(screen.getByRole('button')).toHaveClass('bg-primary-600');

    rerender(<CTAButton {...defaultProps} variant="secondary" />);
    expect(screen.getByRole('button')).toHaveClass('border-primary-600');

    rerender(<CTAButton {...defaultProps} variant="ghost" />);
    expect(screen.getByRole('button')).toHaveClass('bg-transparent');
  });

  it('applies correct size classes', () => {
    const { rerender } = render(<CTAButton {...defaultProps} size="sm" />);
    expect(screen.getByRole('button')).toHaveClass('px-4 py-2 text-sm');

    rerender(<CTAButton {...defaultProps} size="lg" />);
    expect(screen.getByRole('button')).toHaveClass('px-8 py-4 text-lg');
  });

  it('is disabled when disabled prop is true', () => {
    render(<CTAButton {...defaultProps} disabled />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('has correct data attributes', () => {
    render(<CTAButton {...defaultProps} />);
    const button = screen.getByRole('button');
    
    expect(button).toHaveAttribute('data-analytics', 'cta_click');
    expect(button).toHaveAttribute('data-button-text', 'Test Button');
    expect(button).toHaveAttribute('data-location', 'test_location');
  });

  it('renders with custom className', () => {
    render(<CTAButton {...defaultProps} className="custom-class" />);
    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });
});
