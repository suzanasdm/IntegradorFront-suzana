// cadastro.ts
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './cadastro.html',
  styleUrl: './cadastro.css',
})
export class Cadastro implements OnInit {
  private platformId = inject(PLATFORM_ID);
  private fb = inject(FormBuilder);
  cadastroForm!: FormGroup;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    // Inicializa o formulário seguindo a lógica de validação
    this.cadastroForm = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // A função que faz a "mágica" de enviar para o banco
  cadastrar() {
    if (this.cadastroForm.valid) {
      const payload = this.cadastroForm.value;
      
      // Envia para o seu Back-end em Java/Node
      this.http.post('http://localhost:8080/api/usuarios', payload).subscribe({
        next: (res: any) => {
          if (isPlatformBrowser(this.platformId)) {
            // Salva o usuário igual você faz no login/dashboard
            localStorage.setItem('usuarioLogado', JSON.stringify(res));
            // Navega para o dashboard funcional
            this.router.navigate(['/login']);
          }
        },
        error: (err) => console.error('Erro ao cadastrar', err)
      });
    }
  }
  voltarParaLogin() {
    this.router.navigate(['/login']);
  }
}