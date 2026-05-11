import featuresConfig from './config/features.json'

interface EmailVerificationConfig {
  enabled: boolean
  otpExpiryMinutes: number
  maxResendPerHour: number
  maxVerifyAttempts: number
}

interface FeaturesConfig {
  emailVerification: EmailVerificationConfig
}

const features = featuresConfig as FeaturesConfig

export function isEmailVerificationEnabled(): boolean {
  return features.emailVerification.enabled
}

export function getEmailVerificationConfig(): EmailVerificationConfig {
  return features.emailVerification
}
