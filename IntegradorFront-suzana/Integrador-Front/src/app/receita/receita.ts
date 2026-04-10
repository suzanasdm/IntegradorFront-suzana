import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-receita',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './receita.html',
  styleUrl: './receita.css',
})
export class Receita implements OnInit {
  private platformId = inject(PLATFORM_ID);
  private http = inject(HttpClient);
  private router = inject(Router);

  usuarioId: number = 0;
  usuarioNome: string = '';
  usuarioCompleto: any = {};

  contasBancarias: any[] = [];
  categorias: any[] = [];
  listaReceitas: any[] = [];

  exibirSidebar: boolean = false;
  exibirInputCategoria = false;
  novaCategoriaNome = '';

  // ✅ CORRIGIDO (categoriaId como number)
  dadosForm = {
    descricao: '',
    valor: 0,
    data: '',
    categoriaId: 0
  };

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const user = JSON.parse(localStorage.getItem('usuarioLogado') || '{}');

      this.usuarioId = user?.id || 0;
      this.usuarioNome = user?.nome || 'Usuário';
      this.usuarioCompleto = user;

      if (!this.usuarioId) {
        this.router.navigate(['/login']);
        return;
      }

      this.carregarCategorias();
      this.carregarReceitas();
      this.carregarContas();
    }
  }

  toggleSidebar(): void {
    this.exibirSidebar = !this.exibirSidebar;
  }

  carregarContas() {
    this.http.get<any[]>(`http://localhost:8080/api/contas/usuario/${this.usuarioId}`)
      .subscribe({
        next: (res) => this.contasBancarias = res,
        error: (err) => console.error('Erro ao buscar contas', err)
      });
  }

  carregarCategorias() {
    this.http.get<any[]>(`http://localhost:8080/api/categorias/usuario/${this.usuarioId}`)
      .subscribe({
        next: (res) => this.categorias = res,
        error: (err) => console.error('Erro ao buscar categorias', err)
      });
  }

  carregarReceitas() {
    this.http.get<any[]>(`http://localhost:8080/api/receitas/usuario/${this.usuarioId}`)
      .subscribe({
        next: (res) => this.listaReceitas = res,
        error: (err) => console.error('Erro ao buscar receitas', err)
      });
  }

  salvarCategoria() {
    if (!this.novaCategoriaNome) return;

    const payload = {
      nome: this.novaCategoriaNome,
      usuarioId: this.usuarioId
    };

    this.http.post('http://localhost:8080/api/categorias', payload).subscribe({
      next: (res: any) => {
        this.categorias.push(res);

        // ✅ seta o ID corretamente
        this.dadosForm.categoriaId = res.id;

        this.novaCategoriaNome = '';
        this.exibirInputCategoria = false;
      },
      error: (err) => console.error('Erro ao salvar categoria', err)
    });
  }

  salvarReceita() {

    // 🚨 VALIDAÇÃO (evita erro no backend)
    if (!this.dadosForm.descricao || !this.dadosForm.valor || !this.dadosForm.categoriaId) {
      alert('Preencha todos os campos!');
      return;
    }

    const payload = {
      descricao: this.dadosForm.descricao,
      valor: this.dadosForm.valor,
      data: this.dadosForm.data,
      usuarioId: this.usuarioId,
      categoriaId: Number(this.dadosForm.categoriaId) // 🔥 GARANTE NUMBER
    };

    console.log('Payload enviado:', payload);

    this.http.post('http://localhost:8080/api/receitas', payload).subscribe({
      next: () => {
        this.carregarReceitas();

        // reset correto
        this.dadosForm = {
          descricao: '',
          valor: 0,
          data: '',
          categoriaId: 0

        };
      },
      error: (err) => console.error('Erro ao salvar receita', err)
    });
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('usuarioLogado');
      this.router.navigate(['/login']);
    }
  }
}
