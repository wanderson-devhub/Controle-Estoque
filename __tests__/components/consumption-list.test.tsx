import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { ConsumptionList } from '@/components/consumption-list'

// Mock fetch
global.fetch = jest.fn()

describe('ConsumptionList Component', () => {
  const mockConsumptions = [
    {
      id: '1',
      date: '2025-01-08T10:00:00Z',
      item: 'Coffee',
      quantity: 2,
      unitPrice: 5.0,
      total: 10.0,
      userId: 'user-1',
    },
    {
      id: '2',
      date: '2025-01-07T14:30:00Z',
      item: 'Lunch',
      quantity: 1,
      unitPrice: 25.0,
      total: 25.0,
      userId: 'user-1',
    },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockConsumptions,
    })
  })

  it('should fetch consumptions on mount', async () => {
    render(<ConsumptionList />)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/api/consumptions'))
    })
  })

  it('should display consumptions list', async () => {
    render(<ConsumptionList />)

    await waitFor(() => {
      expect(screen.getByText('Coffee')).toBeInTheDocument()
      expect(screen.getByText('Lunch')).toBeInTheDocument()
    })
  })

  it('should handle loading state', () => {
    ;(global.fetch as jest.Mock).mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                ok: true,
                json: async () => mockConsumptions,
              }),
            100
          )
        )
    )

    render(<ConsumptionList />)
    expect(screen.getByText(/carregando|loading/i)).toBeInTheDocument()
  })

  it('should handle error state', async () => {
    ;(global.fetch as jest.Mock).mockRejectedValue(new Error('Fetch failed'))

    render(<ConsumptionList />)

    await waitFor(() => {
      expect(
        screen.getByText(/nenhum gasto|no consumptions/i)
      ).toBeInTheDocument()
    })
  })

  it('should handle empty list', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => [],
    })

    render(<ConsumptionList />)

    await waitFor(() => {
      expect(
        screen.getByText(/nenhum gasto|no consumptions/i)
      ).toBeInTheDocument()
    })
  })
})