export class AuthService {
  static logout() {
    window.location.href = "/login";
  }

  static redirectToLogin() {
    window.location.href = "/login";
  }
}
