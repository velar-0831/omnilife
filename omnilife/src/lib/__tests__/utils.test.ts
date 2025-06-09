import {
  cn,
  formatCurrency,
  formatDate,
  formatRelativeTime,
  formatFileSize,
  isValidEmail,
  isValidPhone,
  generateId,
  debounce,
  throttle,
  deepClone,
  formatNumber,
  truncateText,
  uniqueArray,
  sleep
} from '../utils'

describe('Utils Functions', () => {
  describe('cn (className utility)', () => {
    it('combines class names correctly', () => {
      expect(cn('class1', 'class2')).toBe('class1 class2')
      expect(cn('class1', undefined, 'class2')).toBe('class1 class2')
      expect(cn('class1', false && 'class2', 'class3')).toBe('class1 class3')
    })
  })

  describe('formatCurrency', () => {
    it('formats currency correctly', () => {
      expect(formatCurrency(1234.56)).toBe('¥1,234.56')
      expect(formatCurrency(1000)).toBe('¥1,000.00')
      expect(formatCurrency(0)).toBe('¥0.00')
    })

    it('handles different currencies', () => {
      expect(formatCurrency(1234.56, 'USD')).toContain('1,234.56')
      expect(formatCurrency(1234.56, 'EUR')).toContain('1,234.56')
    })
  })

  describe('formatDate', () => {
    it('formats date correctly', () => {
      const date = new Date('2024-01-15T10:30:00Z')
      const formatted = formatDate(date)
      expect(formatted).toContain('2024')
    })

    it('handles different formats', () => {
      const date = new Date('2024-01-15T10:30:00Z')
      const shortFormat = formatDate(date, 'short')
      const longFormat = formatDate(date, 'long')
      
      expect(shortFormat).toBeDefined()
      expect(longFormat).toBeDefined()
    })
  })

  describe('formatRelativeTime', () => {
    it('formats relative time correctly', () => {
      const now = new Date()
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)
      const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000)

      expect(formatRelativeTime(oneHourAgo)).toContain('小时前')
      expect(formatRelativeTime(oneHourLater)).toContain('小时后')
    })
  })

  describe('formatFileSize', () => {
    it('formats file sizes correctly', () => {
      expect(formatFileSize(0)).toBe('0 B')
      expect(formatFileSize(1024)).toBe('1.00 KB')
      expect(formatFileSize(1024 * 1024)).toBe('1.00 MB')
      expect(formatFileSize(1024 * 1024 * 1024)).toBe('1.00 GB')
    })
  })

  describe('isValidEmail', () => {
    it('validates email addresses correctly', () => {
      expect(isValidEmail('test@example.com')).toBe(true)
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true)
      expect(isValidEmail('invalid-email')).toBe(false)
      expect(isValidEmail('test@')).toBe(false)
      expect(isValidEmail('@example.com')).toBe(false)
    })
  })

  describe('isValidPhone', () => {
    it('validates Chinese phone numbers correctly', () => {
      expect(isValidPhone('13812345678')).toBe(true)
      expect(isValidPhone('15987654321')).toBe(true)
      expect(isValidPhone('12345678901')).toBe(false)
      expect(isValidPhone('1381234567')).toBe(false)
      expect(isValidPhone('invalid')).toBe(false)
    })
  })

  describe('generateId', () => {
    it('generates unique IDs', () => {
      const id1 = generateId()
      const id2 = generateId()
      
      expect(id1).not.toBe(id2)
      expect(typeof id1).toBe('string')
      expect(id1.length).toBeGreaterThan(0)
    })

    it('generates IDs with prefix', () => {
      const id = generateId('test')
      expect(id).toMatch(/^test_/)
    })
  })

  describe('debounce', () => {
    jest.useFakeTimers()

    it('debounces function calls', () => {
      const mockFn = jest.fn()
      const debouncedFn = debounce(mockFn, 100)

      debouncedFn()
      debouncedFn()
      debouncedFn()

      expect(mockFn).not.toHaveBeenCalled()

      jest.advanceTimersByTime(100)
      expect(mockFn).toHaveBeenCalledTimes(1)
    })

    afterEach(() => {
      jest.clearAllTimers()
    })
  })

  describe('throttle', () => {
    jest.useFakeTimers()

    it('throttles function calls', () => {
      const mockFn = jest.fn()
      const throttledFn = throttle(mockFn, 100)

      throttledFn()
      throttledFn()
      throttledFn()

      expect(mockFn).toHaveBeenCalledTimes(1)

      jest.advanceTimersByTime(100)
      throttledFn()
      expect(mockFn).toHaveBeenCalledTimes(2)
    })

    afterEach(() => {
      jest.clearAllTimers()
    })
  })

  describe('deepClone', () => {
    it('clones objects deeply', () => {
      const original = {
        a: 1,
        b: {
          c: 2,
          d: [3, 4, { e: 5 }]
        }
      }

      const cloned = deepClone(original)

      expect(cloned).toEqual(original)
      expect(cloned).not.toBe(original)
      expect(cloned.b).not.toBe(original.b)
      expect(cloned.b.d).not.toBe(original.b.d)
    })

    it('handles primitive values', () => {
      expect(deepClone(42)).toBe(42)
      expect(deepClone('string')).toBe('string')
      expect(deepClone(null)).toBe(null)
      expect(deepClone(undefined)).toBe(undefined)
    })

    it('handles dates', () => {
      const date = new Date()
      const cloned = deepClone(date)

      expect(cloned).toEqual(date)
      expect(cloned).not.toBe(date)
    })
  })

  describe('formatNumber', () => {
    it('formats numbers with thousand separators', () => {
      expect(formatNumber(1234)).toBe('1,234')
      expect(formatNumber(1234567)).toBe('1,234,567')
      expect(formatNumber(123)).toBe('123')
    })
  })

  describe('truncateText', () => {
    it('truncates text correctly', () => {
      expect(truncateText('Hello World', 5)).toBe('Hello...')
      expect(truncateText('Short', 10)).toBe('Short')
      expect(truncateText('', 5)).toBe('')
    })
  })

  describe('uniqueArray', () => {
    it('removes duplicates from array', () => {
      expect(uniqueArray([1, 2, 2, 3, 3, 3])).toEqual([1, 2, 3])
      expect(uniqueArray(['a', 'b', 'a', 'c'])).toEqual(['a', 'b', 'c'])
      expect(uniqueArray([])).toEqual([])
    })
  })

  describe('sleep', () => {
    it('resolves after specified time', async () => {
      const start = Date.now()
      await sleep(100)
      const end = Date.now()

      expect(end - start).toBeGreaterThanOrEqual(90) // Allow some tolerance
    })
  })
})
