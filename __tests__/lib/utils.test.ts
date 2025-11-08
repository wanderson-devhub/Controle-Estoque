import { cn } from '@/lib/utils'

describe('Utility Functions', () => {
  describe('cn (className merger)', () => {
    it('should merge simple class names', () => {
      expect(cn('px-2', 'py-1')).toBe('px-2 py-1')
    })

    it('should handle object conditions', () => {
      expect(cn('px-2', { 'py-1': true })).toContain('px-2')
      expect(cn('px-2', { 'py-1': true })).toContain('py-1')
    })

    it('should exclude false conditions', () => {
      const result = cn('px-2', { 'py-1': false })
      expect(result).not.toContain('py-1')
    })

    it('should merge tailwind classes correctly', () => {
      const result = cn('px-2 py-1', 'px-4')
      // Tailwind merge should prefer the last px class
      expect(result).toContain('px-4')
    })

    it('should handle undefined and null values', () => {
      expect(cn('px-2', undefined, null)).toBe('px-2')
    })

    it('should handle empty strings', () => {
      expect(cn('px-2', '', 'py-1')).toBe('px-2 py-1')
    })

    it('should handle multiple conflicting tailwind classes', () => {
      const result = cn('text-red-500 text-blue-500')
      // Last one should win after merge
      expect(result).toContain('text-blue-500')
    })

    it('should handle variant classes', () => {
      const result = cn(
        'flex',
        {
          'flex-row': true,
          'flex-col': false,
        }
      )
      expect(result).toContain('flex')
      expect(result).toContain('flex-row')
    })

    it('should handle complex nested conditions', () => {
      const isActive = true
      const isDisabled = false

      const result = cn('btn', {
        'btn-active': isActive,
        'btn-disabled': isDisabled,
      })

      expect(result).toContain('btn')
      expect(result).toContain('btn-active')
      expect(result).not.toContain('btn-disabled')
    })

    it('should handle array inputs', () => {
      expect(cn(['px-2', 'py-1'])).toBe('px-2 py-1')
    })

    it('should handle mixed inputs', () => {
      const result = cn('px-2', ['py-1', 'text-sm'], { 'font-bold': true })
      expect(result).toContain('px-2')
      expect(result).toContain('py-1')
      expect(result).toContain('text-sm')
      expect(result).toContain('font-bold')
    })

    it('should preserve space padding', () => {
      const result = cn('p-4')
      expect(result.trim()).toBe('p-4')
    })
  })
})