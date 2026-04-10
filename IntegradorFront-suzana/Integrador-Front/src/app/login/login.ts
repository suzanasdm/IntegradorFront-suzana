import { Component, OnInit, inject } from '@angular/core';
import { LoginService }from '../services/login';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  // Importante: ReactiveFormsModule não é necessário aqui pois você usa [(ngModel)] (Template Driven)
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  // Atualize aqui o nome da propriedade e do Service injetado
  private loginService = inject(LoginService);
  private router = inject(Router);

  loginData = { email: '', senha: '' };
  errorMessage: string = '';

  ngOnInit(): void {
    // Usando o método renomeado
    if (this.loginService.isUsuarioLogado()) {
      this.router.navigate(['/login']);
    }
  }

  onLogin() {
    if (!this.loginData.email || !this.loginData.senha) {
      this.errorMessage = 'Por favor, preencha todos os campos.';
      return;
    }

    this.loginService.login(this.loginData).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Erro no login:', err);
        this.errorMessage = 'E-mail ou senha incorretos.';
      }
    });
  }
}
