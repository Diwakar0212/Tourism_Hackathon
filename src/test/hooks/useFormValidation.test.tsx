import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useFormValidation, validationRules } from '../../components/forms';

describe('useFormValidation Hook', () => {
  const initialValues = {
    email: '',
    name: '',
    age: '',
  };

  const rules = {
    email: (value: string) => {
      if (!value) return 'Email is required';
      if (!value.includes('@')) return 'Invalid email';
      return null;
    },
    name: validationRules.required,
    age: validationRules.number,
  };

  it('initializes with correct values', () => {
    const { result } = renderHook(() => 
      useFormValidation(initialValues, rules)
    );

    expect(result.current.values).toEqual(initialValues);
    expect(result.current.errors).toEqual({});
    expect(result.current.touched).toEqual({});
  });

  it('updates values correctly', () => {
    const { result } = renderHook(() => 
      useFormValidation(initialValues, rules)
    );

    act(() => {
      result.current.setValue('email', 'test@example.com');
    });

    expect(result.current.values.email).toBe('test@example.com');
  });

  it('validates all fields correctly', () => {
    const { result } = renderHook(() => 
      useFormValidation(initialValues, rules)
    );

    act(() => {
      const isValid = result.current.validateAll();
      expect(isValid).toBe(false);
    });

    expect(result.current.errors.email).toBe('Email is required');
    expect(result.current.errors.name).toBe('This field is required');
  });

  it('clears errors when field value changes', () => {
    const { result } = renderHook(() => 
      useFormValidation(initialValues, rules)
    );

    act(() => {
      result.current.validateAll();
    });

    expect(result.current.errors.email).toBeTruthy();

    act(() => {
      result.current.setValue('email', 'test@example.com');
    });

    expect(result.current.errors.email).toBeUndefined();
  });

  it('resets form correctly', () => {
    const { result } = renderHook(() => 
      useFormValidation(initialValues, rules)
    );

    act(() => {
      result.current.setValue('email', 'test@example.com');
      result.current.validateAll();
    });

    act(() => {
      result.current.resetForm();
    });

    expect(result.current.values).toEqual(initialValues);
    expect(result.current.errors).toEqual({});
    expect(result.current.touched).toEqual({});
  });
});

describe('Validation Rules', () => {
  describe('required', () => {
    it('returns error for empty values', () => {
      expect(validationRules.required('')).toBe('This field is required');
      expect(validationRules.required('  ')).toBe('This field is required');
      expect(validationRules.required(null)).toBe('This field is required');
      expect(validationRules.required(undefined)).toBe('This field is required');
    });

    it('returns null for valid values', () => {
      expect(validationRules.required('valid')).toBeNull();
      expect(validationRules.required('  valid  ')).toBeNull();
    });
  });

  describe('email', () => {
    it('returns error for invalid emails', () => {
      expect(validationRules.email('invalid')).toBe('Please enter a valid email address');
      expect(validationRules.email('test@')).toBe('Please enter a valid email address');
      expect(validationRules.email('@domain.com')).toBe('Please enter a valid email address');
    });

    it('returns null for valid emails', () => {
      expect(validationRules.email('test@example.com')).toBeNull();
      expect(validationRules.email('user.name+tag@domain.co.uk')).toBeNull();
    });

    it('returns null for empty values', () => {
      expect(validationRules.email('')).toBeNull();
    });
  });

  describe('minLength', () => {
    const minLength5 = validationRules.minLength(5);

    it('returns error for short values', () => {
      expect(minLength5('1234')).toBe('Must be at least 5 characters');
    });

    it('returns null for valid lengths', () => {
      expect(minLength5('12345')).toBeNull();
      expect(minLength5('123456')).toBeNull();
    });

    it('returns null for empty values', () => {
      expect(minLength5('')).toBeNull();
    });
  });

  describe('number', () => {
    it('returns error for non-numbers', () => {
      expect(validationRules.number('abc')).toBe('Please enter a valid number');
      expect(validationRules.number('12abc')).toBe('Please enter a valid number');
    });

    it('returns null for valid numbers', () => {
      expect(validationRules.number('123')).toBeNull();
      expect(validationRules.number('123.45')).toBeNull();
      expect(validationRules.number('-123')).toBeNull();
    });

    it('returns null for empty values', () => {
      expect(validationRules.number('')).toBeNull();
    });
  });
});
