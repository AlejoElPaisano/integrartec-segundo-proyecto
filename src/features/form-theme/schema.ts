export type BorderRadius = "none" | "sm" | "md" | "lg" | "xl" | "full";

export type FontFamily = "sans" | "serif" | "mono" | "display" | "rounded";

export type Spacing = "compact" | "normal" | "relaxed";

export type Pattern = "none" | "dots" | "grid" | "waves" | "checkered" | "stars" | "carbon";

export type LogoPosition = "left" | "center" | "right";

export type TitleAlignment = "left" | "center" | "right";

export type SubmitAnimation =
  | "none"
  | "pulse"
  | "shake"
  | "zoom"
  | "race"
  | "bounce"
  | "confetti"
  | "rocket";

export type FieldEntranceAnimation =
  | "none"
  | "fade-up"
  | "slide-left"
  | "scale-in"
  | "race-in"
  | "flip-in";

export type CardStyle = "flat" | "elevated" | "glass" | "outline";

export type FormShadow = "none" | "sm" | "md" | "lg" | "xl" | "2xl";

export type BorderWidth = "none" | "thin" | "medium" | "thick";

export interface FormTheme {
  presetId: string;
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  emoji: string;
  borderRadius: BorderRadius;
  fontFamily: FontFamily;
  headingFontFamily: FontFamily;
  spacing: Spacing;
  pattern: Pattern;
  backgroundImage?: string;
  backgroundOverlay?: string;
  logoImage?: string;
  logoPosition: LogoPosition;
  titleAlignment: TitleAlignment;
  submitAnimation: SubmitAnimation;
  fieldEntranceAnimation: FieldEntranceAnimation;
  submitLabel: string;
  cardStyle: CardStyle;
  showProgressBar: boolean;
  /* New style properties */
  shadow: FormShadow;
  borderWidth: BorderWidth;
  borderColor: string;
  backgroundGradient?: string;
  backgroundOpacity: number;
  /** @deprecated Use emoji.length > 0 instead */
  showEmoji?: boolean;
}
