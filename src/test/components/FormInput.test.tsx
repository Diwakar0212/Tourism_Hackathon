import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import FormInput from '../../components/forms/FormInput';

describe('FormInput Component', () => {
  it('renders with label', () => {
    render(
      <FormInput
        label="Email"
        value=""
        onChange={() => {}}
      />
    );
    
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('shows required indicator when required', () => {
    render(
      <FormInput
        label="Email"
        value=""
        onChange={() => {}}
        required
      />
    );
    
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('displays error message', () => {
    render(
      <FormInput
        label="Email"
        value=""
        onChange={() => {}}
        error="This field is required"
      />
    );
    
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('displays helper text when no error', () => {
    render(
      <FormInput
        label="Email"
        value=""
        onChange={() => {}}
        helperText="Enter your email address"
      />
    );
    
    expect(screen.getByText('Enter your email address')).toBeInTheDocument();
  });

  it('calls onChange when value changes', () => {
    const handleChange = vi.fn();
    render(
      <FormInput
        label="Email"
        value=""
        onChange={handleChange}
      />
    );
    
    const input = screen.getByLabelText('Email');
    fireEvent.change(input, { target: { value: 'test@example.com' } });
    
    expect(handleChange).toHaveBeenCalledWith('test@example.com');
  });

  it('shows password toggle for password input', () => {
    render(
      <FormInput
        label="Password"
        type="password"
        value="secret"
        onChange={() => {}}
      />
    );
    
    const input = screen.getByLabelText('Password');
    expect(input).toHaveAttribute('type', 'password');
    
    // Should show eye icon for password toggle
    const toggleButton = screen.getByRole('button');
    expect(toggleButton).toBeInTheDocument();
  });

  it('toggles password visibility', () => {
    render(
      <FormInput
        label="Password"
        type="password"
        value="secret"
        onChange={() => {}}
      />
    );
    
    const input = screen.getByLabelText('Password');
    const toggleButton = screen.getByRole('button');
    
    expect(input).toHaveAttribute('type', 'password');
    
    fireEvent.click(toggleButton);
    expect(input).toHaveAttribute('type', 'text');
    
    fireEvent.click(toggleButton);
    expect(input).toHaveAttribute('type', 'password');
  });

  it('is disabled when disabled prop is true', () => {
    render(
      <FormInput
        label="Email"
        value=""
        onChange={() => {}}
        disabled
      />
    );
    
    const input = screen.getByLabelText('Email');
    expect(input).toBeDisabled();
  });

  it('shows character count when maxLength is provided', () => {
    render(
      <FormInput
        label="Bio"
        value="Hello"
        onChange={() => {}}
        maxLength={100}
      />
    );
    
    expect(screen.getByText('5/100')).toBeInTheDocument();
  });
});
