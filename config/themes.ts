export interface ThemeColors {
  readonly background: string
  readonly foreground: string
  readonly card: string
  readonly "card-foreground": string
  readonly popover: string
  readonly "popover-foreground": string
  readonly primary: string
  readonly "primary-foreground": string
  readonly secondary: string
  readonly "secondary-foreground": string
  readonly muted: string
  readonly "muted-foreground": string
  readonly accent: string
  readonly "accent-foreground": string
  readonly destructive: string
  readonly "destructive-foreground": string
  readonly border: string
  readonly input: string
  readonly ring: string
}

export interface ThemeDefinition {
  readonly name: string
  readonly year?: number
  readonly light: ThemeColors
  readonly dark: ThemeColors
}

export const colorThemes = {
  default: {
    name: "Leo",
    year: 2021,
    light: {
      background: "hsl(0 0% 100%)",
      foreground: "hsl(220 20% 20%)",
      card: "hsl(0 0% 100%)",
      "card-foreground": "hsl(220 20% 20%)",
      popover: "hsl(0 0% 100%)",
      "popover-foreground": "hsl(220 20% 20%)",
      primary: "hsl(142 49% 45%)",
      "primary-foreground": "hsl(0 0% 100%)",
      secondary: "hsl(220 20% 95%)",
      "secondary-foreground": "hsl(220 20% 20%)",
      muted: "hsl(220 20% 95%)",
      "muted-foreground": "hsl(220 20% 40%)",
      accent: "hsl(220 20% 95%)",
      "accent-foreground": "hsl(220 20% 20%)",
      destructive: "hsl(0 100% 50%)",
      "destructive-foreground": "hsl(0 0% 100%)",
      border: "hsl(220 20% 90%)",
      input: "hsl(220 20% 90%)",
      ring: "hsl(142 49% 45%)"
    },
    dark: {
      background: "hsl(220 20% 10%)",
      foreground: "hsl(0 0% 100%)",
      card: "hsl(220 20% 10%)",
      "card-foreground": "hsl(0 0% 100%)",
      popover: "hsl(220 20% 10%)",
      "popover-foreground": "hsl(0 0% 100%)",
      primary: "hsl(142 49% 45%)",
      "primary-foreground": "hsl(0 0% 100%)",
      secondary: "hsl(220 20% 15%)",
      "secondary-foreground": "hsl(0 0% 100%)",
      muted: "hsl(220 20% 15%)",
      "muted-foreground": "hsl(220 20% 60%)",
      accent: "hsl(220 20% 15%)",
      "accent-foreground": "hsl(0 0% 100%)",
      destructive: "hsl(0 100% 50%)",
      "destructive-foreground": "hsl(0 0% 100%)",
      border: "hsl(220 20% 20%)",
      input: "hsl(220 20% 20%)",
      ring: "hsl(142 49% 45%)"
    }
  },
  "very-peri": {
    name: "Very Peri",
    year: 2022,
    light: {
      background: "hsl(0 0% 100%)",
      foreground: "hsl(220 20% 20%)",
      card: "hsl(0 0% 100%)",
      "card-foreground": "hsl(220 20% 20%)",
      popover: "hsl(0 0% 100%)",
      "popover-foreground": "hsl(220 20% 20%)",
      primary: "hsl(239 37% 54%)",
      "primary-foreground": "hsl(0 0% 100%)",
      secondary: "hsl(220 20% 95%)",
      "secondary-foreground": "hsl(220 20% 20%)",
      muted: "hsl(220 20% 95%)",
      "muted-foreground": "hsl(220 20% 40%)",
      accent: "hsl(220 20% 95%)",
      "accent-foreground": "hsl(220 20% 20%)",
      destructive: "hsl(0 100% 50%)",
      "destructive-foreground": "hsl(0 0% 100%)",
      border: "hsl(220 20% 90%)",
      input: "hsl(220 20% 90%)",
      ring: "hsl(239 37% 54%)"
    },
    dark: {
      background: "hsl(220 20% 10%)",
      foreground: "hsl(0 0% 100%)",
      card: "hsl(220 20% 10%)",
      "card-foreground": "hsl(0 0% 100%)",
      popover: "hsl(220 20% 10%)",
      "popover-foreground": "hsl(0 0% 100%)",
      primary: "hsl(239 37% 54%)",
      "primary-foreground": "hsl(0 0% 100%)",
      secondary: "hsl(220 20% 15%)",
      "secondary-foreground": "hsl(0 0% 100%)",
      muted: "hsl(220 20% 15%)",
      "muted-foreground": "hsl(220 20% 60%)",
      accent: "hsl(220 20% 15%)",
      "accent-foreground": "hsl(0 0% 100%)",
      destructive: "hsl(0 100% 50%)",
      "destructive-foreground": "hsl(0 0% 100%)",
      border: "hsl(220 20% 20%)",
      input: "hsl(220 20% 20%)",
      ring: "hsl(239 37% 54%)"
    }
  },
  "viva-magenta": {
    name: "Viva Magenta",
    year: 2023,
    light: {
      background: "hsl(0 0% 100%)",
      foreground: "hsl(220 20% 20%)",
      card: "hsl(0 0% 100%)",
      "card-foreground": "hsl(220 20% 20%)",
      popover: "hsl(0 0% 100%)",
      "popover-foreground": "hsl(220 20% 20%)",
      primary: "hsl(342 65% 47%)",
      "primary-foreground": "hsl(0 0% 100%)",
      secondary: "hsl(220 20% 95%)",
      "secondary-foreground": "hsl(220 20% 20%)",
      muted: "hsl(220 20% 95%)",
      "muted-foreground": "hsl(220 20% 40%)",
      accent: "hsl(220 20% 95%)",
      "accent-foreground": "hsl(220 20% 20%)",
      destructive: "hsl(0 100% 50%)",
      "destructive-foreground": "hsl(0 0% 100%)",
      border: "hsl(220 20% 90%)",
      input: "hsl(220 20% 90%)",
      ring: "hsl(342 65% 47%)"
    },
    dark: {
      background: "hsl(220 20% 10%)",
      foreground: "hsl(0 0% 100%)",
      card: "hsl(220 20% 10%)",
      "card-foreground": "hsl(0 0% 100%)",
      popover: "hsl(220 20% 10%)",
      "popover-foreground": "hsl(0 0% 100%)",
      primary: "hsl(342 65% 47%)",
      "primary-foreground": "hsl(0 0% 100%)",
      secondary: "hsl(220 20% 15%)",
      "secondary-foreground": "hsl(0 0% 100%)",
      muted: "hsl(220 20% 15%)",
      "muted-foreground": "hsl(220 20% 60%)",
      accent: "hsl(220 20% 15%)",
      "accent-foreground": "hsl(0 0% 100%)",
      destructive: "hsl(0 100% 50%)",
      "destructive-foreground": "hsl(0 0% 100%)",
      border: "hsl(220 20% 20%)",
      input: "hsl(220 20% 20%)",
      ring: "hsl(342 65% 47%)"
    }
  },
  "peach-fuzz": {
    name: "Peach Fuzz",
    year: 2024,
    light: {
      background: "hsl(0 0% 100%)",
      foreground: "hsl(220 20% 20%)",
      card: "hsl(0 0% 100%)",
      "card-foreground": "hsl(220 20% 20%)",
      popover: "hsl(0 0% 100%)",
      "popover-foreground": "hsl(220 20% 20%)",
      primary: "hsl(20 100% 80%)",
      "primary-foreground": "hsl(220 20% 20%)",
      secondary: "hsl(220 20% 95%)",
      "secondary-foreground": "hsl(220 20% 20%)",
      muted: "hsl(220 20% 95%)",
      "muted-foreground": "hsl(220 20% 40%)",
      accent: "hsl(220 20% 95%)",
      "accent-foreground": "hsl(220 20% 20%)",
      destructive: "hsl(0 100% 50%)",
      "destructive-foreground": "hsl(0 0% 100%)",
      border: "hsl(220 20% 90%)",
      input: "hsl(220 20% 90%)",
      ring: "hsl(20 100% 80%)"
    },
    dark: {
      background: "hsl(220 20% 10%)",
      foreground: "hsl(0 0% 100%)",
      card: "hsl(220 20% 10%)",
      "card-foreground": "hsl(0 0% 100%)",
      popover: "hsl(220 20% 10%)",
      "popover-foreground": "hsl(0 0% 100%)",
      primary: "hsl(20 100% 80%)",
      "primary-foreground": "hsl(220 20% 20%)",
      secondary: "hsl(220 20% 15%)",
      "secondary-foreground": "hsl(0 0% 100%)",
      muted: "hsl(220 20% 15%)",
      "muted-foreground": "hsl(220 20% 60%)",
      accent: "hsl(220 20% 15%)",
      "accent-foreground": "hsl(0 0% 100%)",
      destructive: "hsl(0 100% 50%)",
      "destructive-foreground": "hsl(0 0% 100%)",
      border: "hsl(220 20% 20%)",
      input: "hsl(220 20% 20%)",
      ring: "hsl(20 100% 80%)"
    }
  },
  "mocha-mousse": {
    name: "Mocha Mousse",
    year: 2025,
    light: {
      background: "hsl(0 0% 100%)",
      foreground: "hsl(220 20% 20%)",
      card: "hsl(0 0% 100%)",
      "card-foreground": "hsl(220 20% 20%)",
      popover: "hsl(0 0% 100%)",
      "popover-foreground": "hsl(220 20% 20%)",
      primary: "hsl(20 15% 50%)",
      "primary-foreground": "hsl(0 0% 100%)",
      secondary: "hsl(220 20% 95%)",
      "secondary-foreground": "hsl(220 20% 20%)",
      muted: "hsl(220 20% 95%)",
      "muted-foreground": "hsl(220 20% 40%)",
      accent: "hsl(220 20% 95%)",
      "accent-foreground": "hsl(220 20% 20%)",
      destructive: "hsl(0 100% 50%)",
      "destructive-foreground": "hsl(0 0% 100%)",
      border: "hsl(220 20% 90%)",
      input: "hsl(220 20% 90%)",
      ring: "hsl(20 15% 50%)"
    },
    dark: {
      background: "hsl(220 20% 10%)",
      foreground: "hsl(0 0% 100%)",
      card: "hsl(220 20% 10%)",
      "card-foreground": "hsl(0 0% 100%)",
      popover: "hsl(220 20% 10%)",
      "popover-foreground": "hsl(0 0% 100%)",
      primary: "hsl(20 15% 50%)",
      "primary-foreground": "hsl(0 0% 100%)",
      secondary: "hsl(220 20% 15%)",
      "secondary-foreground": "hsl(0 0% 100%)",
      muted: "hsl(220 20% 15%)",
      "muted-foreground": "hsl(220 20% 60%)",
      accent: "hsl(220 20% 15%)",
      "accent-foreground": "hsl(0 0% 100%)",
      destructive: "hsl(0 100% 50%)",
      "destructive-foreground": "hsl(0 0% 100%)",
      border: "hsl(220 20% 20%)",
      input: "hsl(220 20% 20%)",
      ring: "hsl(20 15% 50%)"
    }
  }
} as const

export type ThemeType = keyof typeof colorThemes

export type ColorMode = 'light' | 'dark'

export type Colors = typeof colorThemes[ThemeType][ColorMode] 