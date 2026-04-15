// Configuración de juegos — actualizar según se agreguen nuevos juegos
export const TEAM_GAMES = [
  'Valorant',
  'League of Legends',
  'Rocket League',
  'Overwatch',
  'Marvel Rivals',
  'Clash Royale',
] as const;

export const SOLO_GAMES = [
  'Fortnite',
  'Super Smash Bros',
] as const;

export function isTeamGame(game: string): boolean {
  return TEAM_GAMES.includes(game as any);
}

export function isSoloGame(game: string): boolean {
  return SOLO_GAMES.includes(game as any);
}