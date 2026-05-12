import featuresConfig from './config/features.json'

interface EmailVerificationConfig {
  enabled: boolean
  otpExpiryMinutes: number
  maxResendPerHour: number
  maxVerifyAttempts: number
}

interface NewTopicConfig {
  enabled: boolean
}

interface FeaturesConfig {
  emailVerification: EmailVerificationConfig
  newTopic: NewTopicConfig
}

const features = featuresConfig as FeaturesConfig

export function isEmailVerificationEnabled(): boolean {
  return features.emailVerification.enabled
}

export function getEmailVerificationConfig(): EmailVerificationConfig {
  return features.emailVerification
}

export function isNewTopicEnabled(): boolean {
  return features.newTopic.enabled
}
