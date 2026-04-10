import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  private readonly API = 'http://localhost:8080/api/usuarios/login';

  // Realiza o login e guarda os dados no localStorage
  login(loginData: any): Observable<any> {
    return this.http.post<any>(this.API, loginData).pipe(
      tap(res => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('usuarioLogado', JSON.stringify(res));
        }
      })
    );
  }

  // Verifica se existe uma sessão ativa
  isUsuarioLogado(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem('usuarioLogado');
    }
    return false;
  }

  // Finaliza a sessão e limpa os dados
  executarLogout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('usuarioLogado');
      this.router.navigate(['/login']);
    }
  }

  // Retorna os dados do utilizador guardado
  getDadosUsuario(): any {
    if (isPlatformBrowser(this.platformId)) {
      const user = localStorage.getItem('usuarioLogado');
      return user ? JSON.parse(user) : null;
    }
    return null;
  }
}
