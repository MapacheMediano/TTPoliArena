export function isIpnStudentEmail(email: string) {
  const e = email.trim().toLowerCase();
  return e.endsWith("@alumno.ipn.mx");
}