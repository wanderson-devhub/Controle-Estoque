/**
 * @jest-environment node
 */
import { POST } from '@/app/api/auth/login/route'
import { NextRequest } from 'next/server'
import prisma from '@/lib/db'
import bcrypt from 'bcryptjs'
import * as authModule from '@/lib/auth'

// Mock dependencies
jest.mock('@/lib/db', () => ({
  __esModule: true,
  default: {
    user: {
      findFirst: jest.fn(),
      findUnique: jest.fn(),
    },
  },
}))

jest.mock('bcryptjs')
jest.mock('@/lib/auth')

describe('Login API Route', () => {
  const mockUser = {
    id: 'user-1',
    email: 'test@example.com',
    warName: 'TestUser',
    isAdmin: false,
    password: '$2a$10$...',
    rank: 'Soldado',
    company: 'A',
    phone: '11987654321',
    total: 0,
    resetToken: null,
    resetTokenExpiry: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Validation', () => {
    it('should return 400 if email is missing', async () => {
      const request = {
        json: async () => ({ password: 'password123' }),
      } as NextRequest

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Email/Nome de Guerra e senha são obrigatórios')
    })

    it('should return 400 if password is missing', async () => {
      const request = {
        json: async () => ({ email: 'test@example.com' }),
      } as NextRequest

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Email/Nome de Guerra e senha são obrigatórios')
    })

    it('should return 400 if both email and password are missing', async () => {
      const request = {
        json: async () => ({}),
      } as NextRequest

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Email/Nome de Guerra e senha são obrigatórios')
    })

    it('should return 400 if email is not a string', async () => {
      const request = {
        json: async () => ({ email: 123, password: 'password123' }),
      } as NextRequest

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
    })

    it('should return 400 if password is not a string', async () => {
      const request = {
        json: async () => ({ email: 'test@example.com', password: 123 }),
      } as NextRequest

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
    })

    it('should return 400 if email is an empty string', async () => {
      const request = {
        json: async () => ({ email: '', password: 'password123' }),
      } as NextRequest

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Email/Nome de Guerra e senha são obrigatórios')
    })

    it('should return 400 if password is an empty string', async () => {
      const request = {
        json: async () => ({ email: 'test@example.com', password: '' }),
      } as NextRequest

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Email/Nome de Guerra e senha são obrigatórios')
    })

    it('should return 400 if email is only whitespace', async () => {
      const request = {
        json: async () => ({ email: '   ', password: 'password123' }),
      } as NextRequest

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Email/Nome de Guerra e senha são obrigatórios')
    })

    it('should trim and lowercase email', async () => {
      ;(prisma.user.findFirst as jest.Mock).mockResolvedValue(mockUser)
      ;(bcrypt.compare as jest.Mock).mockResolvedValue(true)
      ;(authModule.createSession as jest.Mock).mockResolvedValue(undefined)

      const request = {
        json: async () => ({
          email: '  TEST@EXAMPLE.COM  ',
          password: 'password123',
        }),
      } as NextRequest

      await POST(request)

      expect(prisma.user.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: expect.arrayContaining([
              expect.objectContaining({
                email: { equals: 'test@example.com', mode: 'insensitive' },
              }),
            ]),
          }),
        })
      )
    })
  })

  describe('User Lookup', () => {
    it('should find user by email (case-insensitive)', async () => {
      ;(prisma.user.findFirst as jest.Mock).mockResolvedValue(mockUser)
      ;(bcrypt.compare as jest.Mock).mockResolvedValue(true)
      ;(authModule.createSession as jest.Mock).mockResolvedValue(undefined)

      const request = {
        json: async () => ({
          email: 'test@example.com',
          password: 'password123',
        }),
      } as NextRequest

      await POST(request)

      expect(prisma.user.findFirst).toHaveBeenCalledWith({
        where: {
          OR: [
            { email: { equals: 'test@example.com', mode: 'insensitive' } },
            { warName: { equals: 'test@example.com', mode: 'insensitive' } },
          ],
        },
      })
    })

    it('should find user by warName if email not found', async () => {
      ;(prisma.user.findFirst as jest.Mock).mockResolvedValue(mockUser)
      ;(bcrypt.compare as jest.Mock).mockResolvedValue(true)
      ;(authModule.createSession as jest.Mock).mockResolvedValue(undefined)

      const request = {
        json: async () => ({
          email: 'TestUser',
          password: 'password123',
        }),
      } as NextRequest

      await POST(request)

      expect(prisma.user.findFirst).toHaveBeenCalledWith({
        where: {
          OR: [
            { email: { equals: 'testuser', mode: 'insensitive' } },
            { warName: { equals: 'testuser', mode: 'insensitive' } },
          ],
        },
      })
    })

    it('should return 401 if user not found', async () => {
      ;(prisma.user.findFirst as jest.Mock).mockResolvedValue(null)

      const request = {
        json: async () => ({
          email: 'nonexistent@example.com',
          password: 'password123',
        }),
      } as NextRequest

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Usuário não encontrado')
    })
  })

  describe('Password Validation', () => {
    it('should return 401 if password is incorrect', async () => {
      ;(prisma.user.findFirst as jest.Mock).mockResolvedValue(mockUser)
      ;(bcrypt.compare as jest.Mock).mockResolvedValue(false)

      const request = {
        json: async () => ({
          email: 'test@example.com',
          password: 'wrongpassword',
        }),
      } as NextRequest

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Senha incorreta')
    })

    it('should return 401 if user has no password set', async () => {
      const userWithoutPassword = { ...mockUser, password: null }
      ;(prisma.user.findFirst as jest.Mock).mockResolvedValue(
        userWithoutPassword
      )

      const request = {
        json: async () => ({
          email: 'test@example.com',
          password: 'password123',
        }),
      } as NextRequest

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Credenciais inválidas')
    })

    it('should call bcrypt.compare with correct arguments', async () => {
      ;(prisma.user.findFirst as jest.Mock).mockResolvedValue(mockUser)
      ;(bcrypt.compare as jest.Mock).mockResolvedValue(true)
      ;(authModule.createSession as jest.Mock).mockResolvedValue(undefined)

      const request = {
        json: async () => ({
          email: 'test@example.com',
          password: 'password123',
        }),
      } as NextRequest

      await POST(request)

      expect(bcrypt.compare).toHaveBeenCalledWith(
        'password123',
        mockUser.password
      )
    })
  })

  describe('Session Creation', () => {
    it('should create session on successful login', async () => {
      ;(prisma.user.findFirst as jest.Mock).mockResolvedValue(mockUser)
      ;(bcrypt.compare as jest.Mock).mockResolvedValue(true)
      ;(authModule.createSession as jest.Mock).mockResolvedValue(undefined)

      const request = {
        json: async () => ({
          email: 'test@example.com',
          password: 'password123',
        }),
      } as NextRequest

      await POST(request)

      expect(authModule.createSession).toHaveBeenCalledWith(mockUser)
    })
  })

  describe('Success Response', () => {
    it('should return 200 with user data on successful login', async () => {
      ;(prisma.user.findFirst as jest.Mock).mockResolvedValue(mockUser)
      ;(bcrypt.compare as jest.Mock).mockResolvedValue(true)
      ;(authModule.createSession as jest.Mock).mockResolvedValue(undefined)

      const request = {
        json: async () => ({
          email: 'test@example.com',
          password: 'password123',
        }),
      } as NextRequest

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.user).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        warName: mockUser.warName,
        isAdmin: mockUser.isAdmin,
      })
    })

    it('should not return password in response', async () => {
      ;(prisma.user.findFirst as jest.Mock).mockResolvedValue(mockUser)
      ;(bcrypt.compare as jest.Mock).mockResolvedValue(true)
      ;(authModule.createSession as jest.Mock).mockResolvedValue(undefined)

      const request = {
        json: async () => ({
          email: 'test@example.com',
          password: 'password123',
        }),
      } as NextRequest

      const response = await POST(request)
      const data = await response.json()

      expect(data.user).not.toHaveProperty('password')
    })
  })

  describe('Error Handling', () => {
    it('should return 500 on internal server error', async () => {
      ;(prisma.user.findFirst as jest.Mock).mockRejectedValue(
        new Error('Database error')
      )

      const request = {
        json: async () => ({
          email: 'test@example.com',
          password: 'password123',
        }),
      } as NextRequest

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Internal server error')
    })

    it('should log error on internal server error', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
      ;(prisma.user.findFirst as jest.Mock).mockRejectedValue(
        new Error('Database error')
      )

      const request = {
        json: async () => ({
          email: 'test@example.com',
          password: 'password123',
        }),
      } as NextRequest

      await POST(request)

      expect(consoleSpy).toHaveBeenCalledWith(
        'Login error:',
        expect.any(Error)
      )

      consoleSpy.mockRestore()
    })
  })

  describe('Admin Users', () => {
    it('should return isAdmin=true for admin users', async () => {
      const adminUser = { ...mockUser, isAdmin: true }
      ;(prisma.user.findFirst as jest.Mock).mockResolvedValue(adminUser)
      ;(bcrypt.compare as jest.Mock).mockResolvedValue(true)
      ;(authModule.createSession as jest.Mock).mockResolvedValue(undefined)

      const request = {
        json: async () => ({
          email: 'test@example.com',
          password: 'password123',
        }),
      } as NextRequest

      const response = await POST(request)
      const data = await response.json()

      expect(data.user.isAdmin).toBe(true)
    })

    it('should return isAdmin=false for regular users', async () => {
      ;(prisma.user.findFirst as jest.Mock).mockResolvedValue(mockUser)
      ;(bcrypt.compare as jest.Mock).mockResolvedValue(true)
      ;(authModule.createSession as jest.Mock).mockResolvedValue(undefined)

      const request = {
        json: async () => ({
          email: 'test@example.com',
          password: 'password123',
        }),
      } as NextRequest

      const response = await POST(request)
      const data = await response.json()

      expect(data.user.isAdmin).toBe(false)
    })
  })
})
